import type { APIRequestContext } from '@playwright/test';

import expectedUsersData from '@test-data/users/users.data.json';
import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { paginationOffsetData, paginationPageData } from '@test-data/users/users.pagination.data';
import { avatarData } from '@test-data/users/users.schema';
import { searchUsersData } from '@test-data/users/users.search.data';
import { expect, test } from '@tests/fixtures';

async function fetchAllUsers(request: APIRequestContext, headers: Record<string, string>): Promise<unknown[]> {
  const response = await request.get('users', { headers });
  return response.json();
}

const PAGE_LIMIT = paginationPageData.limit;

test.describe('Core', () => {
  test('GET /users specific users are present in the response @functional-users-get-core', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();

    const user1Expected = expectedUsersData.user1;
    const user2Expected = expectedUsersData.user2;

    const user1 = users.find((u: { id: number }) => u.id === user1Expected.id);
    const user2 = users.find((u: { id: number }) => u.id === user2Expected.id);

    expect([user1, user2]).toMatchObject([
      {
        id: user1Expected.id,
        firstname: user1Expected.firstname,
        lastname: user1Expected.lastname,
        email: expect.any(String),
        avatar: expect.any(String),
        password: expect.any(String),
      },
      {
        id: user2Expected.id,
        firstname: user2Expected.firstname,
        lastname: user2Expected.lastname,
        email: expect.any(String),
        avatar: expect.any(String),
        password: expect.any(String),
      },
    ]);
  });
});

test.describe('Pagination', () => {
  test('GET /users pagination returns correct number of users @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();

    expect(users).toHaveLength(PAGE_LIMIT);
  });

  test('GET /users pagination total count header is included in the response @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const [allUsersResponse, response] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders }),
    ]);

    expect.soft(allUsersResponse.status()).toBe(200);
    expect.soft(response.status()).toBe(200);

    const allUsers = await allUsersResponse.json();
    const realCount = allUsers.length;

    const totalCount = Number(response.headers()['x-total-count']);

    expect.soft(response.headers()['x-total-count']).toBeTruthy();
    expect(totalCount).toBe(realCount);
  });

  test('GET /users pagination page 2 does not overlap with page 1 @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const page1Response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders });
    const page2Response = await request.get(`users?_page=2&_limit=${PAGE_LIMIT}`, { headers: authHeaders });

    expect.soft(page1Response.status()).toBe(200);
    expect.soft(page2Response.status()).toBe(200);

    const page1Ids = (await page1Response.json()).map((u: { id: number }) => u.id);
    const page2Ids = (await page2Response.json()).map((u: { id: number }) => u.id);
    const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));

    expect(hasOverlap).toBe(false);
  });

  test('GET /users offset pagination returns correct number of users @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;
    const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();

    expect(users).toHaveLength(limit);
  });

  test('GET /users offset n does not overlap with offset 0 @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;

    const page0Response = await request.get(`users?_start=0&_limit=${limit}`, { headers: authHeaders });
    const pageNResponse = await request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders });

    expect.soft(page0Response.status()).toBe(200);
    expect.soft(pageNResponse.status()).toBe(200);

    const page0Ids = (await page0Response.json()).map((u: { id: number }) => u.id);
    const pageNIds = (await pageNResponse.json()).map((u: { id: number }) => u.id);
    const hasOverlap = page0Ids.some((id: number) => pageNIds.includes(id));

    expect(hasOverlap).toBe(false);
  });

  test('GET /users total count header reflects all users @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;

    const [allUsersResponse, response] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders }),
    ]);

    expect.soft(allUsersResponse.status()).toBe(200);
    expect.soft(response.status()).toBe(200);

    const allUsers = await allUsersResponse.json();
    const realCount = allUsers.length;

    const totalCount = Number(response.headers()['x-total-count']);

    expect.soft(response.headers()['x-total-count']).toBeTruthy();
    expect(totalCount).toBe(realCount);
  });

  test('GET /users range pagination returns correct number of users @functional-users-get-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, end } = paginationOffsetData.offsetRange;
    const response = await request.get(`users?_start=${start}&_end=${end}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();

    expect(users).toHaveLength(end - start);
  });
});

test.describe('Sorting', () => {
  test('GET /users sorting by firstname ascending works @functional-users-get-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=asc', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedAsc = [...firstnames].sort();

    expect(firstnames).toEqual(sortedAsc);
  });

  test('GET /users sorting by firstname descending works @functional-users-get-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=desc', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedDesc = [...firstnames].sort().reverse();

    expect(firstnames).toEqual(sortedDesc);
  });

  test('GET /users sorting by id ascending works @functional-users-get-sorting', async ({ request, authHeaders }) => {
    const response = await request.get('users?_sort=id&_order=asc', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const ids = users.map((u: { id: number }) => u.id);
    const sortedAsc = [...ids].sort((a, b) => a - b);

    expect(ids).toEqual(sortedAsc);
  });

  test('GET /users sorting by lastname ascending works @functional-users-get-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=lastname&_order=asc', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const lastnames = users.map((u: { lastname: string }) => u.lastname);
    const sortedAsc = [...lastnames].sort();

    expect(lastnames).toEqual(sortedAsc);
  });
});

test.describe('Filtering', () => {
  test('GET /users filtering by firstname works @functional-users-get-filtering', async ({ request, authHeaders }) => {
    const data = filteringUsersData.singleFirstname;
    const response = await request.get(`users?firstname=${data.value}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual([data.expectedId]);
  });

  test('GET /users combined filters applies AND logic @functional-users-get-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.andFilter;
    const response = await request.get(`users?firstname=${data.firstname}&lastname=${data.lastname}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual([data.expectedId]);
  });

  test('GET /users repeating the same parameter applies OR logic @functional-users-get-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.orFilter;
    const response = await request.get(`users?id=${data.ids[0]}&id=${data.ids[1]}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.ids);
  });

  test('GET /users filtering by inclusive ID range works @functional-users-get-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.idRange;
    const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.expectedIds);
  });

  test('GET /users unrecognized query parameters are ignored @functional-users-get-filtering', async ({
    request,
    authHeaders,
  }) => {
    const [allUsersResponse, filteredResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.get('users?unknownparam=test', { headers: authHeaders }),
    ]);

    expect.soft(allUsersResponse.status()).toBe(200);
    expect.soft(filteredResponse.status()).toBe(200);

    const allUsers = await allUsersResponse.json();
    const filteredUsers = await filteredResponse.json();

    expect(filteredUsers).toHaveLength(allUsers.length);
  });
});

