import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';

process.env.VITE_APP_NAME = 'GTA VI Guide Platform';
process.env.VITE_APP_ENV = 'staging';
process.env.VITE_API_BASE_URL = 'http://localhost:5000/api/v1';
process.env.VITE_SITE_URL = 'https://gta6-guide-platform.example.com';

function renderWithProviders(element: React.ReactElement, path = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>
    </QueryClientProvider>,
  );
}

test('public home page renders critical hero copy', async () => {
  const { HomePage } = await import('../src/pages/public/HomePage.js');
  const html = renderWithProviders(<HomePage />);

  assert.match(html, /Master every mission/);
  assert.match(html, /Explore guides/);
});

test('search page renders initial state without a search term', async () => {
  const { SearchPage } = await import('../src/pages/public/SearchPage.js');
  const html = renderWithProviders(<SearchPage />, '/search');

  assert.match(html, /Find the exact guide you need/);
  assert.match(html, /Search the live guide index/);
});

test('protected route renders allowed user content and blocks disallowed admin content', async () => {
  const store = new Map<string, string>();
  const testWindow = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: testWindow,
  });

  store.set(
    'gta6-guide-auth-user',
    JSON.stringify({
      id: 'user-1',
      name: 'Test User',
      username: 'tester',
      email: 'tester@example.com',
      role: 'user',
      status: 'active',
      avatar: '',
      bio: '',
      isEmailVerified: true,
    }),
  );

  const { ProtectedRoute } = await import('../src/features/auth/index.js');

  const allowedHtml = renderToStaticMarkup(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <p>User dashboard content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  assert.match(allowedHtml, /User dashboard content/);

  const blockedHtml = renderToStaticMarkup(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/dashboard" element={<p>User dashboard</p>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <p>Admin dashboard content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  assert.doesNotMatch(blockedHtml, /Admin dashboard content/);
});
