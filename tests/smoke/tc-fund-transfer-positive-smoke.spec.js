import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';
import { readFileSync } from 'fs';

//Read account numbers from customerData.json
const customerData = JSON.parse(readFileSync('testdata/customerData.json', 'utf8'));

//Get all entries with account numbers
const entriesWithAccount = customerData.filter(c => c.accountNumber !== '');

//Pick last two entries as payer and payee
const payersAccount = entriesWithAccount[entriesWithAccount.length - 1].accountNumber;
const payeesAccount = entriesWithAccount[entriesWithAccount.length - 2].accountNumber;

test.describe('Fund Transfer Module - Smoke', () => {

  test('TC025 - Fund Transfer with valid Payer and Payee Account', async ({ page }) => {
    test.setTimeout(120000);

    //Login and navigate to Fund Transfer page
    await login(page);
    //Validate Fund Transfer link is visible in menu
    await expect(page.getByRole('link', { name: 'Fund Transfer' })).toBeVisible();

    //Navigate directly to bypass ad overlay
    await page.goto('https://demo.guru99.com/V4/manager/FundTransInput.php');
    //Wait for form field to be ready
    await page.waitForSelector('input[name="payersaccount"]');

    //Fill Payers Account Number
    await page.fill('input[name="payersaccount"]', payersAccount);

    //Fill Payees Account Number
    await page.fill('input[name="payeeaccount"]', payeesAccount);

    //Fill Amount
    await page.fill('input[name="ammount"]', '500');

    //Fill Description
    await page.fill('input[name="desc"]', 'Test Fund Transfer');

    //Click Submit
    await page.click('input[name="AccSubmit"]');
    await page.waitForTimeout(3000);

    //Validate success URL
    await expect(page).toHaveURL(/FundTrans/);

    //Validate success message
    await expect(page.locator('body')).toContainText('Fund Transfer Details');

  });
});
