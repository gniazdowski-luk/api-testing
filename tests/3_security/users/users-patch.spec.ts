import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('checks that missing authorization on PATCH /users returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    data: usersPayloadsData.patch,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an empty Bearer token on PATCH /users returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: usersPayloadsData.patch,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an invalid Bearer token on PATCH /users returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: usersPayloadsData.patch,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that wrong Basic auth on PATCH /users returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: usersPayloadsData.patch,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that a valid token without Cookie on PATCH /users returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
  accessToken,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: usersPayloadsData.patch,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
