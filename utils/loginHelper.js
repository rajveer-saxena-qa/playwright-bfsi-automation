//Creating Utility Reusable login function to use in across all test files
//Accepts custom uid and pwd for negative and edge test scenarios
//Default values used for positive test scenarios from env file
export async function login(page, uid = process.env.GURU99_USERNAME, pwd = process.env.GURU99_PASSWORD) {
  //Navigate URL
  await page.goto('https://demo.guru99.com/V4/');
  //Enter User ID
  await page.fill('input[name="uid"]', uid);
  //Enter Password
  await page.fill('input[name="password"]', pwd);
  //Click Login Button
  await page.click('input[name="btnLogin"]');
  //await page.waitForLoadState('domcontentloaded');
}