import expectedUsersData from '@test-data/users/users.data.json';
import { buildUserPayload } from '@test-data/users/users.post.data';
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

  test('POST /users response includes the correct Content-Type header @contract-users-post', async ({ request }) => {
    const response = await request.post('users', {
      data: buildUserPayload(),
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('PUT /users/{id}', () => {
  test('PUT /users/{id} response matches the user contract schema @contract-users_id-put', async ({ request }) => {
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

test.describe('PATCH /users/{id}', () => {
  test('PATCH /users/{id} response matches the user contract schema @contract-users_id-patch', async ({ request }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: { firstname: buildUserPayload().firstname },
    });
    const patchedUser = await response.json();
    const result = validator.validate(patchedUser, userSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('PATCH /users/{id} response includes the correct Content-Type header @contract-users_id-patch', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.patch(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
      data: { firstname: buildUserPayload().firstname },
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('DELETE /users/{id}', () => {
  test('DELETE /users/{id} response matches the user contract schema @contract-users_id-delete', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });
    const deletedUser = await response.json();

    expect(deletedUser).toEqual({});
  });

  test('DELETE /users/{id} response includes the correct Content-Type header @contract-users_id-delete', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('HEAD /users', () => {
  test('HEAD /users response body is empty @contract-users-head', async ({ request, authHeaders }) => {
    const response = await request.head('users', { headers: authHeaders });
    const body = await response.text();

    expect(body).toBe('');
  });

  test('HEAD /users response includes the correct Content-Type header @contract-users-head', async ({
    request,
    authHeaders,
  }) => {
    const [getResponse, headResponse] = await Promise.all([
      request.get('users', { headers: authHeaders }),
      request.head('users', { headers: authHeaders }),
    ]);

    expect(headResponse.headers()['content-type']).toBe(getResponse.headers()['content-type']);
  });

  test('HEAD /users response includes X-Total-Count header @contract-users-head', async ({ request, authHeaders }) => {
    const response = await request.head('users?_page=1&_limit=5', { headers: authHeaders });

    expect(response.headers()['x-total-count']).toBeTruthy();
  });
});
