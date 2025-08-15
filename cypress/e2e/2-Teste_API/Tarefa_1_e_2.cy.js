/// <reference types="cypress" />

import { CADASTRO } from '../../support/api/endpoints';
import { gerarCadastro } from '../../support/api/payloads';


describe('Testes da API - Cadastro', () => {
    let Id = null;
    const cadastro = gerarCadastro();
    const cadastroAtualizado = gerarCadastro();


    it('GET - Validar se a API está retornando status 200', () => {
        cy.api({
            method: 'GET',
            url: CADASTRO
        })
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.be.an('array');
            });

    });


    it('GET - Validar URL incorreta, deve retornar status 404', () => {
        cy.api({
            method: 'GET',
            url: `${CADASTRO}s`,
            failOnStatusCode: false
        })
            .then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.contain("Not found");
            });

    });


    it('POST - Enviar requisição para URL incorreta deve retornar 400', () => {
        cy.api({
            method: 'POST',
            url: `${CADASTRO}s`,
            body: cadastro,
            failOnStatusCode: false
        })
            .then((response) => {
                expect(response.status).to.eq(400);

                expect(response.body).to.contain('Invalid request');
            });

    });


    it('POST - Criar novo cadastro', () => {
        cy.api({
            method: 'POST',
            url: CADASTRO,
            body: cadastro
        })
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(201);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', cadastro.name);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', cadastro.email);

                Id = response.body.id;
            });

    });


    it('GET - Buscar cadastro efetuado anteriormente', () => {
        cy.api({
            method: 'GET',
            url: `${CADASTRO}/${Id}`
        })
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('name', cadastro.name);
                expect(response.body).to.have.property('email', cadastro.email);
            });

    });


    it('GET - Buscar registro inexistente, deve retornar status 404', () => {
        cy.api({
            method: 'GET',
            url: `${CADASTRO}/99999a`,
            failOnStatusCode: false
        })
            .then((response) => {
                expect(response.status).to.eq(404);

                expect(response.body).to.contain("Not found");
            });

    });


    it('PUT - Atualizar dados do cadastro', () => {
        cy.api({
            method: 'PUT',
            url: `${CADASTRO}/${Id}`,
            body: cadastroAtualizado
        })
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', cadastroAtualizado.name);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('email', cadastroAtualizado.email);
            });

    });


    it('GET - Validar se os dados foram atualizados', () => {
        cy.api({
            method: 'GET',
            url: `${CADASTRO}/${Id}`
        })
            .then((response) => {

                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('name', cadastroAtualizado.name);
                expect(response.body).to.have.property('email', cadastroAtualizado.email);
            });

    });


    it('DELETE - Excluir cadastro', () => {
        cy.api({
            method: 'DELETE',
            url: `${CADASTRO}/${Id}`
        })
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', cadastroAtualizado.name);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('email', cadastroAtualizado.email);
            });

    });


    it('GET - Validar se o registro foi excluído, deve retornar status 404', () => {
        cy.api({
            method: 'GET',
            url: `${CADASTRO}/${Id}`,
            failOnStatusCode: false
        })
            .then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.contain("Not found");
            });

    });

});
