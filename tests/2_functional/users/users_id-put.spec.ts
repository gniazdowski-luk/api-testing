import { buildUserPayload, postMissingFieldData } from '@test-data/users/users.post.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test.describe('Core', () => {
  test('PUT /users/{id} updated user data is included in the response @functional-users_id-put-core', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const updatedPayload = buildUserPayload();
    const putResponse = await request.put(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: updatedPayload,
    });

    expect.soft(putResponse.status()).toBe(200);

    const getResponse = await request.get(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });
    const updatedUser = await getResponse.json();

    expect.soft(updatedUser).toMatchObject({
      id: createdUser.id,
      firstname: updatedPayload.firstname,
      lastname: updatedPayload.lastname,
      avatar: updatedPayload.avatar,
    });
    expect(getResponse.status()).toBe(200);
  });

  test('PUT /users/{id} updated user can log in with new credentials @functional-users_id-put-core', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const updatedPayload = buildUserPayload();
    const putResponse = await request.put(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: updatedPayload,
    });

    expect.soft(putResponse.status()).toBe(200);

    const loginResponse = await request.post('login', {
      data: {
        email: updatedPayload.email,
        password: updatedPayload.password,
      },
    });

    expect.soft(loginResponse.status()).toBe(200);
    
    const loginBody = await loginResponse.json();

    expect.soft(loginBody).toMatchObject({ access_token: expect.any(String) });
    expect(loginResponse.status()).toBe(200);
  });
});

test.describe('Negative', () => {
  test('PUT /users/{id} invalid ID format returns unauthorized @functional-users_id-put-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.put(`users/${byIdData.invalidId}`, {
      headers: authHeaders,
      data: buildUserPayload(),
    });

    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} non-existent user returns unauthorized @functional-users_id-put-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.put(`users/${byIdData.nonExistentId}`, {
      headers: authHeaders,
      data: buildUserPayload(),
    });

    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} missing firstname returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postMissingFieldData.missingFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} missing lastname returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postMissingFieldData.missingLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} missing email returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postMissingFieldData.missingEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} missing password returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postMissingFieldData.missingPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} missing avatar returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postMissingFieldData.missingAvatar,
    });

    expect(response.status()).toBe(422);
  });
});
