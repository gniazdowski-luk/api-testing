import { test, expect } from '@tests/fixtures';
import expectedUsersData from '@test-data/users/users.data.json';
import { filteringUsersData } from '@test-data/users/users.filtering.data';
import { searchUsersData } from '@test-data/users/users.search.data';
import { paginationOffsetData } from '@test-data/users/users.pagination.data';

const PAGE_LIMIT = 5;

test('GET /users contains specific users @functional-users', async ({ request, accessToken, userId }) => {
  const response = await request.get('users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
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

test('GET /users with pagination returns correct page size @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();

  expect(users).toHaveLength(PAGE_LIMIT);
});

test('GET /users with pagination includes X-Total-Count header with real value @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const allUsersResponse = await request.get('users', { headers });
  const allUsers = await allUsersResponse.json();
  const realCount = allUsers.length;

  const response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers });

  const totalCount = Number(response.headers()['x-total-count']);

  expect.soft(response.headers()['x-total-count']).toBeTruthy();
  expect(totalCount).toBe(realCount);
});

test('GET /users with pagination page 2 returns non-overlapping users with page 1 @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const page1Response = await request.get(`users?_page=1&_limit=${PAGE_LIMIT}`, { headers });
  const page2Response = await request.get(`users?_page=2&_limit=${PAGE_LIMIT}`, { headers });

  const page1Ids = (await page1Response.json()).map((u: { id: number }) => u.id);
  const page2Ids = (await page2Response.json()).map((u: { id: number }) => u.id);
  const hasOverlap = page1Ids.some((id: number) => page2Ids.includes(id));

  expect(hasOverlap).toBe(false);
});

test('GET /users with sorting by firstname ascending returns users in correct order @functional-users-sorting', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?_sort=firstname&_order=asc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const firstnames = users.map((u: { firstname: string }) => u.firstname);
  const sortedAsc = [...firstnames].sort();

  expect(firstnames).toEqual(sortedAsc);
});

test('GET /users with sorting by firstname descending returns users in correct order @functional-users-sorting', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?_sort=firstname&_order=desc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const firstnames = users.map((u: { firstname: string }) => u.firstname);
  const sortedDesc = [...firstnames].sort().reverse();

  expect(firstnames).toEqual(sortedDesc);
});

test('GET /users?firstname=<value> returns only users with matching firstname @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const data = filteringUsersData.singleFirstname;
  const response = await request.get(`users?firstname=${data.value}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual([data.expectedId]);
});

test('GET /users?firstname=<value> with no matching user responds with 404 @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?firstname=${filteringUsersData.noMatchFirstname}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  expect(response.status()).toBe(404);
});

test('GET /users?firstname=<value>&lastname=<value> applies AND logic @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const data = filteringUsersData.andFilter;
  const response = await request.get(`users?firstname=${data.firstname}&lastname=${data.lastname}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual([data.expectedId]);
});

test('GET /users?id=<id1>&id=<id2> applies OR logic @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const data = filteringUsersData.orFilter;
  const response = await request.get(`users?id=${data.ids[0]}&id=${data.ids[1]}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.ids);
});

test('GET /users?id_gte=<min>&id_lte=<max> returns users within inclusive range @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const data = filteringUsersData.idRange;
  const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('GET /users?id_gte=<min>&id_lte=<max> with no users in range responds with 404 @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const data = filteringUsersData.emptyIdRange;
  const response = await request.get(`users?id_gte=${data.min}&id_lte=${data.max}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  expect(response.status()).toBe(404);
});

test('GET /users with unrecognized param returns all users @functional-users-filtering', async ({ request, accessToken, userId }) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const allResponse = await request.get('users', { headers });
  const allUsers = await allResponse.json();

  const filteredResponse = await request.get(`users?${filteringUsersData.unknownParam}=test`, { headers });
  const filteredUsers = await filteredResponse.json();

  expect(filteredUsers).toHaveLength(allUsers.length);
});

test('GET /users?q=<text> returns only users matching the search text @functional-users-search', async ({ request, accessToken, userId }) => {
  const data = searchUsersData.matchingQuery;
  const response = await request.get(`users?q=${data.q}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('GET /users?q=<text> with no matching user responds with 404 @functional-users-search', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?q=${searchUsersData.noMatchQuery}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  expect(response.status()).toBe(404);
});

test('GET /users?q= with empty string returns all users @functional-users-search', async ({ request, accessToken, userId }) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const allResponse = await request.get('users', { headers });
  const allUsers = await allResponse.json();

  const searchResponse = await request.get('users?q=', { headers });
  const searchUsers = await searchResponse.json();

  expect(searchUsers).toHaveLength(allUsers.length);
});

test('GET /users?firstname_like=<pattern> returns users with matching firstname @functional-users-search', async ({ request, accessToken, userId }) => {
  const data = searchUsersData.firstnameLike;
  const response = await request.get(`users?firstname_like=${data.pattern}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();
  const userIds = users.map((u: { id: number }) => u.id);

  expect(userIds).toEqual(data.expectedIds);
});

test('GET /users?firstname_like=<pattern> with no matching user responds with 404 @functional-users-search', async ({ request, accessToken, userId }) => {
  const response = await request.get(`users?firstname_like=${searchUsersData.noMatchFirstnameLike}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  expect(response.status()).toBe(404);
});

test('GET /users?q=<url-encoded-special-chars> treats decoded value as literal search @functional-users-search', async ({ request, accessToken, userId }) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const matchResponse = await request.get(`users?q=${searchUsersData.specialCharMatch}`, { headers });
  const noMatchResponse = await request.get(`users?q=${searchUsersData.specialCharNoMatch}`, { headers });

  expect.soft(matchResponse.status()).toBe(200);
  expect(noMatchResponse.status()).toBe(404);
});

test('GET /users?_start=<n>&_limit=<size> returns exactly <size> users @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;
  const response = await request.get(`users?_start=${start}&_limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();

  expect(users).toHaveLength(limit);
});

test('GET /users?_start=<n>&_limit=<size> returns non-overlapping users with _start=0 @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const page0Response = await request.get(`users?_start=0&_limit=${limit}`, { headers });
  const pageNResponse = await request.get(`users?_start=${start}&_limit=${limit}`, { headers });

  const page0Ids = (await page0Response.json()).map((u: { id: number }) => u.id);
  const pageNIds = (await pageNResponse.json()).map((u: { id: number }) => u.id);
  const hasOverlap = page0Ids.some((id: number) => pageNIds.includes(id));

  expect(hasOverlap).toBe(false);
});

test('GET /users?_start=<n>&_limit=<size> includes X-Total-Count header with real total count @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const { start, limit } = paginationOffsetData.offsetLimit;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `id=${userId}`,
  };

  const allUsersResponse = await request.get('users', { headers });
  const allUsers = await allUsersResponse.json();
  const realCount = allUsers.length;

  const response = await request.get(`users?_start=${start}&_limit=${limit}`, { headers });
  const totalCount = Number(response.headers()['x-total-count']);

  expect.soft(response.headers()['x-total-count']).toBeTruthy();
  expect(totalCount).toBe(realCount);
});

test('GET /users?_start=<a>&_end=<b> returns exactly b-a users starting from index a @functional-users-pagination', async ({ request, accessToken, userId }) => {
  const { start, end } = paginationOffsetData.offsetRange;
  const response = await request.get(`users?_start=${start}&_end=${end}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();

  expect(users).toHaveLength(end - start);
});
