import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { performanceData } from '@test-data/users/users.performance.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test('HEAD /users single request responds within SLA @performance-users-head-sla', async ({ request, authHeaders }) => {
  const { response, elapsed } = await measureRequest(() => request.head('users', { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.headList);
});

test('HEAD /users with pagination params responds within SLA @performance-users-head-sla', async ({
  request,
  authHeaders,
}) => {
  const { page, limit } = performanceData.pagination;
  const { response, elapsed } = await measureRequest(() =>
    request.head(`users?_page=${page}&_limit=${limit}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.headPaginated);
});

test('HEAD /users with filter params responds within SLA @performance-users-head-sla', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.head(`users?firstname=${filteringUsersData.singleFirstname.value}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.headFiltered);
});

test.describe('Concurrent', () => {
  test('HEAD /users concurrent requests respond within SLA @performance-users-head-concurrent', async ({
    request,
    authHeaders,
  }) => {
    const { concurrentRequests } = performanceData;
    const results = await Promise.all(
      Array.from({ length: concurrentRequests }, async () => {
        const { response, elapsed } = await measureRequest(() => request.head('users', { headers: authHeaders }));
        return { response, elapsed };
      })
    );
    const statuses = results.map(({ response }) => response.status());
    const maxElapsed = Math.max(...results.map(({ elapsed }) => elapsed));

    expect.soft(statuses).toEqual(Array(concurrentRequests).fill(200));
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.headConcurrent);
  });
});
