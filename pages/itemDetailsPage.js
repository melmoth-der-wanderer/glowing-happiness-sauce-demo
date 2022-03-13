const { expect } = require('@playwright/test');

exports.ItemDetailsPage = class ItemDetailsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.itemName = page.locator('.inventory_details_name');
    this.itemPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('//*[contains (@id, "add-to-cart")]');
    this.removeButton = page.locator('//*[contains (@id, "remove")]');
    this.shoppingCartButton = page.locator('.shopping_cart_container');
    this.shoppingCartBadge = page.locator('.shopping_cart_container .shopping_cart_badge');
  }

  async verifyItemDetails(item) {
    const regex = new RegExp(`id=${item.id}`, 'g');
    await expect.soft(this.page).toHaveURL(regex);
    await expect.soft(this.itemName).toHaveText(item.name);
    await expect.soft(this.itemPrice).toHaveText(`$${item.price}`);
  }

  async addItemToTheCart() {
    await this.addToCartButton.click();
    await expect.soft(this.removeButton).toBeVisible();
  }
};
