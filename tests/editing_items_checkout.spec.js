const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const randomizer = require('../utils/randomizer');

const { InventoryPage } = require('../pages/inventoryPage');
const { ItemDetailsPage } = require('../pages/itemDetailsPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutStepOnePage } = require('../pages/checkoutStepOnePage');
const { CheckoutStepTwoPage } = require('../pages/checkoutStepTwoPage');
const { CheckoutCompletePage } = require('../pages/checkoutCompletePage');

test.describe('Checkout', () => {
  let desiredItemN1;
  let desiredItemN2;

  test.use({ storageState: 'logged_user.json' });

  test.beforeEach(async () => {
    desiredItemN1 = randomizer.getRandomItem();
    desiredItemN2 = randomizer.getRandomItem();
  });

  test('Editing items in the cart before checkout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemDetailsPage = new ItemDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await test.step('Go to the item details page', async () => {
      await inventoryPage.goto();
      await inventoryPage.openItemDetails(desiredItemN1.name);
    });
    await test.step('Verify item details', async () => {
      await itemDetailsPage.verifyItemDetails(desiredItemN1);
    });
    await test.step('Add item to the cart', async () => {
      await itemDetailsPage.addItemToTheCart();
      await expect.soft(itemDetailsPage.shoppingCartBadge).toHaveText('1');
    });
    await test.step('Verify the cart content', async () => {
      await inventoryPage.shoppingCartButton.click();
      await cartPage.verifyItems(desiredItemN1);
    });
    await test.step('Remove an item and then continue shopping', async () => {
      await cartPage.removeItem(desiredItemN1.name);
      await cartPage.continueShoppingButton.click();
    });
    await test.step('Add another item', async () => {
      await inventoryPage.addItemToTheCart(desiredItemN2.name);
    });
    await test.step('Verify the cart content', async () => {
      await inventoryPage.shoppingCartButton.click();
      await cartPage.verifyItems(desiredItemN2);
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
    await test.step('Verify the order', async () => {
      await checkoutStepTwoPage.verifyItems(desiredItemN2);
      await checkoutStepTwoPage.verifyPrice(desiredItemN2);
    });
    await test.step('Finish checkout', async () => {
      await checkoutStepTwoPage.finishButton.click();
      await checkoutCompletePage.verifyCheckoutIsComplete();
    });
  });
});
