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
  test('checks that the response includes two specific users with correct fields @functional-users', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users', {
      headers: authHeaders,
    });

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
  test('checks that requesting a page with a limit returns the correct number of users @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    const users = await response.json();

    expect(users).toHaveLength(PAGE_LIMIT);
  });

  test('checks that the X-Total-Count header is present and equals the actual total number of users @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const allUsers = await fetchAllUsers(request, authHeaders);
    const realCount = allUsers.length;

    const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders });

    const totalCount = Number(response.headers()['x-total-count']);

    expect.soft(response.headers()['x-total-count']).toBeTruthy();
    expect(totalCount).toBe(realCount);
  });

  test('checks that page 2 results do not overlap with page 1 results @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const page1Response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders });
    const page2Response = await request.get(`users?_page=2&_limit=${PAGE_LIMIT}`, { headers: authHeaders });

    const page1Ids = (await page1Response.json()).map((u: { id: number }) => u.id);
    const page2Ids = (await page2Response.json()).map((u: { id: number }) => u.id);
    const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));

    expect(hasOverlap).toBe(false);
  });

  test('checks that offset-based pagination returns the correct number of users @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;
    const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
      headers: authHeaders,
    });

    const users = await response.json();

    expect(users).toHaveLength(limit);
  });

  test('checks that users at offset n do not overlap with users at offset 0 @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;

    const page0Response = await request.get(`users?_start=0&_limit=${limit}`, { headers: authHeaders });
    const pageNResponse = await request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders });

    const page0Ids = (await page0Response.json()).map((u: { id: number }) => u.id);
    const pageNIds = (await pageNResponse.json()).map((u: { id: number }) => u.id);
    const hasOverlap = page0Ids.some((id: number) => pageNIds.includes(id));

    expect(hasOverlap).toBe(false);
  });

  test('checks that the X-Total-Count header reflects the total number of all users @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetLimit;

    const allUsers = await fetchAllUsers(request, authHeaders);
    const realCount = allUsers.length;

    const response = await request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders });
    const totalCount = Number(response.headers()['x-total-count']);

    expect.soft(response.headers()['x-total-count']).toBeTruthy();
    expect(totalCount).toBe(realCount);
  });

  test('checks that range-based pagination returns exactly b-a users @functional-users-pagination', async ({
    request,
    authHeaders,
  }) => {
    const { start, end } = paginationOffsetData.offsetRange;
    const response = await request.get(`users?_start=${start}&_end=${end}`, {
      headers: authHeaders,
    });

    const users = await response.json();

    expect(users).toHaveLength(end - start);
  });
});

