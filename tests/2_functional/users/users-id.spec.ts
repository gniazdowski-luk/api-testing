import expectedUsersData from '@test-data/users/users.data.json';
import { byIdData } from '@test-data/users/users-id.data';
import { expect, test } from '@tests/fixtures';

test.describe('Core', () => {
  test('checks that an existing user can be retrieved by ID with correct fields @functional-users-id', async ({
    request,
    authHeaders,
  }) => {
    const user1Expected = expectedUsersData.user1;

    const response = await request.get(`users/${user1Expected.id}`, {
      headers: authHeaders,
    });

    const body = await response.json();

    expect(body).toMatchObject({
      id: user1Expected.id,
      firstname: user1Expected.firstname,
      lastname: user1Expected.lastname,
      email: expect.any(String),
      avatar: expect.any(String),
      password: expect.any(String),
    });
  });
});

test.describe('Negative', () => {
  test('checks that retrieving a non-existent user returns the correct status code @functional-users-id-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${byIdData.nonExistentId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('checks that retrieving a user with an invalid ID returns the correct status code @functional-users-id-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${byIdData.invalidId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});
