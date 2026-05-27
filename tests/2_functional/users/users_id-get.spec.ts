import expectedUsersData from '@test-data/users/users.data.json';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';

test.describe('Core', () => {
  test('GET /users/{id} user data is correct @functional-users_id-get-core', async ({
    request,
    authHeaders,
  }) => {
    const user1Expected = expectedUsersData.user1;

    const response = await request.get(`users/${user1Expected.id}`, {
      headers: authHeaders,
    });
    const user = await response.json();

    expect.soft(user).toMatchObject({
      id: user1Expected.id,
      firstname: user1Expected.firstname,
      lastname: user1Expected.lastname,
    });
    expect(response.status()).toBe(200);
  });
});

test.describe('Negative', () => {
  test('GET /users/{id} non-existent user returns not found @functional-users_id-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${byIdData.nonExistentId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('GET /users/{id} invalid ID format returns not found @functional-users_id-get-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${byIdData.invalidId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});
