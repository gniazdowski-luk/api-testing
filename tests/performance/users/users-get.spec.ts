import { test, expect } from '@tests/fixtures';
import type { APIRequestContext } from '@playwright/test';
import { performanceData } from '@test-data/users/users.performance.data';

async function measureGet(request: APIRequestContext, url: string, headers: Record<string, string>) {
  const start = Date.now();
  const response = await request.get(url, { headers });
  const elapsed = Date.now() - start;
  return { response, elapsed };
}

test('GET /users responds within SLA @performance-users', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureGet(request, 'users', authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.listEndpoint);
});

test('GET /users with pagination responds within SLA @performance-users', async ({ request, authHeaders }) => {
  const { page, limit } = performanceData.pagination;

  const { response, elapsed } = await measureGet(request, `users?_page=${page}&_limit=${limit}`, authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.paginatedEndpoint);
});

test('GET /users with full-text search responds within SLA @performance-users', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureGet(request, `users?q=${performanceData.searchQuery}`, authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.searchEndpoint);
});

test('GET /users without valid auth responds within SLA @performance-users', async ({ request }) => {
  const { response, elapsed } = await measureGet(request, 'users', { Authorization: 'Bearer invalid-token' });

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.unauthenticated);
});
