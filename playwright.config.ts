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
      testDir: './tests/0_smoke',
      dependencies: ['setup-authentication'],
    },
    {
      name: 'tests-contract',
      testDir: './tests/1_contract',
      dependencies: ['setup-authentication']
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
  ],
  reporter: 'html',
});
