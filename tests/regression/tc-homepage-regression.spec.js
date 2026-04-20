import { test, expect } from '@playwright/test';
import { login } from '../../utils/loginHelper.js';
import { allMenuItems } from '../../utils/menuItems.js';
test.describe('Homepage Module - Regression', () => {
    test('TC009 - Validate All menu items on Manager Homepage', async ({ page }) => {
        await login(page);
//validate All left panel menu items
        for (const items of allMenuItems) {
        await expect(page.getByRole('link',{name: items})).toBeVisible();
        }
});
});