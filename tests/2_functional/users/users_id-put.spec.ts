import {
  buildUserPayload,
  postEmptyFieldData,
  postInvalidEmailFormatData,
  postInvalidTypeData,
  postMissingFieldData,
  postNegativeData,
  postNullFieldData,
} from '@test-data/users/users.post.data';
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

  test('PUT /users/{id} invalid firstname type returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidTypeData.invalidFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} invalid lastname type returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidTypeData.invalidLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} invalid email type returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidTypeData.invalidEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} invalid password type returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidTypeData.invalidPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} invalid avatar type returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidTypeData.invalidAvatar,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} email missing at symbol returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidEmailFormatData.missingAt,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} email missing domain returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidEmailFormatData.missingDomain,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} email missing local part returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postInvalidEmailFormatData.missingLocalPart,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty body returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postNegativeData.emptyBody,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} unrecognized extra fields returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postNegativeData.extraFields,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty firstname string returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postEmptyFieldData.emptyFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty lastname string returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postEmptyFieldData.emptyLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty email string returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postEmptyFieldData.emptyEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty password string returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postEmptyFieldData.emptyPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} empty avatar string returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postEmptyFieldData.emptyAvatar,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} null firstname returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postNullFieldData.nullFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('PUT /users/{id} null email returns validation error @functional-users_id-put-negative', async ({
    request,
    authHeaders,
    userId,
  }) => {
    const response = await request.put(`users/${userId}`, {
      headers: authHeaders,
      data: postNullFieldData.nullEmail,
    });

    expect(response.status()).toBe(422);
  });
});
