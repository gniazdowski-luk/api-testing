import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('DELETE /users unauthenticated access returns error @security-users-delete-authorization', async ({
  request,
}) => {
  const response = await request.delete('users');
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users empty Bearer token returns error @security-users-delete-authorization', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users invalid Bearer token returns error @security-users-delete-authorization', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users wrong Basic auth returns error @security-users-delete-authorization', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users valid token without Cookie returns error @security-users-delete-authorization', async ({
  request,
  accessToken,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});

test('DELETE /users expired token returns error @security-users-delete-expired_token', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.expiredToken },
  });

  expect(response.status()).toBe(401);
});
