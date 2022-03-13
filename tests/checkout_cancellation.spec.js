const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const randomizer = require('../utils/randomizer');

const { InventoryPage } = require('../pages/inventoryPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutStepOnePage } = require('../pages/checkoutStepOnePage');
const { CheckoutStepTwoPage } = require('../pages/checkoutStepTwoPage');

test.describe('Checkout', () => {
  let desiredItem;

  test.use({ storageState: 'logged_user.json' });

  test.beforeEach(async () => {
    desiredItem = randomizer.getRandomItem();
  });

  test('Cancellation of the checkout process', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await test.step('Add item to the cart', async () => {
      await inventoryPage.goto();
      await inventoryPage.addItemToTheCart(desiredItem.name);
      await expect.soft(inventoryPage.shoppingCartBadge).toHaveText('1');
    });
    await test.step('Go to the cart', async () => {
      await inventoryPage.shoppingCartButton.click();
    });
    await test.step('Proceed to checkout step-one', async () => {
      await cartPage.checkoutButton.click();
    });
    await test.step('Fill step-one checkout process', async () => {
      await checkoutStepOnePage.fillCheckoutCredentials(
        faker.name.firstName(),
        faker.name.lastName(),
        faker.address.zipCode(),
      );
    });
    await test.step('Proceed to checkout step-two', async () => {
      await checkoutStepOnePage.continueButton.click();
    });
    await test.step('Cancel checkout', async () => {
      await checkoutStepTwoPage.cancelButton.click();
      await expect.soft(page).toHaveURL(inventoryPage.URL);
    });
    await test.step('Remove an item from the cart', async () => {
      await inventoryPage.removeItemFromTheCart(desiredItem.name);
      await expect.soft(inventoryPage.shoppingCartBadge).not.toBeVisible();
    });
  });
});
