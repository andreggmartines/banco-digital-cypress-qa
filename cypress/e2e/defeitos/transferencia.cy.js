// DEFEITOS ABERTOS: cada teste descreve o comportamento CORRETO e hoje falha.
// Quando o defeito for corrigido, o teste passa e deve ir para a pasta regressao.

describe("Defeitos abertos · Transferência", () => {
  let cliente;
  let destino;

  before(() => {
    cy.clienteDaSuite().then((c) => {
      cliente = c;
      cy.abrirConta(cliente).then((id) => (destino = id));
    });
  });
  beforeEach(() => cy.entrar(cliente));

  const transferirPelaTela = (valor, para) => {
    cy.visit("/transfer.htm");
    if (valor !== "") cy.get("#amount").type(valor);
    cy.get("#fromAccountId").select(String(cliente.contaPrincipal));
    cy.get("#toAccountId").select(String(para));
    cy.get("input[value=Transfer]").click();
  };

  it("BUG-02 · recusa valor negativo e não mexe nos saldos", () => {
    cy.saldo(destino).then((destinoAntes) => {
      transferirPelaTela("-50", destino);
      cy.contains("h1", "Transfer Complete!").should("not.exist");
      cy.saldo(destino).should("eq", destinoAntes);
    });
  });

  it("BUG-02 · a API também recusa valor negativo", () => {
    cy.api("POST", `/transfer?fromAccountId=${cliente.contaPrincipal}&toAccountId=${destino}&amount=-50`, {
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 400);
  });

  it("BUG-03 · recusa transferência maior que o saldo", () => {
    cy.saldo(cliente.contaPrincipal).then((saldo) => {
      transferirPelaTela(String(saldo + 1000), destino);
      cy.contains("h1", "Transfer Complete!").should("not.exist");
      cy.saldo(cliente.contaPrincipal).should("be.gte", 0);
    });
  });

  it("BUG-04 · recusa transferência para a mesma conta", () => {
    transferirPelaTela("10", cliente.contaPrincipal);
    cy.contains("h1", "Transfer Complete!").should("not.exist");
  });

  it("BUG-05 · valor em branco mostra uma mensagem de validação, não um erro interno", () => {
    transferirPelaTela("", destino);
    cy.contains("An internal error has occurred").should("not.exist");
  });
});
