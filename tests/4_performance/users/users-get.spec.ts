import { filteringUsersData } from '@test-data/users/users.filtering.data';
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

  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?_page=${page}&_limit=${limit}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.paginatedEndpoint);
});

test('checks that a full-text search request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?q=${filteringUsersData.singleFirstname.value}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.searchEndpoint);
});

test('checks that a sorted request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get('users?_sort=firstname&_order=asc', { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.sortedEndpoint);
});

test('checks that a filtered request responds within the defined SLA @performance-users', async ({
  request,
  authHeaders,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get(`users?firstname=${filteringUsersData.singleFirstname.value}`, { headers: authHeaders })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.filteredEndpoint);
});

test('checks that an unauthenticated request still responds within the defined SLA @performance-users', async ({
  request,
}) => {
  const { response, elapsed } = await measureRequest(() =>
    request.get('users', { headers: { Authorization: 'Bearer invalid-token' } })
  );

  expect.soft(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(performanceData.slaMs.unauthenticated);
});

test.describe('Concurrent', () => {
  test('checks that concurrent GET requests all respond within the defined SLA @performance-users-concurrent', async ({
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
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.concurrentEndpoint);
  });
});
