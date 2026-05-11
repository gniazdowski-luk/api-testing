import { test, expect } from '@tests/fixtures';
import { securityUsersData } from '@test-data/security/users.security.data';

test('DELETE /users without Authorization header returns 401 with error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users');
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users with empty Bearer token returns 401 with error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users with wrong Bearer token returns 401 with error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users with wrong Basic auth returns 401 with error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('DELETE /users with valid Bearer token but without Cookie returns 401 with error message @security-authorization-delete-users', async ({ request, accessToken }) => {
  const response = await request.delete('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
