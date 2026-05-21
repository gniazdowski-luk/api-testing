import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';

test('checks that the endpoint for retrieving users is accessible and returns a successful response @smoke', async ({
  request,
  accessToken,
}) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json();

  expect.soft(body).toBeInstanceOf(Array);
  expect(response.status()).toBe(200);
});

test('checks that the endpoint for creating a user is accessible and returns a successful response @smoke', async ({
  request,
}) => {
  const newUserPayload = buildUserPayload();

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
});
