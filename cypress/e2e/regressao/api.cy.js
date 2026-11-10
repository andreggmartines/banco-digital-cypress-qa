describe("API do banco", () => {
  let cliente;
  before(() => cy.clienteDaSuite().then((c) => (cliente = c)));

  it("login devolve os dados do cliente no formato combinado", () => {
    cy.api("GET", `/login/${cliente.username}/${cliente.password}`)
      .its("body")
      .confereContrato({ id: "number", firstName: "string", lastName: "string", address: "object", ssn: "string" })
      .its("firstName")
      .should("eq", "Ana");
  });

  it("login inválido é recusado", () => {
    cy.api("GET", "/login/ninguem_aqui/errada", { failOnStatusCode: false }).then((r) => {
      expect(r.status).to.eq(400);
      expect(r.body).to.eq("Invalid username and/or password");
    });
  });

  it("lista as contas do cliente no formato combinado", () => {
    cy.contas(cliente.id).then((contas) => {
      expect(contas.length).to.be.at.least(1);
      cy.wrap(contas[0]).confereContrato({ id: "number", customerId: "number", type: "string", balance: "number" });
      contas.forEach((c) => expect(c.customerId).to.eq(cliente.id));
    });
  });

  it("transferência pela API move o valor e preserva o total", () => {
    cy.abrirConta(cliente).then((destino) => {
      cy.saldo(cliente.contaPrincipal).then((origemAntes) => {
        cy.api("POST", `/transfer?fromAccountId=${cliente.contaPrincipal}&toAccountId=${destino}&amount=40`)
          .its("body")
          .should("eq", `Successfully transferred $40 from account #${cliente.contaPrincipal} to account #${destino}`);
        cy.saldo(cliente.contaPrincipal).should("be.closeTo", origemAntes - 40, 0.001);
        cy.saldo(destino).should("be.closeTo", 140, 0.001);
      });
    });
  });

  it("conta inexistente é recusada", () => {
    cy.api("GET", "/accounts/99999999", { failOnStatusCode: false }).then((r) => {
      expect(r.status).to.eq(400);
      expect(r.body).to.eq("Could not find account #99999999");
    });
  });
});
