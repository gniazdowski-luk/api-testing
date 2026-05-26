import { expect, test as teardown } from '@playwright/test';

teardown('restore database', async ({ request }) => {
  const response = await request.get('restoreDB');
  await expect(response).toBeOK();
});
