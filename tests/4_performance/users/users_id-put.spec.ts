import { performanceData } from '@test-data/users/users.performance.data';
import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin, measureRequest } from '@tests/helpers';

test.describe('SLA', () => {
  test('PUT /users/{id} updating a user responds within SLA @performance-users_id-put-sla', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);

    const { response, elapsed } = await measureRequest(() =>
      request.put(`users/${createdUser.id}`, {
        headers: testAuthHeaders,
        data: buildUserPayload(),
      })
    );

    expect.soft(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(performanceData.slaMs.putById);
  });
});
