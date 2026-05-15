import { test, expect } from '@tests/fixtures';
import expectedUsersData from '@test-data/users/users.data.json';
import { securityUsersData } from '@test-data/users/users.security.data';

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

function assertMaskedFields(
  users: { id: number; email: string; lastname: string; password: string }[],
  response: { status: () => number },
) {
  const user1 = users.find((u) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1!.email, lastname: user1!.lastname, password: user1!.password },
    { email: user2!.email, lastname: user2!.lastname, password: user2!.password },
  ]).toEqual([maskedUser, maskedUser]);
}

test('checks that unauthenticated access returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users');
  const users = await response.json();

  assertMaskedFields(users, response);
});

test('checks that an empty Bearer token returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const users = await response.json();

  assertMaskedFields(users, response);
});

test('checks that an invalid Bearer token returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const users = await response.json();

  assertMaskedFields(users, response);
});

test('checks that wrong Basic auth returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const users = await response.json();

  assertMaskedFields(users, response);
});

test('checks that a valid token without Cookie returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({ request, accessToken }) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const users = await response.json();

  assertMaskedFields(users, response);
});