test.describe('Search', () => {
  test('GET /users full-text search works @functional-users-get-search', async ({ request, authHeaders }) => {
    const data = searchUsersData.matchingQuery;
    const response = await request.get(`users?q=${data.q}`, {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.expectedIds);
  });

  test('GET /users empty search returns all users @functional-users-get-search', async ({ request, authHeaders }) => {
    const [allUsersResponse, searchResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.get('users?q=', { headers: authHeaders }),
    ]);

    expect.soft(allUsersResponse.status()).toBe(200);
    expect.soft(searchResponse.status()).toBe(200);

    const allUsers = await allUsersResponse.json();
    const searchUsers = await searchResponse.json();

    expect(searchUsers).toHaveLength(allUsers.length);
  });

  test('GET /users partial firstname matching works @functional-users-get-search', async ({ request, authHeaders }) => {
    const pattern = searchUsersData.firstnameLikePattern;

    const [apiResponse, allUsers] = await Promise.all([
      request.get(`users?firstname_like=${pattern}`, { headers: authHeaders }),
      fetchAllUsers(request, authHeaders),
    ]);

    expect.soft(apiResponse.status()).toBe(200);

    const apiUsers = await apiResponse.json();
    const apiIds = apiUsers.map((u: { id: number }) => u.id);

    const localIds = (allUsers as { id: number; firstname: string }[])
      .filter((u) => new RegExp(pattern, 'i').test(u.firstname))
      .map((u) => u.id);

    expect(apiIds).toEqual(localIds);
  });

  test('GET /users URL-encoded special characters are handled @functional-users-get-search', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?q=${searchUsersData.specialCharMatch}`, { headers: authHeaders });

    expect(response.status()).toBe(200);
  });
});

test.describe('Data', () => {
  test('GET /users avatar paths are correct @functional-users-get-data', async ({ request, authHeaders }) => {
    const response = await request.get('users', { headers: authHeaders });
    expect.soft(response.status()).toBe(200);
    const allUsers = await response.json();

    const usersWithAvatar = (allUsers as { avatar: string }[]).filter((u) => u.avatar !== '');
    const usersWithCorrectPath = usersWithAvatar.filter((u) => u.avatar.startsWith(avatarData.correctAvatarPath));

    expect(usersWithCorrectPath.length).toBe(usersWithAvatar.length);
  });
});

test.describe('Edge cases', () => {
  test('GET /users zero page number returns successful result @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=0&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('GET /users negative page number returns successful result @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=-1&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('GET /users negative limit returns successful result @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_limit=-1', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('GET /users very large limit returns successful result @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_limit=${paginationPageData.largeLimit}`, {
      headers: authHeaders,
    });

    const users = await response.json();

    expect.soft(Array.isArray(users)).toBe(true);
    expect(response.status()).toBe(200);
  });

  test('GET /users invalid sort value falls back to ascending order @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=invalid', {
      headers: authHeaders,
    });

    expect.soft(response.status()).toBe(200);
    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedAsc = [...firstnames].sort();

    expect(firstnames).toEqual(sortedAsc);
  });

  test('GET /users sorting by non-existent field is handled @functional-users-get-edge', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=nonexistent&_order=asc', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Negative', () => {
  test('GET /users page beyond total pages returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=${paginationPageData.beyondLastPage}&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users zero limit returns not found @functional-users-get-negative', async ({ request, authHeaders }) => {
    const response = await request.get('users?_limit=0', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users offset beyond total users returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetBeyondTotal;
    const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('PUT /users/{id} response includes the correct Content-Type header @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?firstname=${filteringUsersData.noMatchFirstname}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users empty ID range returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.emptyIdRange;
    const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users inverted ID range returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.idRange;
    const response = await request.get(`users?id_gte=${data.max}&id_lte=${data.min}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users non-matching full-text search returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?q=${searchUsersData.noMatchQuery}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users no-match partial search returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?firstname_like=${searchUsersData.noMatchFirstnameLike}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users filtering with empty string returns not found @functional-users-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?firstname=', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users filtering is case-sensitive @functional-users-get-negative', async ({ request, authHeaders }) => {
    const response = await request.get(`users?firstname=${filteringUsersData.caseSensitiveFirstname}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});
