import expectedUsersData from '@test-data/users/users.data.json';
import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { buildUserPayload, postMissingFieldData } from '@test-data/users/users.post.data';
import { userSchema, usersSchema } from '@test-data/users/users.schema';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';
import { Validator } from 'jsonschema';

const validator = new Validator();

test.describe('GET', () => {
  test('GET /users response matches the users contract schema @contract-users-get', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users', {
      headers: authHeaders,
    });

    const users = await response.json();
    const result = validator.validate(users, usersSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('GET /users response includes the correct Content-Type header @contract-users-get', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get('users', {
      headers: authHeaders,
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('GET /users/{id}', () => {
  test('GET /users/{id} response matches the user contract schema @contract-users_id-get', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: authHeaders,
    });

    const user = await response.json();
    const result = validator.validate(user, userSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('GET /users/{id} response includes the correct Content-Type header @contract-users_id-get', async ({
    request,
    authHeaders,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: authHeaders,
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('POST', () => {
  test('POST /users response matches the user contract schema @contract-users-post', async ({ request }) => {
    const response = await request.post('users', {
      data: buildUserPayload(),
    });

    const createdUser = await response.json();
    const result = validator.validate(createdUser, userSchema);
    expect(result.errors).toHaveLength(0);
  });

  test('POST /users response includes the correct Content-Type header @contract-users-post', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: buildUserPayload(),
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('PUT /users/{id}', () => {
  test('PUT /users/{id} response matches the user contract schema @contract-users_id-put', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: buildUserPayload(),
    });

    const updatedUser = await response.json();
    const result = validator.validate(updatedUser, userSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('PUT /users/{id} response includes the correct Content-Type header @contract-users_id-put', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: buildUserPayload(),
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

