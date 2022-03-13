const { test, expect } = require('@playwright/test');

const { InventoryPage } = require('../pages/inventoryPage');

test.describe('Sorting', () => {
  test.use({ storageState: 'logged_user.json' });

  test('Inventory sorting', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await test.step('Select name (A-Z) sortingg', async () => {
      await inventoryPage.goto();
      await inventoryPage.sortingSelect.selectOption('az');
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(['A-Z', 'az.png']);
    });
    await test.step('Select name (Z-A) sorting', async () => {
      await inventoryPage.sortingSelect.selectOption('za');
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(['Z-A', 'za.png']);
    });
    await test.step('Select price (low to high) sorting', async () => {
      await inventoryPage.sortingSelect.selectOption('lohi');
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(['Low-High', 'lohi.png']);
    });
    await test.step('Select price (high to low) sorting', async () => {
      await inventoryPage.sortingSelect.selectOption('hilo');
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(['High-Low', 'hilo.png']);
    });
  });
});
