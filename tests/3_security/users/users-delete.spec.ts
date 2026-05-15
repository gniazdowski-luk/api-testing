import { test, expect } from '@tests/fixtures';
import { securityUsersData } from '@test-data/users/users.security.data';

test('checks that missing authorization returns the correct status code and error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users');
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an empty Bearer token returns the correct status code and error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an invalid Bearer token returns the correct status code and error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that wrong Basic auth returns the correct status code and error message @security-authorization-delete-users', async ({ request }) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that a valid token without Cookie returns the correct status code and error message @security-authorization-delete-users', async ({ request, accessToken }) => {
  const response = await request.delete('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
