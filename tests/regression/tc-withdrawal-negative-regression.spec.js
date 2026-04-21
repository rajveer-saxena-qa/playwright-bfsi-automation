import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';

test.describe('Withdrawal Module - Regression', () => {

  test('TC024 - Blank Special characters and Alphabets in Account Number and Amount', async ({ page }) => {
    test.setTimeout(120000);

    //Login and navigate to Withdrawal page
    await login(page);
    await page.getByRole('link', { name: 'Withdrawal' }).click({ force: true });

   //Test 1 - Blank fields - trigger blur to show inline errors
    await page.focus('input[name="accountno"]');
    await page.locator('input[name="accountno"]').blur();
    await page.focus('input[name="ammount"]');
    await page.locator('input[name="ammount"]').blur();
    await page.focus('input[name="desc"]');
    await page.locator('input[name="desc"]').blur();
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toContainText('Account Number must not be blank');
    await expect(page.locator('body')).toContainText('Amount field must not be blank');
    await expect(page.locator('body')).toContainText('Description can not be blank');
    
    //Test 2 - Special characters in Account Number and Amount
    await page.fill('input[name="accountno"]', '@#$%');
    await page.fill('input[name="ammount"]', '@#$%');
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Special characters are not allowed');

    //Test 3 - Alphabets in Account Number and Amount
    await page.fill('input[name="accountno"]', 'ABCDEF');
    await page.fill('input[name="ammount"]', 'ABCDEF');
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Characters are not allowed');

  });
});