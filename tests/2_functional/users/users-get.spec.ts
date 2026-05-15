import { test, expect } from '@tests/fixtures';
import type { APIRequestContext } from '@playwright/test';
import expectedUsersData from '@test-data/users/users.data.json';

async function fetchAllUsers(request: APIRequestContext, headers: Record<string, string>): Promise<unknown[]> {
  const response = await request.get('users', { headers });
  return response.json();
}
import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { searchUsersData } from '@test-data/users/users.search.data';
import { paginationOffsetData } from '@test-data/users/users.pagination.data';

const PAGE_LIMIT = 5;

test('checks that the response includes two specific users with correct fields @functional-users', async ({ request, authHeaders }) => {
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

test('checks that requesting a page with a limit returns the correct number of users @functional-users-pagination', async ({ request, authHeaders }) => {
  const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, {
    headers: authHeaders,
  });

  const users = await response.json();

  expect(users).toHaveLength(PAGE_LIMIT);
});

test('checks that the X-Total-Count header is present and equals the actual total number of users @functional-users-pagination', async ({ request, authHeaders }) => {
  const allUsers = await fetchAllUsers(request, authHeaders);
  const realCount = allUsers.length;

  const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders });

  const totalCount = Number(response.headers()['x-total-count']);

  expect.soft(response.headers()['x-total-count']).toBeTruthy();
  expect(totalCount).toBe(realCount);
});

test('checks that page 2 results do not overlap with page 1 results @functional-users-pagination', async ({ request, authHeaders }) => {
  const page1Response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers: authHeaders });
  const page2Response = await request.get(`users?_page=2&_limit=${PAGE_LIMIT}`, { headers: authHeaders });

  const page1Ids = (await page1Response.json()).map((u: { id: number }) => u.id);
  const page2Ids = (await page2Response.json()).map((u: { id: number }) => u.id);
  const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));

  expect(hasOverlap).toBe(false);
});

