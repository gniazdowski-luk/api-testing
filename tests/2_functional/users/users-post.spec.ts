import { buildUserPayload, buildUserPayloadWithBirthDate, postInvalidEmailFormatData, postInvalidTypeData, postMissingFieldData, postNegativeData } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';

test(
  'checks that a newly created user appears in the users list with correct data @functional-users-post',
  async ({ request, authHeaders }) => {
    const newUserPayload = buildUserPayload();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });
    const createdUser = await createResponse.json();

    const getResponse = await request.get('users', {
      headers: authHeaders,
    });
    const users = await getResponse.json();

    const foundUser = users.find((u: { id: number }) => u.id === createdUser.id);

    expect.soft(foundUser).toMatchObject({
      id: createdUser.id,
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      avatar: newUserPayload.avatar,
    });
    expect(getResponse.status()).toBe(200);
  },
);

test(
  'checks that a newly created user can log in with the correct credentials @functional-users-post',
  async ({ request }) => {
    const newUserPayload = buildUserPayload();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });
    await createResponse.json();

    const loginResponse = await request.post('login', {
      data: {
        email: newUserPayload.email,
        password: newUserPayload.password,
      },
    });
    const loginBody = await loginResponse.json();

    expect.soft(loginBody).toMatchObject({ access_token: expect.any(String) });
    expect(loginResponse.status()).toBe(200);
  },
);

test(
  'checks that creating a user with a birthdate returns the correct status code and a well-formed response body @functional-users-post',
  async ({ request }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const response = await request.post('users', {
      data: newUserPayload,
    });
    const body = await response.json();

    expect.soft(body).toMatchObject({
      id: expect.any(Number),
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      email: newUserPayload.email,
      password: newUserPayload.password,
      avatar: newUserPayload.avatar,
    });
    expect(response.status()).toBe(201);
  },
);

test(
  'checks that a newly created user with a birthdate appears in the users list with correct data @functional-users-post',
  async ({ request, authHeaders }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });
    const createdUser = await createResponse.json();

    const getResponse = await request.get('users', {
      headers: authHeaders,
    });
    const users = await getResponse.json();

    const foundUser = users.find((u: { id: number }) => u.id === createdUser.id);

    expect.soft(foundUser).toMatchObject({
      id: createdUser.id,
      firstname: newUserPayload.firstname,
      lastname: newUserPayload.lastname,
      avatar: newUserPayload.avatar,
    });
    expect(getResponse.status()).toBe(200);
  },
);

test(
  'checks that a newly created user with a birthdate can log in with the correct credentials @functional-users-post',
  async ({ request }) => {
    const newUserPayload = buildUserPayloadWithBirthDate();

    const createResponse = await request.post('users', {
      data: newUserPayload,
    });
    await createResponse.json();

    const loginResponse = await request.post('login', {
      data: {
        email: newUserPayload.email,
        password: newUserPayload.password,
      },
    });
    const loginBody = await loginResponse.json();

    expect.soft(loginBody).toMatchObject({ access_token: expect.any(String) });
    expect(loginResponse.status()).toBe(200);
  },
);

test(
  'checks that creating a user with a duplicate email returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    await request.post('users', {
      data: postNegativeData.duplicateEmailBase,
    });

    const response = await request.post('users', {
      data: postNegativeData.duplicateEmailBase,
    });

    expect(response.status()).toBe(409);
  },
);

test(
  'checks that creating a user without firstname returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingFirstname,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user without lastname returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingLastname,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user without email returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingEmail,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user without password returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingPassword,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user without avatar returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingAvatar,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with firstname as a non-string type returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidFirstname,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with lastname as a non-string type returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidLastname,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with email as a non-string type returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidEmail,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with password as a non-string type returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidPassword,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with avatar as a non-string type returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidTypeData.invalidAvatar,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with an email missing the @ symbol returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingAt,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with an email missing the domain returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingDomain,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with an email missing the local part returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postInvalidEmailFormatData.missingLocalPart,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that creating a user with an empty body returns the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postNegativeData.emptyBody,
    });

    expect(response.status()).toBe(422);
  },
);

test(
  'checks that extra unrecognized fields in the payload return the correct status code @functional-users-post-negative',
  async ({ request }) => {
    const response = await request.post('users', {
      data: postNegativeData.extraFields,
    });

    expect(response.status()).toBe(422);
  },
);
