import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('checks that missing authorization returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an empty Bearer token returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an invalid Bearer token returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that wrong Basic auth returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that a valid token without Cookie returns the correct status code and error message @security-authorization-patch-users', async ({
  request,
  accessToken,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: securityUsersData.patchUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
