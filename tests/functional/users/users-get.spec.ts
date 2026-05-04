import { test, expect } from '@tests/fixtures';
import expectedUsersData from '@test-data/users/users.data.json';

test('GET /users contains a specific user @functional-users', async ({ request, accessToken, userId }) => {
  const { id, firstname, lastname } = expectedUsersData.mosesArmstrong;

  const response = await request.get('users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    },
  });

  const users = await response.json();

  const user = users.find((u: { id: number }) => u.id === id);

  expect(user).toMatchObject({
    id,
    firstname,
    lastname,
    email: expect.any(String),
    avatar: expect.any(String),
    password: expect.any(String),
  });
});
