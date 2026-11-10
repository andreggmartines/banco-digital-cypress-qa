describe("Abertura de conta", () => {
  let cliente;
  before(() => cy.clienteDaSuite().then((c) => (cliente = c)));
  beforeEach(() => cy.entrar(cliente));

  const casos = [
    { tipo: "SAVINGS", valor: "1", descricao: "poupança" },
    { tipo: "CHECKING", valor: "0", descricao: "corrente" },
  ];

  casos.forEach(({ tipo, valor, descricao }) => {
    it(`abre conta ${descricao} com o depósito mínimo de $100 vindo da conta de origem`, () => {
      cy.saldo(cliente.contaPrincipal).then((saldoAntes) => {
        cy.visit("/openaccount.htm");
        cy.get("#type").select(valor);
        cy.get("#fromAccountId").select(String(cliente.contaPrincipal));
        cy.get("input[value='Open New Account']").click();
        cy.contains("h1", "Account Opened!").should("be.visible");

        cy.get("#newAccountId")
          .invoke("text")
          .then((novaConta) => {
            cy.api("GET", `/accounts/${novaConta.trim()}`)
              .its("body")
              .should((conta) => {
                expect(conta.type).to.eq(tipo);
                expect(conta.balance).to.eq(100);
              });
            cy.saldo(cliente.contaPrincipal).should("eq", saldoAntes - 100);
          });
      });
    });
  });
});
