describe("Transferência entre contas do cliente", () => {
  let cliente;
  let destino;

  before(() => {
    cy.clienteDaSuite().then((c) => {
      cliente = c;
      cy.abrirConta(cliente).then((id) => (destino = id));
    });
  });
  beforeEach(() => cy.entrar(cliente));

  it("move o valor exato e o total do cliente continua o mesmo", () => {
    cy.contas(cliente.id).then((antes) => {
      const total = (contas) => contas.reduce((s, c) => s + c.balance, 0);
      const saldoDe = (contas, id) => contas.find((c) => c.id === id).balance;

      cy.visit("/transfer.htm");
      cy.get("#amount").type("25.50");
      cy.get("#fromAccountId").select(String(cliente.contaPrincipal));
      cy.get("#toAccountId").select(String(destino));
      cy.get("input[value=Transfer]").click();

      cy.contains("h1", "Transfer Complete!").should("be.visible");
      cy.get("#amountResult").should("have.text", "$25.50");

      // O saldo é conferido pela API, que é a fonte da verdade, e não pela tela.
      cy.contas(cliente.id).then((depois) => {
        expect(saldoDe(depois, cliente.contaPrincipal)).to.be.closeTo(saldoDe(antes, cliente.contaPrincipal) - 25.5, 0.001);
        expect(saldoDe(depois, destino)).to.be.closeTo(saldoDe(antes, destino) + 25.5, 0.001);
        expect(total(depois), "total do cliente").to.be.closeTo(total(antes), 0.001);
      });
    });
  });

  it("a transferência aparece no extrato das duas contas", () => {
    cy.api("POST", `/transfer?fromAccountId=${cliente.contaPrincipal}&toAccountId=${destino}&amount=12.34`);
    cy.visit(`/activity.htm?id=${cliente.contaPrincipal}`);
    cy.get("#transactionTable").should("contain", "Funds Transfer Sent").and("contain", "$12.34");
    cy.visit(`/activity.htm?id=${destino}`);
    cy.get("#transactionTable").should("contain", "Funds Transfer Received").and("contain", "$12.34");
  });
});
