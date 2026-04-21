import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';
import { readFileSync } from 'fs';
//Read latest Customer ID from customerData.json for TC019
const customerData = JSON.parse(readFileSync('testdata/customerData.json', 'utf8'));
const latestCustomerId = customerData[customerData.length - 1].customerId;
const invalidAccountData = [
  {
    scenario: 'TC017 - Blank Customer ID and Blank Initial Deposit',
    customerId: '',
    accountType: 'Savings',
    deposit: '',
    expectedErrors: [
      'Customer ID is required',
      'Initial Deposit must not be blank'
    ]
  },
  {
    scenario: 'TC018 - Invalid Customer ID',
    customerId: '99999999',
    accountType: 'Savings',
    deposit: '5000',
    expectedErrors: ['Customer does not exist!!']
  },
  {
    scenario: 'TC019 - Below minimum deposit',
    customerId: latestCustomerId,
    accountType: 'Savings',
    deposit: '100',
    expectedErrors: ['Intial deposite must be Rs. 500 or more']
  },
  {
    scenario: 'TC020 - Special characters in Customer ID and Deposit',
    customerId: '@#$%',
    accountType: 'Savings',
    deposit: '@#$%',
    expectedErrors: ['Special characters are not allowed']
  },
 ];
test.describe('New Account Module - Regression', () => {
  invalidAccountData.forEach(({ scenario, customerId, accountType, deposit, expectedErrors }) => {
    test(`${scenario}`, async ({ page }) => {
      test.setTimeout(120000);
      //Login and navigate to New Account page
      await login(page);
      await page.click('text=New Account');
      //Fill Customer ID
      await page.fill('input[name="cusid"]', customerId);
      //Select Account Type
      await page.selectOption('select[name="selaccount"]', accountType);
      //Fill Initial Deposit
      await page.fill('input[name="inideposit"]', deposit);
      //Handle alert popup or inline error based on scenario
        if (scenario.includes('TC018') || scenario.includes('TC019')) {
      //Alert popup expected — use Promise.all
        const [dialog] = await Promise.all([
        page.waitForEvent('dialog'),
        page.getByRole('button', { name: 'submit' }).click(),
      ]);
      expect(dialog.message()).toContain(expectedErrors[0]);
      await dialog.accept();
      } else {
      //Inline error expected
      await page.getByRole('button', { name: 'submit' }).click();
      await page.waitForTimeout(2000);
      for (const error of expectedErrors) {
      await expect(page.locator('body')).toContainText(error);
      }
     }
    });
  });
});