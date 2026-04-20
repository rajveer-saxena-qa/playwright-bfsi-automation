const {test, expect} = require ('@playwright/test');
//Create Smoke Test suite
test.describe('Login Module-Smoke',()=>{
  //Create Test case for valid login credentials
      test('TC001-Login with Valid Credentials',async({page})=>{
       //Naviaget to URL     
         await page.goto('https://demo.guru99.com/V4/');
       //Enter Login Details User Id
         await page.fill('input[name="uid"]', 'mngr659300');
       //Enter LOgin Details Password
         await page.fill('input[name="password"]', 'havusev');
       //Click on LOGIN Button  
         await page.click('input[name="btnLogin"]');
       //Validate page URL have "Specific Text"
         await expect(page).toHaveURL(/Managerhomepage/);
       //Validate Welcome message  
         await expect(page.locator('marquee')).toContainText('Welcome To Manager');
       //Validate page have "Specific Title"
       console.log(await page.title());
    console.log(page.url());
         await expect(page).toHaveTitle(/Guru99 Bank Manager HomePage/);
      });
});