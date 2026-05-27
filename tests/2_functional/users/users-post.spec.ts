import {
  buildUserPayload,
  buildUserPayloadWithBirthDate,
  postEmptyFieldData,
  postInvalidBirthDateData,
  postInvalidEmailFormatData,
  postInvalidTypeData,
  postMissingFieldData,
  postNegativeData,
  postNullFieldData,
} from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';

test.describe('Core', () => {
  test('POST /users created user is present in the existing users response @functional-users_id-post-core', async ({
    request,
    authHeaders,
  }) => {
    const newUserPayload = buildUserPayload();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });

    expect.soft(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();

    const getResponse = await request.get('users', {
      headers: authHeaders,
    });

    expect.soft(getResponse.status()).toBe(200);
    const users = await getResponse.json();

    const foundUser = users.find((u: { id: number }) => u.id === createdUser.id);

    expect.soft(foundUser).toMatchObject({
      id: createdUser.id,
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      avatar: newUserPayload.avatar,
    });
    expect(getResponse.status()).toBe(200);
  });

  test('POST /users created user can log in with correct credentials @functional-users_id-post-core', async ({
    request,
  }) => {
    const newUserPayload = buildUserPayload();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });

    expect.soft(createResponse.status()).toBe(201);
    await createResponse.json();

    const loginResponse = await request.post('login', {
      data: {
        email: newUserPayload.email,
        password: newUserPayload.password,
      },
    });

    expect.soft(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();

    expect.soft(loginBody).toMatchObject({ access_token: expect.any(String) });
    expect(loginResponse.status()).toBe(200);
  });

  test('POST /users create user with birthdate includes correct user data in the response @functional-users_id-post-core', async ({
    request,
  }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const response = await request.post('users', {
      data: newUserPayload,
    });

    expect.soft(response.status()).toBe(201);
    const createdUser = await response.json();

    expect.soft(createdUser).toMatchObject({
      id: expect.any(Number),
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      email: newUserPayload.email,
      password: newUserPayload.password,
      avatar: newUserPayload.avatar,
    });
    expect(response.status()).toBe(201);
  });

  test('POST /users created user with birthdate is present in the existing users response @functional-users_id-post-core', async ({
    request,
    authHeaders,
  }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });

    expect.soft(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();

    const getResponse = await request.get('users', {
      headers: authHeaders,
    });

    expect.soft(getResponse.status()).toBe(200);
    const users = await getResponse.json();

    const foundUser = users.find((u: { id: number }) => u.id === createdUser.id);

    expect.soft(foundUser).toMatchObject({
      id: createdUser.id,
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      avatar: newUserPayload.avatar,
    });
    expect(getResponse.status()).toBe(200);
  });

  test('POST /users created user with birthdate can log in with correct credentials @functional-users_id-post-core', async ({
    request,
  }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });

    expect.soft(createResponse.status()).toBe(201);
    await createResponse.json();

    const loginResponse = await request.post('login', {
      data: {
        email: newUserPayload.email,
        password: newUserPayload.password,
      },
    });

    expect.soft(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();

    expect.soft(loginBody).toMatchObject({ access_token: expect.any(String) });
    expect(loginResponse.status()).toBe(200);
  });
});

test.describe('Edge cases', () => {
  test('POST /users invalid birthDate format is accepted @functional-users_id-post-edge', async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidBirthDateData.nonIso8601,
    });

    expect(response.status()).toBe(201);
  });
});

test.describe('Negative', () => {
  test('POST /users duplicate email returns conflict @functional-users_id-post-negative', async ({ request }) => {
    await request.post('users', {
      data: postNegativeData.duplicateEmailBase,
    });

    const response = await request.post('users', {
      data: postNegativeData.duplicateEmailBase,
    });

    expect(response.status()).toBe(409);
  });

  test('POST /users missing firstname returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users missing lastname returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users missing email returns validation error @functional-users_id-post-negative', async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users missing password returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users missing avatar returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingAvatar,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users invalid firstname type returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users invalid lastname type returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users invalid email type returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users invalid password type returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users invalid avatar type returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidAvatar,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users email missing at symbol returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingAt,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users email missing domain returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingDomain,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users email missing local part returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingLocalPart,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty body returns validation error @functional-users_id-post-negative', async ({ request }) => {
    const response = await request.post('users', {
      data: postNegativeData.emptyBody,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users unrecognized extra fields returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postNegativeData.extraFields,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty firstname string returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postEmptyFieldData.emptyFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty lastname string returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postEmptyFieldData.emptyLastname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty email string returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postEmptyFieldData.emptyEmail,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty password string returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postEmptyFieldData.emptyPassword,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users empty avatar string returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postEmptyFieldData.emptyAvatar,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users null firstname returns validation error @functional-users_id-post-negative', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postNullFieldData.nullFirstname,
    });

    expect(response.status()).toBe(422);
  });

  test('POST /users null email returns validation error @functional-users_id-post-negative', async ({ request }) => {
    const response = await request.post('users', {
      data: postNullFieldData.nullEmail,
    });

    expect(response.status()).toBe(422);
  });
});
