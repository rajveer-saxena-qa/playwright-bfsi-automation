import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';

test.describe('Logout Module - Smoke', () => {

  test('TC027 - Logout navigates to login page', async ({ page }) => {
    test.setTimeout(120000);

//Login first
await login(page);

//Validate Logout link is visible in menu
await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();

//Register dialog handler first
page.on('dialog', async dialog => {
  expect(dialog.message()).toContain('You Have Succesfully Logged Out!!');
  await dialog.accept();
});

//Then navigate to logout
await page.goto('https://demo.guru99.com/V4/manager/Logout.php', 
  { waitUntil: 'domcontentloaded', timeout: 30000 });

await page.waitForTimeout(2000);

//Validate redirected to login page
await expect(page.locator('input[name="uid"]')).toBeVisible();
await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});