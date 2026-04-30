import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AUTH_FILE = path.join(__dirname, '.auth', 'user.json');

setup('authenticate', async ({ request }) => {
  const response = await request.post('login', {
    data: {
      email: process.env.AUTHENTICATION_EMAIL,
      password: process.env.AUTHENTICATION_PASSWORD,
    },
  });

  await expect(response).toBeOK();

  const { access_token } = await response.json();
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ accessToken: access_token }));
});
