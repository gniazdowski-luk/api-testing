import expectedUsersData from '@test-data/users/users.data.json';
import { performanceData } from '@test-data/users/users.performance.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test.describe('SLA', () => {
  test('GET /users/{id} fetching an existing user responds within SLA @performance-users_id-get-sla', async ({
    request,
    authHeaders,
  }) => {
    const { response, elapsed } = await measureRequest(() =>
      request.get(`users/${expectedUsersData.user1.id}`, { headers: authHeaders })
    );

    expect.soft(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(performanceData.slaMs.getById);
  });

  test('GET /users/{id} fetching a non-existent user responds within SLA @performance-users_id-get-sla', async ({
    request,
    authHeaders,
  }) => {
    const { response, elapsed } = await measureRequest(() =>
      request.get(`users/${byIdData.nonExistentId}`, { headers: authHeaders })
    );

    expect.soft(response.status()).toBe(404);
    expect(elapsed).toBeLessThan(performanceData.slaMs.getByIdNotFound);
  });
});

test.describe('Concurrent', () => {
  test('GET /users/{id} concurrent requests respond within SLA @performance-users_id-get-concurrent', async ({
    request,
    authHeaders,
  }) => {
    const { concurrentRequests } = performanceData;

    const results = await Promise.all(
      Array.from({ length: concurrentRequests }, async () => {
        const { response, elapsed } = await measureRequest(() =>
          request.get(`users/${expectedUsersData.user1.id}`, { headers: authHeaders })
        );
        return { response, elapsed };
      })
    );

    const statuses = results.map(({ response }) => response.status());
    const maxElapsed = Math.max(...results.map(({ elapsed }) => elapsed));

    expect.soft(statuses).toEqual(Array(concurrentRequests).fill(200));
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.getByIdConcurrent);
  });
});
