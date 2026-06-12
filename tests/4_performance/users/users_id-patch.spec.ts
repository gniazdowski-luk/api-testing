import { performanceData } from '@test-data/users/users.performance.data';
import { buildUserPayload, postEmptyFieldData } from '@test-data/users/users.post.data';
import { byIdData } from '@test-data/users/users_id.data';
import { expect, test } from '@tests/fixtures';
import { createUserAndLogin, measureRequest } from '@tests/helpers';

test.describe('SLA', () => {
  test('PATCH /users/{id} partial update responds within SLA @performance-users_id-patch-sla', async ({ request }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const { response, elapsed } = await measureRequest(() =>
      request.patch(`users/${createdUser.id}`, {
        headers: testAuthHeaders,
        data: { firstname: buildUserPayload().firstname },
      })
    );

    expect.soft(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(performanceData.slaMs.patchById);
  });

  test('PATCH /users/{id} updating a non-existent user responds within SLA @performance-users_id-patch-sla', async ({
    request,
    authHeaders,
  }) => {
    const { response, elapsed } = await measureRequest(() =>
      request.patch(`users/${byIdData.nonExistentId}`, {
        headers: authHeaders,
        data: { firstname: buildUserPayload().firstname },
      })
    );

    expect.soft(response.status()).toBe(401);
    expect(elapsed).toBeLessThan(performanceData.slaMs.patchByIdNotFound);
  });

  test('PATCH /users/{id} invalid payload rejection responds within SLA @performance-users_id-patch-sla', async ({
    request,
  }) => {
    const { createdUser, testAuthHeaders } = await createUserAndLogin(request);
    const { response, elapsed } = await measureRequest(() =>
      request.patch(`users/${createdUser.id}`, {
        headers: testAuthHeaders,
        data: postEmptyFieldData.emptyFirstname,
      })
    );

    expect.soft(response.status()).toBe(422);
    expect(elapsed).toBeLessThan(performanceData.slaMs.patchByIdInvalidPayload);
  });
});

test.describe('Concurrent', () => {
  test('PATCH /users/{id} concurrent requests respond within SLA @performance-users_id-patch-concurrent', async ({
    request,
  }) => {
    const { concurrentRequests } = performanceData;
    const users = await Promise.all(Array.from({ length: concurrentRequests }, () => createUserAndLogin(request)));
    const results = await Promise.all(
      users.map(async ({ createdUser, testAuthHeaders }) => {
        const { response, elapsed } = await measureRequest(() =>
          request.patch(`users/${createdUser.id}`, {
            headers: testAuthHeaders,
            data: { firstname: buildUserPayload().firstname },
          })
        );
        return { response, elapsed };
      })
    );
    const statuses = results.map(({ response }) => response.status());
    const maxElapsed = Math.max(...results.map(({ elapsed }) => elapsed));

    expect.soft(statuses).toEqual(Array(concurrentRequests).fill(200));
    expect(maxElapsed).toBeLessThan(performanceData.slaMs.patchByIdConcurrent);
  });
});
