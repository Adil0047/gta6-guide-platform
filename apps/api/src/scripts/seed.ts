import { COMMENT_STATUSES } from '@gta6-guide/shared/community';
import { createSlug } from '@gta6-guide/shared/slug';

import { connectDatabase, disconnectDatabase } from '@/config/database.js';
import { BookmarkModel } from '@/models/Bookmark.model.js';
import { CategoryModel } from '@/models/Category.model.js';
import { CommentModel } from '@/models/Comment.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { UserModel } from '@/models/User.model.js';
import { hashPassword } from '@/utils/password.js';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@gta6guide.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'AdminPass123!';
const DEMO_USER_EMAIL = process.env.SEED_DEMO_USER_EMAIL ?? 'player@gta6guide.local';
const DEMO_USER_PASSWORD = process.env.SEED_DEMO_USER_PASSWORD ?? 'PlayerPass123!';

const categorySeeds = [
  {
    title: 'Missions',
    slug: 'missions',
    description: 'Story progression, preparation routes, and mission completion strategies.',
    accent: 'pink' as const,
    order: 1,
  },
  {
    title: 'Map & Locations',
    slug: 'map-locations',
    description: 'Explore Leonida landmarks, districts, hidden areas, and open-world routing.',
    accent: 'cyan' as const,
    order: 2,
  },
  {
    title: 'Vehicles',
    slug: 'vehicles',
    description: 'Vehicle classes, handling notes, upgrades, garages, and travel planning.',
    accent: 'purple' as const,
    order: 3,
  },
  {
    title: 'Money & Progression',
    slug: 'money-progression',
    description: 'Earning routes, upgrades, early priorities, and progression planning.',
    accent: 'cyan' as const,
    order: 4,
  },
];

