import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';
//Read latest Customer ID from customerData.json
import { readFileSync } from 'fs';
const customerData = JSON.parse(readFileSync('testdata/customerData.json', 'utf8'));
const latestCustomer = customerData[customerData.length - 1];
const customerId = latestCustomer.customerId;

test.describe('New Account Module - Smoke', () => {
test('TC012 - Create Savings account with valid Customer ID', async ({ page }) => {
    test.setTimeout(120000);
    //Login and navigate to New Account page
    await login(page);
    await page.click('text=New Account');
    //Fill Customer ID from customerData.json
    await page.fill('input[name="cusid"]', customerId);
    //Select Account Type - Savings
    await page.selectOption('select[name="selaccount"]', 'Savings');
    //Fill Initial Deposit
    await page.fill('input[name="inideposit"]', '1000');
    //Click Submit
    await page.getByRole('button', { name: 'submit' }).click();
    await page.waitForTimeout(3000);
    //Validate success message
    await expect(page.locator('body')).toContainText('Account Generated Successfully!!!');
    //Validate URL contains AccCreateMsg
    await expect(page).toHaveURL(/AccCreateMsg/);
    //Capture Account ID from URL and save to customerData.json
    const successUrl = page.url();
    const accountId = successUrl.split('aid=')[1];
    console.log('Created Account ID:', accountId);
    //Update customerData.json with Account ID
    const fs = await import('fs');
    const data = JSON.parse(fs.readFileSync('testdata/customerData.json', 'utf8'));
    data[data.length - 1].accountNumber = accountId;
    fs.writeFileSync('testdata/customerData.json', JSON.stringify(data, null, 2));
    console.log('Account ID saved:', accountId);
  });
  test('TC013 - Create Current account with valid Customer ID', async ({ page }) => {
    test.setTimeout(120000);
    //Login and navigate to New Account page
    await login(page);
    await page.click('text=New Account');
    //Fill Customer ID from customerData.json
    await page.fill('input[name="cusid"]', customerId);
    //Select Account Type - Current
    await page.selectOption('select[name="selaccount"]', 'Current');
    //Fill Initial Deposit
    await page.fill('input[name="inideposit"]', '5000');
    //Click Submit
    await page.getByRole('button', { name: 'submit' }).click();
    await page.waitForTimeout(3000);
    //Validate success message
    await expect(page.locator('body')).toContainText('Account Generated Successfully!!!');
    //Validate URL contains AccCreateMsg
    await expect(page).toHaveURL(/AccCreateMsg/);
  });
});    
