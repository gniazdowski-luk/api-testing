import { performanceData } from '@test-data/users/users.performance.data';
import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';
import { measureRequest } from '@tests/helpers';

test('POST /users creating a new user responds within SLA @performance-users-post-sla', async ({ request }) => {
  const { response, elapsed } = await measureRequest(() => request.post('users', { data: buildUserPayload() }));

  expect.soft(response.status()).toBe(201);
  expect(elapsed).toBeLessThan(performanceData.slaMs.postCreate);
});

test('POST /users duplicate email rejection responds within SLA @performance-users-post-sla', async ({ request }) => {
  const payload = buildUserPayload();
  await request.post('users', { data: payload });
  const { response, elapsed } = await measureRequest(() => request.post('users', { data: payload }));

  expect.soft(response.status()).toBe(409);
  expect(elapsed).toBeLessThan(performanceData.slaMs.postDuplicateRejection);
});
