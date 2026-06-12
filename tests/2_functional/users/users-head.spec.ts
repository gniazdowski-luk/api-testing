import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { paginationOffsetData, paginationPageData } from '@test-data/users/users.pagination.data';
import { expect, test } from '@tests/fixtures';

test.describe('Core', () => {
  test('HEAD /users response body is empty @functional-users-head-core', async ({ request, authHeaders }) => {
    const response = await request.head('users', { headers: authHeaders });
    const body = await response.text();

    expect.soft(body).toBe('');
    expect(response.status()).toBe(200);
  });

  test('HEAD /users response headers match GET /users response headers @functional-users-head-core', async ({
    request,
    authHeaders,
  }) => {
    const [getResponse, headResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.head('users', { headers: authHeaders }),
    ]);

    expect.soft(headResponse.headers()['content-type']).toBe(getResponse.headers()['content-type']);
    expect(headResponse.status()).toBe(200);
  });

  test('HEAD /users X-Total-Count header reflects total user count @functional-users-head-core', async ({
    request,
    authHeaders,
  }) => {
    const [allUsersResponse, headResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.head('users?_page=1&_limit=5', { headers: authHeaders }),
    ]);
    const allUsers = await allUsersResponse.json();

    expect.soft(headResponse.headers()['x-total-count']).toBe(String(allUsers.length));
    expect(headResponse.status()).toBe(200);
  });
});

test.describe('Pagination', () => {
  test('HEAD /users pagination X-Total-Count reflects total count with page limit @functional-users-head-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { limit } = paginationPageData;
    const [getResponse, headResponse] = await Promise.all([
      request.get(`users?_page=1&_limit=${limit}`, { headers: authHeaders }),
      request.head(`users?_page=1&_limit=${limit}`, { headers: authHeaders }),
    ]);

    expect.soft(headResponse.headers()['x-total-count']).toBe(getResponse.headers()['x-total-count']);
    expect(headResponse.status()).toBe(200);
  });

  test('HEAD /users offset pagination X-Total-Count reflects total user count @functional-users-head-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;
    const [allUsersResponse, headResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.head(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders }),
    ]);
    const allUsers = await allUsersResponse.json();

    expect.soft(headResponse.headers()['x-total-count']).toBe(String(allUsers.length));
    expect(headResponse.status()).toBe(200);
  });
});

test.describe('Filtering', () => {
  test('HEAD /users filtering X-Total-Count reflects filtered count @functional-users-head-filtering', async ({
    request,
    authHeaders,
  }) => {
    const { value } = filteringUsersData.singleFirstname;
    const [getResponse, headResponse] = await Promise.all([
      request.get(`users?firstname=${value}`, { headers: authHeaders }),
      request.head(`users?firstname=${value}`, { headers: authHeaders }),
    ]);

    expect.soft(headResponse.headers()['x-total-count']).toBe(getResponse.headers()['x-total-count']);
    expect(headResponse.status()).toBe(200);
  });
});
