import assert from 'node:assert/strict';
import { type AddressInfo } from 'node:net';
import test from 'node:test';

process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.CLIENT_URLS = 'http://localhost:5173,http://localhost:4173';
process.env.API_BASE_URL = '/api/v1';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/gta6-guide-test-placeholder';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-64-characters-long-000000000000000000000000';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-64-characters-long-1111111111111111111111';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.COOKIE_SECRET = 'test-cookie-secret-64-characters-long-222222222222222222222222';
process.env.REFRESH_TOKEN_COOKIE_NAME = 'gta6_refresh_token_test';
process.env.BCRYPT_SALT_ROUNDS = '10';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
process.env.AUTH_RATE_LIMIT_WINDOW_MS = '900000';
process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = '1000';
process.env.LOG_LEVEL = 'silent';

type ApiResponse<TData = unknown> = {
  success: boolean;
  message: string;
  data?: TData;
  meta?: unknown;
};

type AuthData = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

async function readJson<TData>(response: Response) {
  return (await response.json()) as ApiResponse<TData>;
}

async function createServer() {
  const { app } = await import('../src/server/app.js');
  const server = app.listen(0);
  await new Promise<void>((resolve) => {
    server.once('listening', () => resolve());
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;

  return { server, baseUrl };
}

test('health endpoint and protected route smoke test', async () => {
  const { server, baseUrl } = await createServer();

  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    const health = await readJson(healthResponse);

    assert.equal(healthResponse.status, 503);
    assert.equal(health.success, true);

    const protectedResponse = await fetch(`${baseUrl}/bookmarks`);
    const protectedPayload = await readJson(protectedResponse);

    assert.equal(protectedResponse.status, 401);
    assert.equal(protectedPayload.success, false);
  } finally {
    server.close();
  }
});

test(
  'authentication, bookmarks, comments, and admin CRUD integration flow',
  { skip: !process.env.TEST_MONGODB_URI },
  async () => {
    if (!process.env.TEST_MONGODB_URI?.toLowerCase().includes('test')) {
      throw new Error('Refusing to run integration tests unless TEST_MONGODB_URI includes "test".');
    }

    const mongoose = await import('mongoose');
    const { USER_ROLES } = await import('@gta6-guide/shared/roles');
    const { CategoryModel } = await import('../src/models/Category.model.js');
    const { GuideModel } = await import('../src/models/Guide.model.js');
    const { UserModel } = await import('../src/models/User.model.js');
    const { hashPassword } = await import('../src/utils/password.js');
    const { server, baseUrl } = await createServer();

    await mongoose.connect(process.env.TEST_MONGODB_URI);

    try {
      await Promise.all(
        Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})),
      );

      const passwordHash = await hashPassword('Password123!');
      const admin = await UserModel.create({
        name: 'Admin User',
        username: 'admin_user',
        email: 'admin@example.com',
        passwordHash,
        role: USER_ROLES.ADMIN,
        status: 'active',
        isEmailVerified: true,
      });

      const user = await UserModel.create({
        name: 'Regular User',
        username: 'regular_user',
        email: 'regular@example.com',
        passwordHash,
        role: USER_ROLES.USER,
        status: 'active',
        isEmailVerified: true,
      });

      const login = async (email: string) => {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: 'Password123!' }),
        });
        const payload = await readJson<AuthData>(response);

        assert.equal(response.status, 200);
        assert.equal(typeof payload.data?.accessToken, 'string');

        return payload.data!.accessToken;
      };

      const adminToken = await login('admin@example.com');
      const userToken = await login('regular@example.com');

      const meResponse = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const mePayload = await readJson<{ email: string }>(meResponse);

      assert.equal(meResponse.status, 200);
      assert.equal(mePayload.data?.email, user.email);

      const category = await CategoryModel.create({
        title: 'Missions',
        slug: 'missions-test',
        description: 'Mission walkthroughs and campaign guides for testing.',
        accent: 'cyan',
        isActive: true,
        order: 1,
      });

      const guide = await GuideModel.create({
        title: 'Vice City Starter Guide',
        slug: 'vice-city-starter-guide-test',
        excerpt: 'A complete beginner-friendly starter guide for testing API flows.',
        content: 'This test guide contains enough content to pass validation and support search flows.',
        sections: [],
        faqs: [],
        categoryId: category._id,
        authorId: admin._id,
        tags: ['starter', 'mission'],
        tagIds: ['starter', 'mission'],
        type: 'Mission',
        difficulty: 'Beginner',
        status: 'published',
        visibility: 'public',
        readTime: 4,
        isFeatured: false,
        publishedAt: new Date(),
      });

      await GuideModel.create({
        title: 'Internal Draft Guide',
        slug: 'internal-draft-guide-test',
        excerpt: 'A draft guide that should never appear in public guide listings.',
        content: 'This draft guide exists to verify public APIs do not expose unpublished content.',
        sections: [],
        faqs: [],
        categoryId: category._id,
        authorId: admin._id,
        tags: ['internal'],
        tagIds: ['internal'],
        type: 'Mission',
        difficulty: 'Beginner',
        status: 'draft',
        visibility: 'public',
        readTime: 3,
        isFeatured: false,
      });

      await GuideModel.create({
        title: 'Private Strategy Guide',
        slug: 'private-strategy-guide-test',
        excerpt: 'A private published guide that should never appear in public APIs.',
        content: 'This private guide exists to verify visibility enforcement on public API routes.',
        sections: [],
        faqs: [],
        categoryId: category._id,
        authorId: admin._id,
        tags: ['private-strategy'],
        tagIds: ['private-strategy'],
        type: 'Mission',
        difficulty: 'Beginner',
        status: 'published',
        visibility: 'private',
        readTime: 3,
        isFeatured: false,
        publishedAt: new Date(),
      });

      const inactiveCategory = await CategoryModel.create({
        title: 'Internal Category',
        slug: 'internal-category-test',
        description: 'An inactive category that should not be visible through public category APIs.',
        accent: 'purple',
        isActive: false,
        order: 99,
      });

      const publicDraftLeakResponse = await fetch(`${baseUrl}/guides?status=draft`);
      const publicDraftLeakPayload = await readJson<Array<{ slug: string }>>(publicDraftLeakResponse);

      assert.equal(publicDraftLeakResponse.status, 200);
      assert.deepEqual(publicDraftLeakPayload.data?.map((item) => item.slug), ['vice-city-starter-guide-test']);

      const privateGuideResponse = await fetch(`${baseUrl}/guides/slug/private-strategy-guide-test`);
      assert.equal(privateGuideResponse.status, 404);

      const searchPrivateResponse = await fetch(`${baseUrl}/search?q=private-strategy&limit=24`);
      const searchPrivatePayload = await readJson<Array<{ slug: string }>>(searchPrivateResponse);

      assert.equal(searchPrivateResponse.status, 200);
      assert.equal(searchPrivatePayload.data?.length, 0);

      const inactiveCategoryResponse = await fetch(`${baseUrl}/categories/slug/${inactiveCategory.slug}`);
      assert.equal(inactiveCategoryResponse.status, 404);

      const adminGuidesResponse = await fetch(`${baseUrl}/guides?status=draft`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const adminGuidesPayload = await readJson<Array<{ slug: string }>>(adminGuidesResponse);

      assert.equal(adminGuidesResponse.status, 200);
      assert.ok(adminGuidesPayload.data?.some((item) => item.slug === 'internal-draft-guide-test'));

      const bookmarkResponse = await fetch(`${baseUrl}/bookmarks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guideId: String(guide._id) }),
      });

      assert.equal(bookmarkResponse.status, 201);

      const bookmarkStatusResponse = await fetch(`${baseUrl}/bookmarks/guide/${String(guide._id)}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const bookmarkStatus = await readJson<{ isBookmarked: boolean }>(bookmarkStatusResponse);

      assert.equal(bookmarkStatus.data?.isBookmarked, true);

      const commentResponse = await fetch(`${baseUrl}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guideId: String(guide._id),
          body: 'This guide helped me understand the mission setup.',
        }),
      });
      const comment = await readJson<{ id: string; status: string }>(commentResponse);

      assert.equal(commentResponse.status, 201);
      assert.equal(comment.data?.status, 'pending');

      const approveResponse = await fetch(`${baseUrl}/comments/${comment.data?.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      assert.equal(approveResponse.status, 200);

      const createCategoryResponse = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Vehicles',
          description: 'Vehicle location and performance guides for testing.',
          accent: 'pink',
          isActive: true,
          order: 2,
          seo: {
            metaTitle: 'Vehicles',
            metaDescription: 'Vehicle location and performance guides for testing.',
          },
        }),
      });
      const createdCategory = await readJson<{ _id?: string; id?: string }>(createCategoryResponse);
      const createdCategoryId = createdCategory.data?._id ?? createdCategory.data?.id;

      assert.equal(createCategoryResponse.status, 201);
      assert.ok(createdCategoryId);

      const createGuideResponse = await fetch(`${baseUrl}/guides`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Fastest Cars Route Guide',
          excerpt: 'A tested guide for finding fast cars and preparing optimized routes.',
          content: 'Use this guide to test admin guide creation, updating, and deletion paths.',
          sections: [],
          faqs: [],
          categoryId: createdCategoryId,
          tags: ['vehicles'],
          tagIds: ['vehicles'],
          type: 'Vehicle',
          difficulty: 'Intermediate',
          status: 'published',
          visibility: 'public',
          coverImage: '',
          readTime: 5,
          isFeatured: false,
          seo: {
            metaTitle: 'Fastest Cars Route Guide',
            metaDescription: 'A tested guide for finding fast cars and preparing optimized routes.',
            canonicalUrl: '',
            keywords: ['vehicles'],
            ogImage: '',
          },
          gameMeta: {
            missionName: '',
            characterNames: [],
            locationNames: ['Vice City'],
            vehicleNames: ['Sports car'],
            weaponNames: [],
            platform: '',
            gameVersion: '',
          },
        }),
      });
      const createdGuide = await readJson<{ _id?: string; id?: string }>(createGuideResponse);
      const createdGuideId = createdGuide.data?._id ?? createdGuide.data?.id;

      assert.equal(createGuideResponse.status, 201);
      assert.ok(createdGuideId);

      const updateGuideResponse = await fetch(`${baseUrl}/guides/${createdGuideId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: true }),
      });

      assert.equal(updateGuideResponse.status, 200);

      const deleteGuideResponse = await fetch(`${baseUrl}/guides/${createdGuideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      assert.equal(deleteGuideResponse.status, 200);
    } finally {
      await mongoose.disconnect();
      server.close();
    }
  },
);
