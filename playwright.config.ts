import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURLs: Record<string, string> = {
  qa: 'http://localhost:3000/api/',
  staging: 'https://staging.gad/api/',
};

const environment = (process.env.TEST_ENV ?? 'qa').toLowerCase();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: baseURLs[environment] ?? baseURLs.qa,
  },
  projects: [
    {
      name: 'setup-authentication',
      testDir: './setup/authentication',
      testMatch: /.*\.setup\.ts/,
      ...(process.env.CI ? {} : { teardown: 'teardown-restore-db' }),
    },
    {
      name: 'tests-smoke',
      testDir: './tests/0_smoke',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-contract',
      testDir: './tests/1_contract',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-functional',
      testDir: './tests/2_functional',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-security',
      testDir: './tests/3_security',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-performance',
      testDir: './tests/4_performance',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'teardown-restore-db',
      testDir: './setup/restore-db',
      testMatch: /.*\.teardown\.ts/,
    },
  ],
  reporter: 'html',
});