test('checks that users are sorted by firstname in ascending alphabetical order @functional-users-sorting', async ({ request, authHeaders }) => {
  const response = await request.get(`users?_sort=firstname&_order=asc`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const firstnames = users.map((u: { firstname: string }) => u.firstname);
  const sortedAsc = [...firstnames].sort();

  expect(firstnames).toEqual(sortedAsc);
});

test('checks that users are sorted by firstname in descending alphabetical order @functional-users-sorting', async ({ request, authHeaders }) => {
  const response = await request.get(`users?_sort=firstname&_order=desc`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const firstnames = users.map((u: { firstname: string }) => u.firstname);
  const sortedDesc = [...firstnames].sort().reverse();

  expect(firstnames).toEqual(sortedDesc);
});

test('checks that filtering by firstname returns only exact matches @functional-users-filtering', async ({ request, authHeaders }) => {
  const data = filteringUsersData.singleFirstname;
  const response = await request.get(`users?firstname=${data.value}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual([data.expectedId]);
});

test('checks that filtering with a non-existent value returns the correct status code @functional-users-filtering', async ({ request, authHeaders }) => {
  const response = await request.get(`users?firstname=${filteringUsersData.noMatchFirstname}`, {
    headers: authHeaders,
  });

  expect(response.status()).toBe(404);
});

test('checks that multiple filters are combined with AND logic @functional-users-filtering', async ({ request, authHeaders }) => {
  const data = filteringUsersData.andFilter;
  const response = await request.get(`users?firstname=${data.firstname}&lastname=${data.lastname}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual([data.expectedId]);
});

test('checks that repeating the same parameter applies OR logic @functional-users-filtering', async ({ request, authHeaders }) => {
  const data = filteringUsersData.orFilter;
  const response = await request.get(`users?id=${data.ids[0]}&id=${data.ids[1]}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.ids);
});

test('checks that range filtering returns only users within the inclusive ID range @functional-users-filtering', async ({ request, authHeaders }) => {
  const data = filteringUsersData.idRange;
  const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('checks that an empty ID range returns the correct status code @functional-users-filtering', async ({ request, authHeaders }) => {
  const data = filteringUsersData.emptyIdRange;
  const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
    headers: authHeaders,
  });

  expect(response.status()).toBe(404);
});

test('checks that unrecognized query parameters are ignored and all users are returned @functional-users-filtering', async ({ request, authHeaders }) => {
  const allUsers = await fetchAllUsers(request, authHeaders);

  const filteredResponse = await request.get(`users?${filteringUsersData.unknownParam}=test`, { headers: authHeaders });
  const filteredUsers = await filteredResponse.json();

  expect(filteredUsers).toHaveLength(allUsers.length);
});

test('checks that full-text search returns only users where at least one field matches @functional-users-search', async ({ request, authHeaders }) => {
  const data = searchUsersData.matchingQuery;
  const response = await request.get(`users?q=${data.q}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('checks that a non-matching full-text search returns the correct status code @functional-users-search', async ({ request, authHeaders }) => {
  const response = await request.get(`users?q=${searchUsersData.noMatchQuery}`, {
    headers: authHeaders,
  });

  expect(response.status()).toBe(404);
});

test('checks that an empty search string returns all users @functional-users-search', async ({ request, authHeaders }) => {
  const allUsers = await fetchAllUsers(request, authHeaders);

  const searchResponse = await request.get('users?q=', { headers: authHeaders });
  const searchUsers = await searchResponse.json();

  expect(searchUsers).toHaveLength(allUsers.length);
});

test('checks that partial firstname matching returns the correct users @functional-users-search', async ({ request, authHeaders }) => {
  const data = searchUsersData.firstnameLike;
  const response = await request.get(`users?firstname_like=${data.pattern}`, {
    headers: authHeaders,
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('checks that a no-match partial firstname search returns the correct status code @functional-users-search', async ({ request, authHeaders }) => {
  const response = await request.get(`users?firstname_like=${searchUsersData.noMatchFirstnameLike}`, {
    headers: authHeaders,
  });

  expect(response.status()).toBe(404);
});

test('checks that URL-encoded special characters are treated as literal search values @functional-users-search', async ({ request, authHeaders }) => {
  const matchResponse = await request.get(`users?q=${searchUsersData.specialCharMatch}`, { headers: authHeaders });
  const noMatchResponse = await request.get(`users?q=${searchUsersData.specialCharNoMatch}`, { headers: authHeaders });

  expect.soft(matchResponse.status()).toBe(200);
  expect(noMatchResponse.status()).toBe(404);
});

test('checks that offset-based pagination returns the correct number of users @functional-users-pagination', async ({ request, authHeaders }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;
  const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
    headers: authHeaders,
  });

  const users = await response.json();

  expect(users).toHaveLength(limit);
});

test('checks that users at offset n do not overlap with users at offset 0 @functional-users-pagination', async ({ request, authHeaders }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;

  const page0Response = await request.get(`users?_start=0&_limit=${limit}`, { headers: authHeaders });
  const pageNResponse = await request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders });

  const page0Ids = (await page0Response.json()).map((u: { id: number }) => u.id);
  const pageNIds = (await pageNResponse.json()).map((u: { id: number }) => u.id);
  const hasOverlap = page0Ids.some((id: number) => pageNIds.includes(id));

  expect(hasOverlap).toBe(false);
});

test('checks that the X-Total-Count header reflects the total number of all users @functional-users-pagination', async ({ request, authHeaders }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;

  const allUsers = await fetchAllUsers(request, authHeaders);
  const realCount = allUsers.length;

  const response = await request.get(`users?_start=${start}&_limit=${limit}`, { headers: authHeaders });
  const totalCount = Number(response.headers()['x-total-count']);

  expect.soft(response.headers()['x-total-count']).toBeTruthy();
  expect(totalCount).toBe(realCount);
});

test('checks that range-based pagination returns exactly b-a users @functional-users-pagination', async ({ request, authHeaders }) => {
  const { start, end } = paginationOffsetData.offsetRange;
  const response = await request.get(`users?_start=${start}&_end=${end}`, {
    headers: authHeaders,
  });

  const users = await response.json();

  expect(users).toHaveLength(end - start);
});
