import {test, expect} from '@playwright/test';
//Create Smoke Test suite
test.describe('Login Module-Smoke',()=>{
  //Create Test case for valid login credentials
      test('TC001-Login with Valid Credentials',async({page})=>{
       //Navigate to URL     
         await page.goto('https://demo.guru99.com/V4/');
       //Enter Login Details User Id
         await page.fill('input[name="uid"]', process.env.GURU99_USERNAME);
       //Enter Login Details Password
         await page.fill('input[name="password"]', process.env.GURU99_PASSWORD);
       //Click on LOGIN Button  
         await page.click('input[name="btnLogin"]');
       //Validate page URL have "Specific Text"
         await expect(page).toHaveURL(/demo.guru99.com/);
       //Validate Welcome message  
         await expect(page.locator('body')).toContainText(`Manger Id : ${process.env.GURU99_USERNAME}`);
       //Validate page have "Specific Title"
        await expect(page).toHaveTitle(/Guru99 Bank Manager HomePage/);
      });
});