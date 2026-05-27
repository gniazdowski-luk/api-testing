import { expect, test } from '@tests/fixtures';

test('TRACE /users unsupported method returns error @security-users-trace-methods', async ({
  request,
}) => {
  const response = await request.fetch('users', { method: 'TRACE' });

  expect(response.status()).toBe(401);
});
