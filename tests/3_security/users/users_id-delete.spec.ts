import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin } from '@tests/helpers';

test.describe('Authorization', () => {
  test('DELETE /users/{id} unauthenticated access returns error @security-users_id-delete-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`);
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('DELETE /users/{id} empty Bearer token returns error @security-users_id-delete-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('DELETE /users/{id} invalid Bearer token returns error @security-users_id-delete-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('DELETE /users/{id} wrong Basic auth returns error @security-users_id-delete-authorization', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
    expect(response.status()).toBe(401);
  });

  test('DELETE /users/{id} valid token without Cookie returns error @security-users_id-delete-authorization', async ({
    request,
    accessToken,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const errorResponse = await response.json();

    expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
    expect(response.status()).toBe(401);
  });
});

test.describe('Expired Token', () => {
  test('DELETE /users/{id} expired token returns error @security-users_id-delete-expired_token', async ({
    request,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { Authorization: securityUsersData.expiredToken },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('CORS Headers', () => {
  test('DELETE /users/{id} access control allow origin header is included @security-users_id-delete-cors', async ({
    request,
    baseURL,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const origin = new URL(baseURL!).origin;
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: { ...testAuthHeaders, Origin: origin },
    });

    expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
    expect(response.status()).toBe(200);
  });

  test('OPTIONS /users/{id} preflight request for DELETE returns CORS headers @security-users_id-delete-cors', async ({
    request,
    baseURL,
  }) => {
    const { createdUser } = await createUserAndLogin(request);
    const response = await request.fetch(`users/${createdUser.id}`, {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'DELETE',
        'Access-Control-Request-Headers': 'Authorization',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toContain('DELETE');
    expect.soft(response.headers()['access-control-allow-headers']).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});

test.describe('Security Response Headers', () => {
  test('DELETE /users/{id} response includes X-Content-Type-Options header @security-users_id-delete-headers', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect.soft(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.status()).toBe(200);
  });

  test('DELETE /users/{id} response includes X-Frame-Options header @security-users_id-delete-headers', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect.soft(response.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.status()).toBe(200);
  });

  test('DELETE /users/{id} response includes Content-Security-Policy header @security-users_id-delete-headers', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const response = await request.delete(`users/${createdUser.id}`, {
      headers: testAuthHeaders,
    });

    expect.soft(response.headers()['content-security-policy']).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
