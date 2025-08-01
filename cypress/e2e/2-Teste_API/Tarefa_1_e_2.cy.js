/// <reference types="cypress" />


import { faker } from '@faker-js/faker';


describe('Testes da API', () => {
    const baseUrl = 'https://688b7a952a52cabb9f51e423.mockapi.io/api/v1/cadastro';

    const name = faker.person.fullName();
    const email = faker.internet.email();
    const nameAtualizado = faker.person.fullName();
    const emailAtualizado = faker.internet.email();

    let Id = null;


    it('GET - Validar se a API está retornando status 200', () => {

        const requestPayload = {
            method: 'GET',
            url: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.be.an('array');
            });

    });


    it('GET - Validar URL incorreta, deve retornar status 404', () => {

        const requestPayload = {
            method: 'GET',
            url: 'https://688b7a952a52cabb9f51e423.mockapi.io/api/v1/cadastros',
            headers: {
                'Content-Type': 'application/json',
            },

            failOnStatusCode: false
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.contain("Not found");
            });

    });


    it('POST - Enviar Requisição para ULR incorreta deve retornar 400', () => {

        const requestPayload = {
            method: 'POST',
            url: 'https://688b7a952a52cabb9f51e423.mockapi.io/api/v1/cadastros',
            headers: {
                'Content-Type': 'application/json',
            },

            body: {
                name: name,
                email: email,
            },

            failOnStatusCode: false
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.status).to.eq(400);

                expect(response.body).to.contain('Invalid request');
            });

    });


    it('POST - Criar novo cadastro', () => {

        const requestPayload = {
            method: 'POST',
            url: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },

            body: {
                name: name,
                email: email,
            }
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(201);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', name);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', email);

                Id = response.body.id;
            });

    });


    it('GET - Buscar cadastro efetuado anteriormente', () => {

        const requestPayload = {
            method: 'GET',
            url: `${baseUrl}/${Id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('name', name);
                expect(response.body).to.have.property('email', email);

            });

    });


    it('GET - Buscar Registro Inexistente, deve retornar status 404', () => {

        const requestPayload = {
            method: 'GET',
            url: `${baseUrl}/99999a`,
            headers: {
                'Content-Type': 'application/json',
            },

            failOnStatusCode: false
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.status).to.eq(404);

                expect(response.body).to.contain("Not found");
            });

    });


    it('PUT - Atualizar os dados do cadastro', () => {

        const requestPayload = {
            method: 'PUT',
            url: `${baseUrl}/${Id}`,
            headers: {
                'Content-Type': 'application/json',
            },

            body: {
                name: nameAtualizado,
                email: emailAtualizado,
            }
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', nameAtualizado);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', emailAtualizado);
            });
    });


    it('GET - Validar se os dados foram atualizados', () => {

        const requestPayload = {
            method: 'GET',
            url: `${baseUrl}/${Id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        cy.api(requestPayload)
            .then((response) => {

                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('id', Id);
                expect(response.body).to.have.property('name', nameAtualizado);
                expect(response.body).to.have.property('email', emailAtualizado);

            });

    });


    it('DELETE - Excluir cadastro', () => {

        const requestPayload = {
            method: 'DELETE',
            url: `${baseUrl}/${Id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.headers).to.have.property('content-type').and.include('application/json');

                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('name', nameAtualizado);
                expect(response.body).to.have.property('avatar');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', emailAtualizado);
            });

    });


    it('GET - Validar se o registro foi excluido, deve retornar status 404', () => {

        const requestPayload = {
            method: 'GET',
            url: `${baseUrl}/${Id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            
            failOnStatusCode: false
        };

        cy.api(requestPayload)
            .then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.contain("Not found");
            });

    });

});
