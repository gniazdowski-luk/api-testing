import { expect, test } from '@tests/fixtures';

test('checks that the endpoint for retrieving users is accessible and returns a successful response @smoke', async ({
  request,
  accessToken,
}) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await response.json();

  expect.soft(body).toBeInstanceOf(Array);
  expect(response.status()).toBe(200);
});
