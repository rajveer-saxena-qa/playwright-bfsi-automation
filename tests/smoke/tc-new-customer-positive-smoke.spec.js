import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';

const validCustomers = [
  {
    scenario: 'TC010 - Add new customer with Male gender',
    name: `TestMaleUser`,
    gender: 'm',
    dob: '1990-01-01',
    address: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '400001',
    mobile: '9876543210',
    email: '',
    password: 'Password@1',
  },
  {
    scenario: 'TC011 - Add new customer with Female gender',
    name: `TestFemaleUser`,
    gender: 'f',
    dob: '1990-02-13',
    address: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '400002',
    mobile: '9876543211',
    email: '',
    password: 'Password@1',
  },
];

test.describe('New Customer Module - Smoke', () => {
  validCustomers.forEach(({ scenario, name, gender, dob, address, city, state, pin, mobile, email, password }) => {
    test(`${scenario}`, async ({ page }) => {
      test.setTimeout(120000);
     //Login and navigate to New Customer page
      await login(page);
      await page.click('text=New Customer');
      //Fill Customer Name
      await page.fill('input[name="name"]', name);
      //Select Gender
      await page.locator(`input[name="rad1"][value="${gender}"]`).click();
      //Fill Date of Birth using evaluate to bypass calendar picker
      await page.evaluate((dobValue) => {
          const dobField = document.querySelector('input[name="dob"]');
          dobField.value = dobValue;
          dobField.dispatchEvent(new Event('change', { bubbles: true }));
          dobField.dispatchEvent(new Event('blur', { bubbles: true }));
          dobField.dispatchEvent(new Event('keyup', { bubbles: true }));
         }, dob);
      //Fill Address
      await page.fill('textarea[name="addr"]', address);
      //Fill City
      await page.fill('input[name="city"]', city);
      //Fill State
      await page.fill('input[name="state"]', state);
      //Fill PIN
      await page.fill('input[name="pinno"]', pin);
      //Fill Mobile Number
      await page.fill('input[name="telephoneno"]', mobile);
      //Generate unique email for each run
      const uniqueEmail = `t${Date.now().toString().slice(-5)}@xyz.moc`;
      await page.fill('input[name="emailid"]', uniqueEmail);
      //Fill Password
      await page.fill('input[name="password"]', password);
      //Click Submit button
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(3000);
      //Validate URL contains CustomerRegMsg
      await expect(page).toHaveURL(/CustomerRegMsg/);
      //Validate success message
      await expect(page.locator('body')).toContainText('Customer Registered Successfully!!!');
      //Save Customer ID only for TC010
       if (scenario.includes('TC010')) {
        const customerId = await page.locator('td:has-text("Customer ID") + td').textContent();
        const fs = await import('fs');
       //Read existing data
         let customerData = [];
         try {
         const existing = fs.readFileSync('testdata/customerData.json', 'utf8');
         customerData = JSON.parse(existing);
         } catch {
         customerData = [];
         }
       //Add new customer entry
         customerData.push({
         customerId: customerId.trim(),
         accountNumber: '',
         timestamp: new Date().toISOString()
         });
       //Keep only last 5 entries to manage file size
         if (customerData.length > 5) {
         customerData = customerData.slice(-5);
         }
        //Save updated array
         fs.writeFileSync('testdata/customerData.json', JSON.stringify(customerData, null, 2));
         console.log('Customer ID saved:', customerId.trim());
         }
    });
  });
});