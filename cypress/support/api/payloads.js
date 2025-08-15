/// <reference types="cypress" />

import { faker } from '@faker-js/faker';


export function gerarCadastro() {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
    };
}
