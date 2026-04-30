import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE = path.join(__dirname, '../setup/authentication/.auth/user.json');

type Fixtures = {
  accessToken: string;
};

export const test = base.extend<Fixtures>({
  accessToken: async ({}, use) => {
    const { accessToken } = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    await use(accessToken);
  },
});

export { expect } from '@playwright/test';
