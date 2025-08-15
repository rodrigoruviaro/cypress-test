class LoginPage {
    constructor() {
        this.url = 'https://www.saucedemo.com/';
        this.elements = {
            loginLogo: '.login_logo',
            usernameInput: '[data-test="username"]',
            passwordInput: '[data-test="password"]',
            errorMessage: '[data-test="error"]',
        };
    }

    visit() {
        cy.visit(this.url);
        cy.url().should('eq', this.url);
        cy.get(this.elements.loginLogo).should('have.text', 'Swag Labs');
    }

    login(username, password) {
        cy.Login(username, password);
        cy.ButtonSubmit('Login');
    }

    validateErrorMessage(message) {
        cy.get(this.elements.errorMessage).should('be.visible').should('contain', message);
    }
}

export default LoginPage;