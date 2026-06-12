import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test.describe('Core', () => {
  test('DELETE /users/{id} deleted user is no longer accessible @functional-users_id-delete-core', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const deleteResponse = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect.soft(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /users/{id} deleted user is no longer present in the users list @functional-users_id-delete-core', async ({
    request,
    authHeaders,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const deleteResponse = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect.soft(deleteResponse.status()).toBe(200);

    const listResponse = await request.get('users', {
      headers: authHeaders,
    });
    const users = await listResponse.json();

    expect.soft(users.find((u: { id: number }) => u.id === createdUser.id)).toBeUndefined();
    expect(listResponse.status()).toBe(200);
  });
});

test.describe('Negative', () => {
  test('DELETE /users/{id} invalid ID format returns not found @functional-users_id-delete-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.delete(`users/${byIdData.invalidId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

  test('DELETE /users/{id} non-existent user returns not found @functional-users_id-delete-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.delete(`users/${byIdData.nonExistentId}`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });
});
