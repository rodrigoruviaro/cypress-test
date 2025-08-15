class CartPage {
    constructor() {
        this.url = 'https://www.saucedemo.com/cart.html';
        this.elements = {
            secondaryHeader: '[data-test="secondary-header"]',
            itemQuantity: '[data-test="item-quantity"]',
            itemName: '[data-test="inventory-item-name"]',
            itemPrice: '[data-test="inventory-item-price"]',
        };
    }

    validatePage() {
        cy.url().should('eq', this.url);
        cy.get(this.elements.secondaryHeader).should('contain', 'Your Cart');
    }

    validateCartItem(description, price) {
        cy.get(this.elements.itemQuantity).should('have.text', '1');
        cy.get(this.elements.itemName).should('have.text', description);
        cy.get(this.elements.itemPrice).should('have.text', price);
    }

    goToCheckout() {
        cy.Button('Checkout');
    }
}

export default CartPage;