import expectedUsersData from '@test-data/users/users.data.json';
import { buildUserPayload } from '@test-data/users/users.post.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';

test('POST /users/{id} unsupported method returns not found @security-users_id-post-methods', async ({
  request,
}) => {
  const response = await request.post(`users/${expectedUsersData.user1.id}`, {
    data: buildUserPayload(),
  });

  expect(response.status()).toBe(404);
});

test('POST /users/{id} unsupported method for non-existent user returns not found @security-users_id-post-methods', async ({
  request,
}) => {
  const response = await request.post(`users/${byIdData.nonExistentId}`, {
    data: buildUserPayload(),
  });

  expect(response.status()).toBe(404);
});
