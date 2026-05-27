import { buildUserPayload } from '@test-data/users/users.post.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test.describe('Authorization', () => {
  test('PUT /users/{id} unauthenticated access returns error @security-users_id-put-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      data: buildUserPayload(),
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} empty Bearer token returns error @security-users_id-put-authorization', async ({ request }) => {
    const { createdUser } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.emptyBearerToken },
      data: buildUserPayload(),
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} invalid Bearer token returns error @security-users_id-put-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.wrongBearerToken },
      data: buildUserPayload(),
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} wrong Basic auth returns error @security-users_id-put-authorization', async ({ request }) => {
    const { createdUser } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
      data: buildUserPayload(),
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('PUT /users/{id} valid token without Cookie returns error @security-users_id-put-authorization', async ({
    request,
    accessToken,
  }) => {
    const { createdUser } = await createUserAndLogin(request);

    const response = await request.put(`users/${createdUser.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: buildUserPayload(),
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
    expect(response.status()).toBe(401);
  });
});
