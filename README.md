# Cypress

Foram adicionados scripts para a execução do cypress, no modo interativo e no modo headless.

Para executar o cypress em modo interativo basta utilizar o comando `npm run cypress`.

### Execução em máquina Linux para geração de report
Ao executar o comando `npm run cypressReport`  irá executar os testes no modo headless e irá gerar o relatório em html em [`cypress/reports/html/index.html`](cypress/reports/html/index.html).

### Execução em máquina Windows para geração de report
Ao executar o comando `npm run windowsReport`  irá executar os testes no modo headless e irá gerar o relatório em html em [`cypress/reports/html/index.html`](cypress/reports/html/index.html).

Também podemos executar o `npx cypress run` que irá executar no modo headless