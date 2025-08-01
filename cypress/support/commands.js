/// <reference types="cypress" />


Cypress.Commands.add('Login', (username, password) => {
    cy.get('[data-test="username"]').clear().type(username, { log: false });
    cy.get('[data-test="password"]').clear().type(password, { log: false });
});


Cypress.Commands.add('ButtonSubmit', (button) => {
    cy.get(`input[type="submit"][value="${button}"]`).click();
});


Cypress.Commands.add('Button', (button) => {
    cy.contains('button', button).click();
});


Cypress.Commands.add('CheckouInformation', (params) => {
    const {
        firstName,
        lastName,
        postalCode,
    } = params

    if (firstName) {
        cy.get('[data-test="firstName"]').clear().type(firstName)
            .invoke('val').should('contain', firstName);
    }

    if (lastName) {
        cy.get('[data-test="lastName"]').clear().type(lastName)
            .invoke('val').should('contain', lastName);
    }

    if (postalCode) {
        cy.get('[data-test="postalCode"]').clear().type(postalCode)
            .invoke('val').should('contain', postalCode);
    }
});