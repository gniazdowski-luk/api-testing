import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('PATCH /users unauthenticated access returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users empty Bearer token returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users invalid Bearer token returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users wrong Basic auth returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users valid token without Cookie returns error @security-users-patch-authorization', async ({
  request,
  accessToken,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
