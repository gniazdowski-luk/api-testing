import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { performanceData } from '@test-data/users/users.performance.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test('GET /users single authenticated request responds within SLA @performance-users-get-sla', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() => request.get('users', { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getList);
});

test('GET /users paginated request responds within SLA @performance-users-get-sla', async ({
  request,
  authHeaders,
}) => {
  const { page, limit } = performanceData.pagination;
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?_page=${page}&_limit=${limit}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getPaginated);
});

test('GET /users full-text search request responds within SLA @performance-users-get-sla', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?q=${filteringUsersData.singleFirstname.value}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getSearch);
});

test('GET /users sorted request responds within SLA @performance-users-get-sla', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get('users?_sort=firstname&_order=asc', { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getSorted);
});

test('GET /users filtered request responds within SLA @performance-users-get-sla', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?firstname=${filteringUsersData.singleFirstname.value}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getFiltered);
});

test('GET /users unauthenticated request responds within SLA @performance-users-get-sla', async ({ request }) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get('users', { headers: { Authorization: 'Bearer invalid-token' } })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.getUnauthenticated);
});

test.describe('Concurrent', () => {
  test('GET /users concurrent requests respond within SLA @performance-users-get-concurrent', async ({
    request,
    authHeaders,
  }) => {
    const { concurrentRequests } = performanceData;
    const results = await Promise.all(
      Array.from({ length: concurrentRequests }, async () => {
        const { response, elapsed } = await measureRequest(() => request.get('users', { headers: authHeaders }));
        return { response, elapsed };
      })
    );
    const statuses = results.map(({ response }) => response.status());
    const maxElapsed = Math.max(...results.map(({ elapsed }) => elapsed));

    expect.soft(statuses).toEqual(Array(concurrentRequests).fill(200));
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.getConcurrent);
  });
});
