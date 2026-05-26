import expectedUsersData from '@test-data/users/users.data.json';
import { performanceData } from '@test-data/users/users.performance.data';
import { byIdData } from '@test-data/users/users-id.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test('checks that fetching an existing user by ID responds within the defined SLA @performance-users-id', async ({
  request,
  authHeaders,
}) => {
  const { id } = expectedUsersData.user1;

  const { response, elapsed } = await measureRequest(() => request.get(`users/${id}`, { headers: authHeaders }));

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.byIdEndpoint);
});

test('checks that fetching a non-existent user by ID responds within the defined SLA @performance-users-id', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users/${byIdData.nonExistentId}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(404);
  expect(elapsed).toBeLessThan(performanceData.slaMs.byIdNotFound);
});

test.describe('Concurrent', () => {
  test('checks that concurrent GET requests for a single user by ID all respond within the defined SLA @performance-users-id-concurrent', async ({
    request,
    authHeaders,
  }) => {
    const { id } = expectedUsersData.user1;
    const { concurrentRequests } = performanceData;

    const results = await Promise.all(
      Array.from({ length: concurrentRequests }, async () => {
        const { response, elapsed } = await measureRequest(() => request.get(`users/${id}`, { headers: authHeaders }));
        return { response, elapsed };
      })
    );

    const statuses = results.map(({ response }) => response.status());
    const maxElapsed = Math.max(...results.map(({ elapsed }) => elapsed));

    expect.soft(statuses).toEqual(Array(concurrentRequests).fill(200));
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.byIdConcurrentEndpoint);
  });
});
