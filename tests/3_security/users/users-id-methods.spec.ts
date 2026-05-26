import { buildUserPayload } from '@test-data/users/users.post.data';
import expectedUsersData from '@test-data/users/users.data.json';
import { byIdData } from '@test-data/users/users-id.data';
import { expect, test } from '@tests/fixtures';

const userId = expectedUsersData.user1.id;

test('checks that sending POST to a single user returns the correct status code @security-methods-users-id', async ({
  request,
}) => {
  const response = await request.post(`users/${userId}`, { data: buildUserPayload() });

  expect(response.status()).toBe(404);
});

test('checks that sending POST to a non-existing user returns the correct status code @security-methods-users-id', async ({
  request,
}) => {
  const response = await request.post(`users/${byIdData.nonExistentId}`, { data: buildUserPayload() });

  expect(response.status()).toBe(404);
});
