import { performanceData } from '@test-data/users/users.performance.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin, measureRequest } from '@tests/helpers';

test.describe('SLA', () => {
  test('DELETE /users/{id} deleting a user responds within SLA @performance-users_id-delete-sla', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const { response, elapsed } = await measureRequest(() =>
      request.delete(`users/${createdUser.id}`, {
        headers: testAuthHeaders,
      })
    );

    expect.soft(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(performanceData.slaMs.deleteById);
  });

  test('DELETE /users/{id} deleting a non-existent user responds within SLA @performance-users_id-delete-sla', async ({
    request,
    authHeaders,
  }) => {
    const { response, elapsed } = await measureRequest(() =>
      request.delete(`users/${byIdData.nonExistentId}`, {
        headers: authHeaders,
      })
    );

    expect.soft(response.status()).toBe(404);
    expect(elapsed).toBeLessThan(performanceData.slaMs.deleteByIdNotFound);
  });
});
