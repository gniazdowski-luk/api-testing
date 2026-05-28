import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('PUT /users unauthenticated access returns error @security-users-put-authorization', async ({ request }) => {
  const response = await request.put('users', {
    data: usersPayloadsData.put,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users empty Bearer token returns error @security-users-put-authorization', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: usersPayloadsData.put,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users invalid Bearer token returns error @security-users-put-authorization', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: usersPayloadsData.put,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('GET /users inverted ID range returns not found @security-users-put-authorization', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: usersPayloadsData.put,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users valid token without Cookie returns error @security-users-put-authorization', async ({
  request,
  accessToken,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: usersPayloadsData.put,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});

test('PUT /users expired token returns error @security-users-put-expired_token', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.expiredToken },
    data: usersPayloadsData.put,
  });

  expect(response.status()).toBe(401);
});
