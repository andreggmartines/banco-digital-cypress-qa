const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://parabank.parasoft.com/parabank",
    // Por padrão roda a regressão. A suíte de defeitos abertos roda com: npm run test:defeitos
    specPattern: "cypress/e2e/regressao/**/*.cy.js",
    env: { api: "https://parabank.parasoft.com/parabank/services/bank" },
    viewportWidth: 1280,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    video: false,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on) {
      // O ParaBank é público e limita quantos clientes um mesmo acesso pode cadastrar.
      // Por isso a execução inteira compartilha um cliente, guardado aqui entre os arquivos de teste.
      let clienteDaSuite = null;
      on("task", {
        lerCliente: () => clienteDaSuite,
        guardarCliente(cliente) {
          clienteDaSuite = cliente;
          return cliente;
        },
        // Mostra no terminal as violações de acessibilidade encontradas pelo axe.
        log(mensagem) {
          console.log(mensagem);
          return null;
        },
      });
    },
  },
});
