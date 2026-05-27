import type { APIRequestContext, APIResponse } from '@playwright/test';
import { buildUserPayload } from '@test-data/users/users.post.data';

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
