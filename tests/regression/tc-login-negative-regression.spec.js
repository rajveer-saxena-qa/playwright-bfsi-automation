const { test, expect } = require('@playwright/test');
require('dotenv').config();
const invalidCredentials = [
  { uid: 'invalid123', pwd: 'invalid123', scenario: 'TC002 - Invalid UserID and Invalid Password' },
  { uid: process.env.GURU99_USERNAME, pwd: 'wrongpass', scenario: 'TC003 - Valid UserID and Invalid Password' },
  { uid: 'invaliduser', pwd: process.env.GURU99_PASSWORD, scenario: 'TC004 - Invalid UserID and Valid Password' },
];
test.describe('Login Module - Regression', () => {
  invalidCredentials.forEach(({ uid, pwd, scenario }) => {
    test(`${scenario}`, async ({ page }) => {
      await page.goto('https://demo.guru99.com/V4/');
      await page.fill('input[name="uid"]', uid);
      await page.fill('input[name="password"]', pwd);
      await page.click('input[name="btnLogin"]');
      await expect(page.locator('body')).toContainText('User or Password is not valid');
});
  });
});