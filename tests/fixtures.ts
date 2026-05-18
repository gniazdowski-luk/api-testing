import * as fs from 'node:fs';
import * as path from 'node:path';
import { test as base } from '@playwright/test';

const AUTH_FILE = path.join(__dirname, '../setup/authentication/.auth/user.json');

function readAuth(): { accessToken: string; userId: number } {
  return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
}

type Fixtures = {
  accessToken: string;
  userId: number;
  authHeaders: { Authorization: string; Cookie: string };
};

export const test = base.extend<Fixtures>({
  accessToken: async ({}, use) => {
    await use(readAuth().accessToken);
  },
  userId: async ({}, use) => {
    await use(readAuth().userId);
  },
  authHeaders: async ({ accessToken, userId }, use) => {
    await use({
      Authorization: `Bearer ${accessToken}`,
      Cookie: `id=${userId}`,
    });
  },
});

export { expect } from '@playwright/test';
