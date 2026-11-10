// Formulário completo e válido. Sem acentos: acento no cadastro é um defeito conhecido (BUG-01).
const formularioValido = (usuario) => ({
  "customer.firstName": "Ana",
  "customer.lastName": "Souza",
  "customer.address.street": "Rua das Flores, 100",
  "customer.address.city": "Sao Paulo",
  "customer.address.state": "SP",
  "customer.address.zipCode": "01310-100",
  "customer.ssn": "123-45-6789",
  "customer.username": usuario,
  "customer.password": "senha123",
  repeatedPassword: "senha123",
});

const preencher = (campos) =>
  Object.entries(campos).forEach(([nome, valor]) => cy.get(`[name="${nome}"]`).clear().type(valor));

describe("Cadastro de cliente", () => {
  beforeEach(() => cy.visit("/register.htm"));

  it("mostra a mensagem de cada campo obrigatório em branco", () => {
    cy.get("input[value=Register]").click();
    const obrigatorios = {
      "customer.firstName": "First name is required.",
      "customer.lastName": "Last name is required.",
      "customer.address.street": "Address is required.",
      "customer.address.city": "City is required.",
      "customer.address.state": "State is required.",
      "customer.address.zipCode": "Zip Code is required.",
      "customer.ssn": "Social Security Number is required.",
      "customer.username": "Username is required.",
      "customer.password": "Password is required.",
      repeatedPassword: "Password confirmation is required.",
    };
    Object.entries(obrigatorios).forEach(([campo, mensagem]) => {
      cy.get(`[id="${campo}.errors"]`).should("have.text", mensagem);
    });
  });

  it("recusa senhas diferentes na confirmação", () => {
    cy.get('[name="customer.password"]').type("senha123");
    cy.get('[name="repeatedPassword"]').type("outra456");
    cy.get("input[value=Register]").click();
    cy.get('[id="repeatedPassword.errors"]').should("have.text", "Passwords did not match.");
  });

  it("não deixa cadastrar um usuário que já existe", () => {
    cy.clienteDaSuite().then((existente) => {
      cy.clearCookies();
      cy.visit("/register.htm");
      preencher(formularioValido(existente.username));
      cy.get("input[value=Register]").click();
      cy.get('[id="customer.username.errors"]').should("have.text", "This username already exists.");
    });
  });

  it("cadastra o cliente e já entra logado", () => {
    const usuario = `qa${Date.now().toString().slice(-9)}`;
    preencher(formularioValido(usuario));
    cy.get("input[value=Register]").click();
    cy.get("#rightPanel").should("contain", `Welcome ${usuario}`).and("contain", "Your account was created successfully");
    cy.contains("a", "Log Out").should("be.visible");
  });
});
