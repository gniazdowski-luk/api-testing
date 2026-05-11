import { test, expect } from '@tests/fixtures';
import expectedUsersData from '@test-data/users/users.data.json';
import { securityUsersData } from '@test-data/security/users.security.data';

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

test('GET /users without Authorization header returns 200 with masked fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users');
  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1.email, lastname: user1.lastname, password: user1.password },
    { email: user2.email, lastname: user2.lastname, password: user2.password },
  ]).toEqual([maskedUser, maskedUser]);
});

test('GET /users with empty Bearer token returns 200 with masked fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
  });
  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1.email, lastname: user1.lastname, password: user1.password },
    { email: user2.email, lastname: user2.lastname, password: user2.password },
  ]).toEqual([maskedUser, maskedUser]);
});

test('GET /users with wrong Bearer token returns 200 with masked fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
  });
  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1.email, lastname: user1.lastname, password: user1.password },
    { email: user2.email, lastname: user2.lastname, password: user2.password },
  ]).toEqual([maskedUser, maskedUser]);
});

test('GET /users with wrong Basic auth returns 200 with masked fields @security-authorization-get-users', async ({ request }) => {
  const response = await request.get('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
  });
  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1.email, lastname: user1.lastname, password: user1.password },
    { email: user2.email, lastname: user2.lastname, password: user2.password },
  ]).toEqual([maskedUser, maskedUser]);
});

test('GET /users with valid Bearer token but without Cookie returns 200 with masked fields @security-authorization-get-users', async ({ request, accessToken }) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const users = await response.json();

  const user1 = users.find((u: { id: number }) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u: { id: number }) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1.email, lastname: user1.lastname, password: user1.password },
    { email: user2.email, lastname: user2.lastname, password: user2.password },
  ]).toEqual([maskedUser, maskedUser]);
});