const guideSeeds = [
  {
    title: 'Beginner Route Through Leonida',
    slug: 'beginner-route-through-leonida',
    excerpt: 'A first-session route for learning the map, unlocking safe options, and avoiding wasted travel.',
    content:
      'Start with nearby story markers, then branch into map discovery only when travel upgrades are available. Keep early cash for utility improvements instead of cosmetic spending.',
    sections: [
      {
        heading: 'Opening priorities',
        body: [
          'Complete early story objectives before chasing every side activity.',
          'Use short loops between mission starts, shops, and safe routes to build familiarity with Leonida.',
        ],
      },
      {
        heading: 'Route planning',
        body: [
          'Group activities by district so you spend less time crossing the map.',
          'Mark garages, weapon stores, and mission hubs as repeat anchors for future sessions.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should beginners explore everything immediately?',
        answer: 'No. Unlock basic tools first, then explore with better mobility and survivability.',
      },
    ],
    categorySlug: 'missions',
    tags: ['beginner', 'route', 'story'],
    type: 'Beginner' as const,
    difficulty: 'Beginner' as const,
    readTime: 5,
    isFeatured: true,
  },
  {
    title: 'Leonida Map Planning Checklist',
    slug: 'leonida-map-planning-checklist',
    excerpt: 'A practical checklist for scanning districts, saving useful points, and planning efficient free roam sessions.',
    content:
      'Map planning works best when you treat each district as a route cluster. Save landmarks, note travel bottlenecks, and return after mission unlocks reshape the area.',
    sections: [
      {
        heading: 'District scan',
        body: [
          'Scan one district at a time and save activity clusters that connect naturally.',
          'Avoid long cross-map trips unless the reward changes your next several objectives.',
        ],
      },
      {
        heading: 'Useful markers',
        body: [
          'Prioritize garages, safe routes, shops, and high-value activity hubs.',
          'Re-check coastal and industrial routes after story progress changes available access.',
        ],
      },
    ],
    faqs: [],
    categorySlug: 'map-locations',
    tags: ['map', 'locations', 'routing'],
    type: 'Map' as const,
    difficulty: 'Intermediate' as const,
    readTime: 6,
    isFeatured: true,
  },
  {
    title: 'Vehicle Upgrade Priorities',
    slug: 'vehicle-upgrade-priorities',
    excerpt: 'A simple vehicle upgrade plan for balancing speed, durability, handling, and storage value.',
    content:
      'Upgrade vehicles based on what they help you accomplish. Durable everyday vehicles matter more early than flashy specialty builds.',
    sections: [
      {
        heading: 'Early upgrades',
        body: [
          'Focus on handling and durability before top speed if you are still learning city routes.',
          'Keep one reliable general-purpose vehicle ready before investing in specialty vehicles.',
        ],
      },
      {
        heading: 'Garage planning',
        body: [
          'Reserve garage slots for vehicles that support repeated activities.',
          'Replace duplicate roles before spending heavily on visual upgrades.',
        ],
      },
    ],
    faqs: [],
    categorySlug: 'vehicles',
    tags: ['vehicles', 'upgrades', 'garage'],
    type: 'Vehicle' as const,
    difficulty: 'Beginner' as const,
    readTime: 4,
    isFeatured: false,
  },
  {
    title: 'Early Money Mistakes to Avoid',
    slug: 'early-money-mistakes-to-avoid',
    excerpt: 'Avoid common spending traps and build a stronger cash foundation during early progression.',
    content:
      'The fastest way to slow progression is spending every early payout immediately. Delay cosmetic purchases and invest in options that reduce future friction.',
    sections: [
      {
        heading: 'Spending traps',
        body: [
          'Avoid buying duplicates that only look different but solve the same problem.',
          'Delay low-impact cosmetic purchases until your mobility and mission readiness are stable.',
        ],
      },
      {
        heading: 'Better investments',
        body: [
          'Spend on tools, upgrades, and routes that make several activities easier.',
          'Keep a cash buffer so surprise opportunities do not force poor choices.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much cash should I keep available?',
        answer: 'Keep enough for basic supplies, repairs, and one meaningful upgrade before buying extras.',
      },
    ],
    categorySlug: 'money-progression',
    tags: ['money', 'progression', 'beginner'],
    type: 'Money' as const,
    difficulty: 'Beginner' as const,
    readTime: 5,
    isFeatured: false,
  },
];

async function upsertUser(input: {
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}) {
  const existingUser = await UserModel.findOne({ email: input.email });

  if (existingUser) {
    existingUser.name = input.name;
    existingUser.username = input.username;
    existingUser.role = input.role;
    existingUser.status = 'active';
    existingUser.isEmailVerified = true;
    await existingUser.save();

    return existingUser;
  }

  return UserModel.create({
    name: input.name,
    username: input.username,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    status: 'active',
    isEmailVerified: true,
  });
}

async function seed() {
  await connectDatabase();

  const admin = await upsertUser({
    name: 'GTA VI Admin',
    username: 'admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  const demoUser = await upsertUser({
    name: 'Demo Player',
    username: 'demo-player',
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
    role: 'user',
  });

  const categoryBySlug = new Map<string, { _id: unknown }>();

  for (const category of categorySeeds) {
    const savedCategory = await CategoryModel.findOneAndUpdate(
      { slug: category.slug },
      {
        ...category,
        isActive: true,
        seo: {
          metaTitle: `${category.title} | GTA VI Guide Platform`,
          metaDescription: category.description,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!savedCategory) {
      throw new Error(`Could not save category: ${category.title}`);
    }

    categoryBySlug.set(category.slug, savedCategory);
  }

  const guides = [];

  for (const guide of guideSeeds) {
    const category = categoryBySlug.get(guide.categorySlug);

    if (!category) {
      throw new Error(`Missing category for guide: ${guide.title}`);
    }

    const savedGuide = await GuideModel.findOneAndUpdate(
      { slug: guide.slug },
      {
        title: guide.title,
        slug: createSlug(guide.slug),
        excerpt: guide.excerpt,
        content: guide.content,
        sections: guide.sections,
        faqs: guide.faqs,
        categoryId: category._id,
        tags: guide.tags,
        tagIds: guide.tags.map(createSlug),
        type: guide.type,
        difficulty: guide.difficulty,
        status: 'published',
        visibility: 'public',
        readTime: guide.readTime,
        authorId: admin._id,
        publishedAt: new Date(),
        isFeatured: guide.isFeatured,
        metrics: {
          viewCount: 0,
          bookmarkCount: 0,
          commentCount: 0,
          helpfulCount: 0,
        },
        seo: {
          metaTitle: `${guide.title} | GTA VI Guide Platform`,
          metaDescription: guide.excerpt,
          canonicalUrl: '',
          keywords: guide.tags,
          ogImage: '',
        },
        gameMeta: {
          missionName: guide.categorySlug === 'missions' ? guide.title : '',
          characterNames: [],
          locationNames: guide.categorySlug === 'map-locations' ? ['Leonida'] : [],
          vehicleNames: guide.categorySlug === 'vehicles' ? ['Starter vehicle'] : [],
          weaponNames: [],
          platform: 'Current generation consoles',
          gameVersion: 'Launch planning',
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    guides.push(savedGuide);
  }

  const firstGuide = guides[0];
  const secondGuide = guides[1];

  if (firstGuide) {
    await BookmarkModel.updateOne(
      { userId: demoUser._id, guideId: firstGuide._id },
      { userId: demoUser._id, guideId: firstGuide._id },
      { upsert: true },
    );

    await CommentModel.findOneAndUpdate(
      { userId: demoUser._id, guideId: firstGuide._id, body: 'This route helped me plan my first few sessions.' },
      {
        userId: demoUser._id,
        guideId: firstGuide._id,
        body: 'This route helped me plan my first few sessions.',
        status: COMMENT_STATUSES.APPROVED,
        isEdited: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  if (secondGuide) {
    await CommentModel.findOneAndUpdate(
      { userId: demoUser._id, guideId: secondGuide._id, body: 'Could use more detail on coastal routes.' },
      {
        userId: demoUser._id,
        guideId: secondGuide._id,
        body: 'Could use more detail on coastal routes.',
        status: COMMENT_STATUSES.PENDING,
        isEdited: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const bookmarkCounts = await BookmarkModel.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: '$guideId', count: { $sum: 1 } } },
  ]);
  const commentCounts = await CommentModel.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: '$guideId', count: { $sum: 1 } } },
  ]);

  for (const guide of guides) {
    const bookmarkCount = bookmarkCounts.find((item) => String(item._id) === String(guide._id))?.count ?? 0;
    const commentCount = commentCounts.find((item) => String(item._id) === String(guide._id))?.count ?? 0;

    await GuideModel.findByIdAndUpdate(guide._id, {
      $set: {
        'metrics.bookmarkCount': bookmarkCount,
        'metrics.commentCount': commentCount,
      },
    });
  }

  console.info('Seed complete.');
  console.info(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.info(`Demo user login: ${DEMO_USER_EMAIL} / ${DEMO_USER_PASSWORD}`);

  await disconnectDatabase();
}

seed().catch(async (error: unknown) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
