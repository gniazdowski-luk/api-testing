import { test, expect } from '@tests/fixtures';
import expectedUsersData from '@test-data/users/users.data.json';

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

test('GET /users without cookie id has masked lastname @functional-users-negative', async ({ request, accessToken }) => {
  const response = await request.get('users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect([user1.lastname, user2.lastname]).toEqual([expectedUsersData.maskedLastname, expectedUsersData.maskedLastname]);
});
