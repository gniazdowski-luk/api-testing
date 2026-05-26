import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('checks that missing authorization on DELETE /users returns the correct status code and error message @security-authorization-delete-users', async ({
  request,
}) => {
  const response = await request.delete('users');
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an empty Bearer token on DELETE /users returns the correct status code and error message @security-authorization-delete-users', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an invalid Bearer token on DELETE /users returns the correct status code and error message @security-authorization-delete-users', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that wrong Basic auth on DELETE /users returns the correct status code and error message @security-authorization-delete-users', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that a valid token without Cookie on DELETE /users returns the correct status code and error message @security-authorization-delete-users', async ({
  request,
  accessToken,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});

test('checks that an expired token on DELETE /users returns the correct status code and error message @security-expired-token-users', async ({
  request,
}) => {
  const response = await request.delete('users', {
    headers: { Authorization: securityUsersData.expiredToken },
  });

  expect(response.status()).toBe(401);
});
