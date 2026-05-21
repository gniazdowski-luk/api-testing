import { performanceData } from '@test-data/users/users.performance.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test('checks that a single authenticated request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() => request.get('users', { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.listEndpoint);
});

test('checks that a paginated request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { page, limit } = performanceData.pagination;

  const { response, elapsed } = await measureRequest(() => request.get(`users?_page=${page}&_limit=${limit}`, { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.paginatedEndpoint);
});

test('checks that a full-text search request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() => request.get(`users?q=${performanceData.searchQuery}`, { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.searchEndpoint);
});

test('checks that an unauthenticated request still responds within the defined SLA @performance-users', async ({
  request,
}) => {
  const { response, elapsed } = await measureRequest(() => request.get('users', { headers: { Authorization: 'Bearer invalid-token' } }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.unauthenticated);
});
