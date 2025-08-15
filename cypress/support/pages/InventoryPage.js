class InventoryPage {
    constructor() {
        this.url = 'https://www.saucedemo.com/inventory.html';
        this.elements = {
            headerLabel: '.header_label',
            menuButton: '#react-burger-menu-btn',
            inventoryContainer: '[data-test="inventory-container"]',
            cartBadge: '[data-test="shopping-cart-badge"]',
            addToCartBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
            removeBackpack: '[data-test="remove-sauce-labs-backpack"]',
            cartLink: '[data-test="shopping-cart-link"]',
            itemName: '[data-test="item-4-title-link"] > [data-test="inventory-item-name"]',
            itemPrice: ':nth-child(1) > [data-test="inventory-item-description"] > .pricebar > [data-test="inventory-item-price"]',
        };
    }

    validatePage() {
        cy.url().should('eq', this.url);
        cy.get(this.elements.headerLabel).should('be.visible');
        cy.get(this.elements.menuButton).should('be.visible');
        cy.get(this.elements.inventoryContainer).should('be.visible');
    }

    addBackpackToCart() {
        cy.get(this.elements.addToCartBackpack).click();
        cy.get(this.elements.removeBackpack).should('be.visible');
        cy.get(this.elements.cartBadge).should('be.visible').should('contain', '1');
    }

    goToCart() {
        cy.get(this.elements.cartLink).click();
    }

    getProductDetails() {
        return cy.get(this.elements.itemName).invoke('text').then((description) => {
            return cy.get(this.elements.itemPrice).invoke('text').then((price) => {
                return { description, price };
            });
        });
    }
}

export default InventoryPage;