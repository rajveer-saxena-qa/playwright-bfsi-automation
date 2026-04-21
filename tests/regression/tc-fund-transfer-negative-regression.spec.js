import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';

test.describe('Fund Transfer Module - Regression', () => {

  test('TC026 - Blank Special characters and Alphabets in Fund Transfer fields', async ({ page }) => {
    test.setTimeout(120000);

    //Login and navigate to Fund Transfer page
    await login(page);
    //Validate Fund Transfer link visible in menu
    await expect(page.getByRole('link', { name: 'Fund Transfer' })).toBeVisible();

    //Navigate directly to bypass ad overlay
    await page.goto('https://demo.guru99.com/V4/manager/FundTransInput.php');
    await page.waitForSelector('input[name="payersaccount"]');

    //Test 1 - Blank fields - trigger blur to show inline errors
    await page.focus('input[name="payersaccount"]');
    await page.locator('input[name="payersaccount"]').blur();
    await page.focus('input[name="payeeaccount"]');
    await page.locator('input[name="payeeaccount"]').blur();
    await page.focus('input[name="ammount"]');
    await page.locator('input[name="ammount"]').blur();
    await page.focus('input[name="desc"]');
    await page.locator('input[name="desc"]').blur();
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toContainText('Payers Account Number must not be blank');
    await expect(page.locator('body')).toContainText('Payees Account Number must not be blank');
    await expect(page.locator('body')).toContainText('Amount field must not be blank');
    await expect(page.locator('body')).toContainText('Description can not be blank');

    //Test 2 - Special characters in fields
    await page.fill('input[name="payersaccount"]', '@#$%');
    await page.fill('input[name="payeeaccount"]', '@#$%');
    await page.fill('input[name="ammount"]', '@#$%');
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Special characters are not allowed');

    //Test 3 - Alphabets in fields
    await page.fill('input[name="payersaccount"]', 'ABCDEF');
    await page.fill('input[name="payeeaccount"]', 'ABCDEF');
    await page.fill('input[name="ammount"]', 'ABCDEF');
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Characters are not allowed');

  });
});