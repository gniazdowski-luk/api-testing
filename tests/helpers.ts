import type { APIRequestContext, APIResponse } from '@playwright/test';

import expectedUsersData from '@test-data/users/users.data.json';
import { buildUserPayload } from '@test-data/users/users.post.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect } from '@tests/fixtures';

export async function measureRequest(fn: () => Promise<APIResponse>) {
  const start = Date.now();
  const response = await fn();
  const elapsed = Date.now() - start;
  return { response, elapsed };
}

export async function createUserAndLogin(request: APIRequestContext) {
  const newUserPayload = buildUserPayload();
  const createResponse = await request.post('users', { data: newUserPayload });
  const createdUser = await createResponse.json();
  const loginResponse = await request.post('login', {
    data: { email: newUserPayload.email, password: newUserPayload.password },
  });
  const { access_token } = await loginResponse.json();
  return {
    createdUser,
    testAuthHeaders: {
      Authorization: `Bearer ${access_token}`,
      Cookie: `id=${createdUser.id}`,
    },
  };
}

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

export function assertMaskedFieldsForUser(
  user: { id: number; email: string; lastname: string; password: string },
  response: { status: () => number }
) {
  expect
    .soft({
      email: user.email,
      lastname: user.lastname,
      password: user.password,
    })
    .toEqual(maskedUser);
  expect(response.status()).toBe(200);
}

export function assertMaskedFieldsForUsers(
  users: { id: number; email: string; lastname: string; password: string }[],
  response: { status: () => number }
) {
  const user1 = users.find((u) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u) => u.id === expectedUsersData.user2.id);

  expect
    .soft([
      { email: user1!.email, lastname: user1!.lastname, password: user1!.password },
      { email: user2!.email, lastname: user2!.lastname, password: user2!.password },
    ])
    .toEqual([maskedUser, maskedUser]);
  expect(response.status()).toBe(200);
}
