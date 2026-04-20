const { test, expect } = require('@playwright/test');

const invalidCredentials = [
  { uid: 'invalid123', pwd: 'invalid123', scenario: 'TC002 - Invalid UserID and Invalid Password' },
  { uid: 'validUID', pwd: 'wrongpass', scenario: 'TC003 - Valid UserID and Invalid Password' },
  { uid: 'invaliduser', pwd: 'validPWD', scenario: 'TC004 - Invalid UserID and Valid Password' },
];