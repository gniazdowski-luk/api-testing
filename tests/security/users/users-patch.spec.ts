import { test, expect } from '@tests/fixtures';
import { securityUsersData } from '@test-data/users/users.security.data';

test('PATCH /users without Authorization header returns 401 with error message @security-authorization-patch-users', async ({ request }) => {
  const response = await request.patch('users', {
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users with empty Bearer token returns 401 with error message @security-authorization-patch-users', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users with wrong Bearer token returns 401 with error message @security-authorization-patch-users', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users with wrong Basic auth returns 401 with error message @security-authorization-patch-users', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users with valid Bearer token but without Cookie returns 401 with error message @security-authorization-patch-users', async ({ request, accessToken }) => {
  const response = await request.patch('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
