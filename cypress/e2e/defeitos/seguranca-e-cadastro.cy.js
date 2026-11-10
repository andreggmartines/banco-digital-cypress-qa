// DEFEITOS ABERTOS: cada teste descreve o comportamento CORRETO e hoje falha.

describe("Defeitos abertos · Cadastro, sessão e acesso", () => {
  it("BUG-01 · aceita nomes com acento, como São Paulo", () => {
    cy.visit("/register.htm");
    const usuario = `qa${Date.now().toString().slice(-9)}`;
    const campos = {
      "customer.firstName": "João",
      "customer.lastName": "Conceição",
      "customer.address.street": "Avenida Paulista, 1000",
      "customer.address.city": "São Paulo",
      "customer.address.state": "SP",
      "customer.address.zipCode": "01310-100",
      "customer.ssn": "123-45-6789",
      "customer.username": usuario,
      "customer.password": "senha123",
      repeatedPassword: "senha123",
    };
    Object.entries(campos).forEach(([nome, valor]) => cy.get(`[name="${nome}"]`).type(valor));
    cy.get("input[value=Register]").click();
    cy.get("body").should("not.contain", "HTTP Status 400");
    cy.get("#rightPanel").should("contain", `Welcome ${usuario}`);
  });

  it("BUG-06 · a API não mostra a conta de um cliente para quem não está logado", () => {
    cy.clienteDaSuite().then((dono) => {
      cy.clearCookies();
      cy.api("GET", `/accounts/${dono.contaPrincipal}`, { failOnStatusCode: false })
        .its("status")
        .should("be.oneOf", [401, 403]);
    });
  });

  it("BUG-07 · depois de sair, a área logada leva ao login em vez de dar erro", () => {
    cy.clienteDaSuite().then((cliente) => {
      cy.visit("/index.htm");
      cy.get("input[name=username]").type(cliente.username);
      cy.get("input[name=password]").type(cliente.password);
      cy.get("input[value='Log In']").click();
      cy.contains("a", "Log Out").click();
      cy.request({ url: "/overview.htm", failOnStatusCode: false }).its("status").should("not.eq", 500);
    });
  });

  it("BUG-08 · a conta criada pela API já informa o saldo inicial", () => {
    cy.clienteDaSuite().then((cliente) => {
      cy.api("POST", `/createAccount?customerId=${cliente.id}&newAccountType=1&fromAccountId=${cliente.contaPrincipal}`)
        .its("body")
        .then((resposta) => {
          cy.saldo(resposta.id).then((saldoReal) => {
            expect(resposta.balance, "saldo informado na criação").to.eq(saldoReal);
          });
        });
    });
  });

  it("BUG-10 · senha errada não entra e mostra a mensagem de login inválido", () => {
    cy.clienteDaSuite().then((cliente) => {
      cy.clearCookies();
      cy.visit("/index.htm");
      cy.get("input[name=username]").type(cliente.username);
      cy.get("input[name=password]").type("errada");
      cy.get("input[value='Log In']").click();
      // Hoje às vezes aparece um erro interno e às vezes abre a área logada,
      // inclusive com as contas de outro cliente.
      cy.get("#accountTable").should("not.exist");
      cy.contains("a", "Log Out").should("not.exist");
      cy.get("#rightPanel .error").should("have.text", "The username and password could not be verified.");
    });
  });
});
