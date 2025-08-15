/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

import LoginPage from '../../support/pages/LoginPage';
import InventoryPage from '../../support/pages/InventoryPage';
import CartPage from '../../support/pages/CartPage';
import CheckoutPage from '../../support/pages/CheckoutPage';


describe('Validar Acesso a URL', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    loginPage.visit();
  });


  it(`Acessar a página de login, validar se acessou a URL correta, digitar login correto e senha incorreta, clicar em Login, deve validar o status code como 503 e apresentar mensagem na tela de falha no login`, () => {
    cy.intercept('POST', 'json').as('InterceptLogin');
    loginPage.login('standard_user', 'senha@123');
    cy.wait('@InterceptLogin', { timeout: 30000 }).its('response.statusCode').should('eq', 503);
    loginPage.validateErrorMessage('Epic sadface: Username and password do not match any user in this service');
    cy.url().should('eq', loginPage.url);
  });


  it(`Acessar a página  e efetuar um login válido, validar se os elementos de menu e lista de produtos estão visiveis`, () => {
    loginPage.login('standard_user', 'secret_sauce');
    inventoryPage.validatePage();
  });


  it(`Acessar a página, efetuar login, inserir 1 produto no carrinho, tentar finalizar a venda sem preencher os dados, irá retornar falha, preencher os dados obrigatórios até permitir avançar para a proxima tela`, () => {
    loginPage.login('standard_user', 'secret_sauce');
    inventoryPage.validatePage();
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
    inventoryPage.addBackpackToCart();
    inventoryPage.goToCart();
    cartPage.validatePage();
    cartPage.goToCheckout();
    checkoutPage.validateStepOne();
    checkoutPage.submitCheckout();
    checkoutPage.validateErrorMessage('Error: First Name is required');
    checkoutPage.fillCheckoutInformation({ firstName: faker.person.firstName() });
    checkoutPage.submitCheckout();
    checkoutPage.validateErrorMessage('Error: Last Name is required');
    checkoutPage.fillCheckoutInformation({ lastName: faker.person.lastName() });
    checkoutPage.submitCheckout();
    checkoutPage.validateErrorMessage('Error: Postal Code is required');
    checkoutPage.fillCheckoutInformation({ postalCode: faker.location.zipCode() });
    checkoutPage.submitCheckout();
    checkoutPage.validateStepTwo();
  });


  it(`Acessar a página, efetuar login, inserir 1 produto no carrinho, preencher os dados da compra e finalizar a mesma`, () => {
    loginPage.login('standard_user', 'secret_sauce');
    inventoryPage.validatePage();
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
    inventoryPage.getProductDetails().then(({ description, price }) => {
      inventoryPage.addBackpackToCart();
      inventoryPage.goToCart();
      cartPage.validatePage();
      cartPage.validateCartItem(description, price);
      cartPage.goToCheckout();
      checkoutPage.validateStepOne();
      checkoutPage.fillCheckoutInformation({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode(),
      });
      checkoutPage.submitCheckout();
      checkoutPage.validateStepTwo();
      checkoutPage.validateCheckoutSummary(description, price);
      checkoutPage.finishCheckout();
      checkoutPage.validateComplete();
      checkoutPage.backToHome();
      inventoryPage.validatePage();
    });
  });
});