test.describe('Sorting', () => {
  test('checks that users are sorted by firstname in ascending alphabetical order @functional-users-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=asc', {
      headers: authHeaders,
    });

    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedAsc = [...firstnames].sort();

    expect(firstnames).toEqual(sortedAsc);
  });

  test('checks that users are sorted by firstname in descending alphabetical order @functional-users-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=desc', {
      headers: authHeaders,
    });

    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedDesc = [...firstnames].sort().reverse();

    expect(firstnames).toEqual(sortedDesc);
  });

  test('checks that users are sorted by id in ascending order @functional-users-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=id&_order=asc', {
      headers: authHeaders,
    });

    const users = await response.json();
    const ids = users.map((u: { id: number }) => u.id);
    const sortedAsc = [...ids].sort((a, b) => a - b);

    expect(ids).toEqual(sortedAsc);
  });

  test('checks that users are sorted by lastname in ascending alphabetical order @functional-users-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=lastname&_order=asc', {
      headers: authHeaders,
    });

    const users = await response.json();
    const lastnames = users.map((u: { lastname: string }) => u.lastname);
    const sortedAsc = [...lastnames].sort();

    expect(lastnames).toEqual(sortedAsc);
  });

  test('checks that sorting by a non-existent field name does not cause a server error @functional-users-sorting', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=nonexistent&_order=asc', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Filtering', () => {
  test('checks that filtering by firstname returns only exact matches @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.singleFirstname;
    const response = await request.get(`users?firstname=${data.value}`, {
      headers: authHeaders,
    });

    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual([data.expectedId]);
  });

  test('checks that multiple filters are combined with AND logic @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.andFilter;
    const response = await request.get(`users?firstname=${data.firstname}&lastname=${data.lastname}`, {
      headers: authHeaders,
    });

    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual([data.expectedId]);
  });

  test('checks that repeating the same parameter applies OR logic @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.orFilter;
    const response = await request.get(`users?id=${data.ids[0]}&id=${data.ids[1]}`, {
      headers: authHeaders,
    });

    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.ids);
  });

  test('checks that range filtering returns only users within the inclusive ID range @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.idRange;
    const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
      headers: authHeaders,
    });

    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.expectedIds);
  });

  test('checks that unrecognized query parameters are ignored and all users are returned @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const allUsers = await fetchAllUsers(request, authHeaders);

    const filteredResponse = await request.get('users?unknownparam=test', {
      headers: authHeaders,
    });
    const filteredUsers = await filteredResponse.json();

    expect(filteredUsers).toHaveLength(allUsers.length);
  });

  test('checks that filtering with an empty string value returns all users @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?firstname=', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that field filtering is case-sensitive @functional-users-filtering', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?firstname=${filteringUsersData.caseSensitiveFirstname}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('Search', () => {
  test('checks that full-text search returns only users where at least one field matches @functional-users-search', async ({
    request,
    authHeaders,
  }) => {
    const data = searchUsersData.matchingQuery;
    const response = await request.get(`users?q=${data.q}`, {
      headers: authHeaders,
    });

    const users = await response.json();
    const userIds = users.map((u: { id: number }) => u.id);

    expect(userIds).toEqual(data.expectedIds);
  });

  test('checks that an empty search string returns all users @functional-users-search', async ({
    request,
    authHeaders,
  }) => {
    const allUsers = await fetchAllUsers(request, authHeaders);

    const searchResponse = await request.get('users?q=', { headers: authHeaders });
    const searchUsers = await searchResponse.json();

    expect(searchUsers).toHaveLength(allUsers.length);
  });

  test('checks that partial firstname matching returns the correct users @functional-users-search', async ({
    request,
    authHeaders,
  }) => {
    const pattern = searchUsersData.firstnameLikePattern;

    const [apiResponse, allUsers] = await Promise.all([
      request.get(`users?firstname_like=${pattern}`, { headers: authHeaders }),
      fetchAllUsers(request, authHeaders),
    ]);

    const apiUsers = await apiResponse.json();
    const apiIds = apiUsers.map((u: { id: number }) => u.id);

    const localIds = (allUsers as { id: number; firstname: string }[])
      .filter((u) => new RegExp(pattern, 'i').test(u.firstname))
      .map((u) => u.id);

    expect(apiIds).toEqual(localIds);
  });

  test('checks that URL-encoded special characters are treated as literal search values @functional-users-search', async ({
    request,
    authHeaders,
  }) => {
    const matchResponse = await request.get(`users?q=${searchUsersData.specialCharMatch}`, { headers: authHeaders });
    const noMatchResponse = await request.get(`users?q=${searchUsersData.specialCharNoMatch}`, {
      headers: authHeaders,
    });

    expect.soft(matchResponse.status()).toBe(200);
    expect.soft(noMatchResponse.status()).toBe(404);
  });
});

test.describe('Data', () => {
  test('checks that all users with a non-empty avatar have a correct avatar path @functional-users-data', async ({
    request,
    authHeaders,
  }) => {
    const allUsers = await fetchAllUsers(request, authHeaders);

    const usersWithAvatar = (allUsers as { avatar: string }[]).filter((u) => u.avatar !== '');
    const usersWithCorrectPath = usersWithAvatar.filter((u) => u.avatar.startsWith(avatarData.correctAvatarPath));

    expect(usersWithCorrectPath.length).toBe(usersWithAvatar.length);
  });
});

test.describe('Negative', () => {
  test('checks that requesting a page beyond the total number of pages returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=${paginationPageData.beyondLastPage}&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that requesting with a zero limit returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_limit=0', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that requesting with a zero page number returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=0&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('checks that requesting with a negative page number returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?_page=-1&_limit=${PAGE_LIMIT}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('checks that requesting with a negative limit returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_limit=-1', {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
  });

  test('checks that an offset beyond the total number of users returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const { start, limit } = paginationOffsetData.offsetBeyondTotal;
    const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that requesting with a very large limit returns all users without a server error @functional-users-negative', async ({
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

  test('checks that an invalid sort order value falls back to ascending alphabetical order @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users?_sort=firstname&_order=invalid', {
      headers: authHeaders,
    });

    const users = await response.json();
    const firstnames = users.map((u: { firstname: string }) => u.firstname);
    const sortedAsc = [...firstnames].sort();

    expect(firstnames).toEqual(sortedAsc);
  });

  test('checks that filtering with a non-existent value returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?firstname=${filteringUsersData.noMatchFirstname}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that an empty ID range returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.emptyIdRange;
    const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that an inverted ID range returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const data = filteringUsersData.idRange;
    const response = await request.get(`users?id_gte=${data.max}&id_lte=${data.min}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that a non-matching full-text search returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?q=${searchUsersData.noMatchQuery}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that a no-match partial firstname search returns the correct status code @functional-users-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users?firstname_like=${searchUsersData.noMatchFirstnameLike}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});
