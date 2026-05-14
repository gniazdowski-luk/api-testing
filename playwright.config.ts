import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000/api/',
  },
  projects: [
    {
      name: 'setup-authentication',
      testDir: './setup/authentication',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'tests-smoke',
      testDir: './tests/smoke',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-contract',
      testDir: './tests/contract',
      dependencies: ['setup-authentication']
    },
    {
      name: 'tests-functional',
      testDir: './tests/functional',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-security',
      testDir: './tests/security',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-performance',
      testDir: './tests/performance',
      dependencies: ['setup-authentication'],
    },
  ],
});
