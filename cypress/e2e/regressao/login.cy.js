describe("Login", () => {
  let cliente;

  before(() => cy.clienteDaSuite().then((c) => (cliente = c)));
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("/index.htm");
  });

  const entrar = (senha) => {
    cy.get("input[name=username]").type(cliente.username);
    cy.get("input[name=password]").type(senha);
    cy.get("input[value='Log In']").click();
  };

  it("cliente entra e vê as suas contas", () => {
    entrar(cliente.password);
    cy.get("#accountTable").should("contain", cliente.contaPrincipal);
  });

  it("sair encerra a sessão", () => {
    entrar(cliente.password);
    cy.contains("a", "Log Out").click();
    cy.get("input[name=username]").should("be.visible");
    cy.contains("a", "Log Out").should("not.exist");
  });
});
