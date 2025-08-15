class CheckoutPage {
    constructor() {
        this.urlStepOne = 'https://www.saucedemo.com/checkout-step-one.html';
        this.urlStepTwo = 'https://www.saucedemo.com/checkout-step-two.html';
        this.urlComplete = 'https://www.saucedemo.com/checkout-complete.html';
        this.elements = {
            secondaryHeader: '[data-test="secondary-header"]',
            errorMessage: '.error-message-container',
            itemQuantity: '[data-test="item-quantity"]',
            itemName: '[data-test="inventory-item-name"]',
            itemPrice: '[data-test="inventory-item-price"]',
            subtotalLabel: '[data-test="subtotal-label"]',
            taxLabel: '[data-test="tax-label"]',
            totalLabel: '[data-test="total-label"]',
            completeHeader: '[data-test="complete-header"]',
        };
    }

    validateStepOne() {
        cy.url().should('eq', this.urlStepOne);
        cy.get(this.elements.secondaryHeader).should('contain', 'Checkout: Your Information');
    }

    validateStepTwo() {
        cy.url().should('eq', this.urlStepTwo);
        cy.get(this.elements.secondaryHeader).should('contain', 'Checkout: Overview');
    }

    validateComplete() {
        cy.url().should('eq', this.urlComplete);
        cy.get(this.elements.secondaryHeader).should('contain', 'Checkout: Complete!');
        cy.get(this.elements.completeHeader).should('contain', 'Thank you for your order!');
    }

    fillCheckoutInformation(params) {
        cy.CheckouInformation(params);
    }

    submitCheckout() {
        cy.ButtonSubmit('Continue');
    }

    validateErrorMessage(message) {
        cy.get(this.elements.errorMessage).should('contain', message);
    }

    validateCheckoutSummary(description, price) {
        cy.get(this.elements.itemQuantity).should('have.text', '1');
        cy.get(this.elements.itemName).should('have.text', description);
        cy.get(this.elements.itemPrice).should('have.text', price);
        cy.get(this.elements.subtotalLabel).should('contain', `Item total: ${price}`);
        cy.get(this.elements.taxLabel).should('contain', 'Tax: $2.40');
        cy.get(this.elements.totalLabel).should('contain', 'Total: $32.39');
    }

    finishCheckout() {
        cy.Button('Finish');
    }

    backToHome() {
        cy.Button('Back Home');
    }
}

export default CheckoutPage;