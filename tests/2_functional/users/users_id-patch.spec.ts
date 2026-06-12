import { buildUserPayload, buildUserPayloadWithBirthDate, postEmptyFieldData } from '@test-data/users/users.post.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test.describe('Core', () => {
  test('PATCH /users/{id} updated field is included in the response @functional-users_id-patch-core', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const patchPayload = { firstname: buildUserPayload().firstname };
    const patchResponse = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: patchPayload,
    });

    expect.soft(patchResponse.status()).toBe(200);

    const getResponse = await request.get(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });
    const updatedUser = await getResponse.json();

    expect.soft(updatedUser).toMatchObject({
      id: createdUser.id,
      firstname: patchPayload.firstname,
    });
    expect(getResponse.status()).toBe(200);
  });

  test('PATCH /users/{id} unmodified fields retain their values @functional-users_id-patch-core', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const patchPayload = { firstname: buildUserPayload().firstname };
    const patchResponse = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: patchPayload,
    });

    expect.soft(patchResponse.status()).toBe(200);

    const getResponse = await request.get(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });
    const updatedUser = await getResponse.json();

    expect.soft(updatedUser).toMatchObject({
      id: createdUser.id,
      lastname: createdUser.lastname,
      avatar: createdUser.avatar,
    });
    expect(getResponse.status()).toBe(200);
  });
});

test.describe('Edge cases', () => {
  test('PATCH /users/{id} updating with the same values is accepted @functional-users_id-patch-edge', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: {
        firstname: createdUser.firstname,
        lastname: createdUser.lastname,
        email: createdUser.email,
        password: createdUser.password,
        avatar: createdUser.avatar,
      },
    });

    expect(response.status()).toBe(200);
  });

  test('PATCH /users/{id} updating birthDate field is accepted @functional-users_id-patch-edge', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const { birthDate } = buildUserPayloadWithBirthDate();
    const patchResponse = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: { birthDate },
    });

    expect(patchResponse.status()).toBe(200);
  });
});

test.describe('Negative', () => {
  test('PATCH /users/{id} invalid ID format returns unauthorized @functional-users_id-patch-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.patch(`users/${byIdData.invalidId}`, {
      headers: authHeaders,
      data: { firstname: buildUserPayload().firstname },
    });

    expect(response.status()).toBe(401);
  });

  test('PATCH /users/{id} non-existent user returns unauthorized @functional-users_id-patch-negative', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.patch(`users/${byIdData.nonExistentId}`, {
      headers: authHeaders,
      data: { firstname: buildUserPayload().firstname },
    });

    expect(response.status()).toBe(401);
  });

  test('PATCH /users/{id} empty firstname string returns validation error @functional-users_id-patch-negative', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: postEmptyFieldData.emptyFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('PATCH /users/{id} empty lastname string returns validation error @functional-users_id-patch-negative', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: postEmptyFieldData.emptyLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('PATCH /users/{id} empty email string returns validation error @functional-users_id-patch-negative', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: postEmptyFieldData.emptyEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('PATCH /users/{id} empty password string returns validation error @functional-users_id-patch-negative', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: postEmptyFieldData.emptyPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('PATCH /users/{id} empty avatar string returns validation error @functional-users_id-patch-negative', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: postEmptyFieldData.emptyAvatar,
    });

    expect(response.status()).toBe(422);
  });
});
