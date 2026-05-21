import type { APIResponse } from '@playwright/test';

export async function measureRequest(fn: () => Promise<APIResponse>) {
  const start = Date.now();
  const response = await fn();
  const elapsed = Date.now() - start;
  return { response, elapsed };
}
