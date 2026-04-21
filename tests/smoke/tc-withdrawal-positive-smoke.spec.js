import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';
import { readFileSync } from 'fs';

const customerData = JSON.parse(readFileSync('testdata/customerData.json', 'utf8'));
//Get last entry that has an account number in Data .json
const latestWithAccount = [...customerData].reverse().find(c => c.accountNumber !== '');
const accountNumber = latestWithAccount.accountNumber;
test.describe('Withdrawal Module - Smoke', () => {

  test('TC023 - Withdrawal with valid Account Number and Amount', async ({ page }) => {
    test.setTimeout(120000);

    //Login and navigate to Withdrawal page
    await login(page);
    //Due to ad on website using force: true it still clicks the actual link and ignores the overlay.
    await page.getByRole('link', { name: 'Withdrawal' }).click({ force: true });

    //Fill Account Number from customerData.json
    await page.fill('input[name="accountno"]', accountNumber);

    //Fill Amount
    await page.fill('input[name="ammount"]', '1000');

    //Fill Description
    await page.fill('input[name="desc"]', 'Test Withdrawal');

    //Click Submit
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(3000);

    //Validate success URL
    await expect(page).toHaveURL(/Withdrawal/);

    //Validate success message
    await expect(page.locator('body')).toContainText('Transaction details of Withdrawal');

  });
});