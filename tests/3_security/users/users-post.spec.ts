import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';

test.describe('CORS Headers', () => {
  test('POST /users access control allow origin header is included @security-users-post-cors', async ({
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const response = await request.post('users', {
      headers: { Origin: origin },
      data: buildUserPayload(),
    });

    expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
    expect(response.status()).toBe(201);
  });

  test('OPTIONS /users preflight request for POST returns CORS headers @security-users-post-cors', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch('users', {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toContain('POST');
    expect.soft(response.headers()['access-control-allow-headers']).toContain('Content-Type');
    expect(response.status()).toBe(204);
  });
});
