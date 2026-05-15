import { test, expect } from '@tests/fixtures';
import type { APIRequestContext } from '@playwright/test';
import { performanceData } from '@test-data/users/users.performance.data';

async function measureGet(request: APIRequestContext, url: string, headers: Record<string, string>) {
  const start = Date.now();
  const response = await request.get(url, { headers });
  const elapsed = Date.now() - start;
  return { response, elapsed };
}

test('checks that a single authenticated request responds within the defined SLA @performance-users', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureGet(request, 'users', authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.listEndpoint);
});

test('checks that a paginated request responds within the defined SLA @performance-users', async ({ request, authHeaders }) => {
  const { page, limit } = performanceData.pagination;

  const { response, elapsed } = await measureGet(request, `users?_page=${page}&_limit=${limit}`, authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.paginatedEndpoint);
});

test('checks that a full-text search request responds within the defined SLA @performance-users', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureGet(request, `users?q=${performanceData.searchQuery}`, authHeaders);

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.searchEndpoint);
});

test('checks that an unauthenticated request still responds within the defined SLA @performance-users', async ({ request }) => {
  const { response, elapsed } = await measureGet(request, 'users', { Authorization: 'Bearer invalid-token' });

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.unauthenticated);
});
