/// <reference types="cypress" />

import { faker } from '@faker-js/faker';


describe('Validar Acesso a URL', () => {

  let Url = 'https://www.saucedemo.com/';

  beforeEach(() => {
    cy.visit(Url)

    cy.url().should('eq', Url);
    cy.get('.login_logo').should('have.text', 'Swag Labs');
  });


  it(`Acessar a página de login, validar se acessou a URL correta, digitar login correto e senha incorreta, clicar em Login, deve validar o status code como 503 e apresentar mensagem na tela de falha no login`, () => {
    // Preencher Senha inválida
    cy.Login('standard_user', 'senha@123');
    // Clicar no botão Login
    cy.intercept('POST', 'json').as('InterceptLogin');
    cy.ButtonSubmit('Login');
    cy.wait('@InterceptLogin', { timeout: 30000 }).its('response.statusCode').should('eq', 503);
    // Validar Retorno de Username ou Senha incorreto
    cy.get('[data-test="error"]')
      .should('be.visible')
      .should('contain', 'Epic sadface: Username and password do not match any user in this service');
    // Validar se não teve alteração de URL
    cy.url().should('eq', Url);
  });


  it(`Acessar a página  e efetuar um login válido, validar se os elementos de menu e lista de produtos estão visiveis`, () => {
    // Preehcer login e senha correto e logar no sistema
    cy.Login('standard_user', 'secret_sauce');
    cy.ButtonSubmit('Login');
    // Validar se acessou a URL correta após logar no sistema
    cy.url().should('eq', `${Url}inventory.html`);
    // Validar se apresenta elementos na tela após o login com sucesso
    cy.get('.header_label').should('be.visible');
    cy.get('#react-burger-menu-btn').should('be.visible');
    cy.get('[data-test="inventory-container"]').should('be.visible');
  });


  it(`Acessar a página, efetuar login, inserir 1 produto no carrinho, tentar finalizar a venda sem preencher os dados, irá retornar falha, preencher os dados obrigatórios até permitir avançar para a proxima tela`, () => {
    // Preehcer login e senha correto e logar no sistema
    cy.Login('standard_user', 'secret_sauce');
    cy.ButtonSubmit('Login');
    // Validar se acessou a URL correta após logar no sistema
    cy.url().should('eq', `${Url}inventory.html`);
    // Validar que não existem produtos no carrinho
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
    // Adicionar um item ao carrinho e verificar se o botão foi alterado para remover o item do carrinho
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
    // Verificar se está apresentando que há 1 item no carrinho
    cy.get('[data-test="shopping-cart-badge"]').should('be.visible').should('contain', '1');
    // Clicar sobre o item do carrinho, conferir se a URL foi redirecionada para a URL correta 
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should('eq', `${Url}cart.html`);
    cy.get('[data-test="secondary-header"]').should('contain', 'Your Cart');
    // Clicar no botão Checkout, verificar se foi redirecionado e conferir o texto na tela
    cy.Button('Checkout');
    cy.url().should('eq', `${Url}checkout-step-one.html`);
    cy.get('[data-test="secondary-header"]').should('contain', 'Checkout: Your Information');
    // Clicar em Continue sem preencher nenhum dado, deve retornar falha
    cy.ButtonSubmit('Continue');
    cy.get('.error-message-container').should('contain', 'Error: First Name is required');
    // Preencher o primeiro nome
    cy.CheckouInformation({
      firstName: faker.person.firstName(),
    });
    // Clicar em Continue e verificar que é necessário preencher o último nome
    cy.ButtonSubmit('Continue');
    cy.get('.error-message-container').should('contain', 'Error: Last Name is required');
    // Preencher o último nome
    cy.CheckouInformation({
      lastName: faker.person.lastName(),
    });
    // Conferir que é necessário preencher o código postal
    cy.ButtonSubmit('Continue');
    cy.get('.error-message-container').should('contain', 'Error: Postal Code is required');
    // Preencher o código postal 
    cy.CheckouInformation({
      postalCode: faker.location.zipCode(),
    });
    // Clicar em Continue verificar se foi redicionado para a página correta e se o texto da página está correto
    cy.ButtonSubmit('Continue');
    cy.url().should('eq', `${Url}checkout-step-two.html`);
    cy.get('[data-test="secondary-header"]').should('contain', 'Checkout: Overview');
  });


  it(`Acessar a página, efetuar login, inserir 1 produto no carrinho, preencher os dados da compra e finalizar a mesma`, () => {
    // Preehcer login e senha correto e logar no sistema
    cy.Login('standard_user', 'secret_sauce');
    cy.ButtonSubmit('Login');
    // Validar se acessou a URL correta após logar no sistema
    cy.url().should('eq', `${Url}inventory.html`);
    // Validar que não existem produtos no carrinho
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
    // Encontrar e Armazenar a descrição e o preço do produto
    cy.get('[data-test="item-4-title-link"] > [data-test="inventory-item-name"]').invoke('text').then((descricao) => {
      cy.get(':nth-child(1) > [data-test="inventory-item-description"] > .pricebar > [data-test="inventory-item-price"]').invoke('text').then((preco) => {
        const descricaoProduto = descricao;
        const precoProduto = preco;
        // Adicionar um item ao carrinho e verificar se o botão foi alterado para remover o item do carrinho
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
        // Verificar se está apresentando que há 1 item no carrinho
        cy.get('[data-test="shopping-cart-badge"]').should('be.visible').should('contain', '1');
        // Clicar sobre o item do carrinho, conferir se a URL foi redirecionada para a URL correta 
        cy.get('[data-test="shopping-cart-link"]').click();
        cy.url().should('eq', `${Url}cart.html`);
        cy.get('[data-test="secondary-header"]').should('contain', 'Your Cart');
        // Validar Se existe uma quantidade no carrinho e a desgrição e o preço do produto estão corretos
        cy.get('[data-test="item-quantity"]').should('have.text', '1');
        cy.get('[data-test="inventory-item-name"]').should('have.text', descricaoProduto);
        cy.get('[data-test="inventory-item-price"]').should('have.text', precoProduto);
        // Clicar no botão Checkout verificar se foi redirecionado para a página correta
        cy.Button('Checkout');
        cy.url().should('eq', `${Url}checkout-step-one.html`);
        cy.get('[data-test="secondary-header"]').should('contain', 'Checkout: Your Information');
        // Preencher os dados do comprador
        cy.CheckouInformation({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          postalCode: faker.location.zipCode(),
        });
        // Clicar em Continue, validar se foi direcionado para a pagína correta 
        cy.ButtonSubmit('Continue');
        cy.url().should('eq', `${Url}checkout-step-two.html`);
        cy.get('[data-test="secondary-header"]').should('contain', 'Checkout: Overview');
        // Conferir se os dados do produto estão corretos na tela de finalização
        cy.get('[data-test="item-quantity"]').should('have.text', '1');
        cy.get('[data-test="inventory-item-name"]').should('have.text', descricaoProduto);
        cy.get('[data-test="inventory-item-price"]').should('have.text', precoProduto);
        cy.get('[data-test="subtotal-label"]').should('contain', `Item total: ${precoProduto}`);
        cy.get('[data-test="tax-label"]').should('contain', 'Tax: $2.40');
        cy.get('[data-test="total-label"]').should('contain', 'Total: $32.39');
      });
    });
    // Clicar em Finish e validar se foi direcionado para a tela correta
    cy.Button('Finish');
    cy.url().should('eq', `${Url}checkout-complete.html`);
    cy.get('[data-test="secondary-header"]').should('contain', 'Checkout: Complete!');
    cy.get('[data-test="complete-header"]').should('contain', 'Thank you for your order!');
    // Clicar em Back Home e validar se retornou para a página inicial
    cy.Button('Back Home');
    cy.url().should('eq', `${Url}inventory.html`);
    // Validar se apresenta elementos na tela após retornar para a página incial
    cy.get('.header_label').should('be.visible');
    cy.get('#react-burger-menu-btn').should('be.visible');
    cy.get('[data-test="inventory-container"]').should('be.visible');
  });
});