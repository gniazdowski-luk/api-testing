import expectedUsersData from '@test-data/users/users.data.json';
import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test('GET /users endpoint is accessible @smoke-users-get', async ({
  request,
  authHeaders,
}) => {
  const response = await request.get('users', {
    headers: authHeaders,
  });
  const users = await response.json();

  expect.soft(users).toBeInstanceOf(Array);
  expect(response.status()).toBe(200);
});

test('GET /users/{id} endpoint is accessible @smoke-users_id-get', async ({
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
  });
  expect(response.status()).toBe(200);
});

test('POST /users endpoint is accessible @smoke-users-post', async ({
  request,
}) => {
  const newUserPayload = buildUserPayload();

  const response = await request.post('users', {
    data: newUserPayload,
  });
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

test('PUT /users/{id} endpoint is accessible @smoke-users-put', async ({
  request,
}) => {
  const { createdUser, testAuthHeaders } = await createUserAndLogin(request);

  const updatedPayload = buildUserPayload();
  const response = await request.put(`users/${createdUser.id}`, {
    headers: testAuthHeaders,
    data: updatedPayload,
  });
  const updatedUser = await response.json();

  expect.soft(updatedUser).toMatchObject({
    id: createdUser.id,
    firstname: updatedPayload.firstname,
    lastname: updatedPayload.lastname,
    email: updatedPayload.email,
    password: updatedPayload.password,
    avatar: updatedPayload.avatar,
  });
  expect(response.status()).toBe(200);
});

test('HEAD /users endpoint is accessible @smoke-users-head', async ({
  request,
  authHeaders,
}) => {
  const response = await request.head('users', {
    headers: authHeaders,
  });
  const body = await response.text();

  expect.soft(body).toBe('');
  expect(response.status()).toBe(200);
});
