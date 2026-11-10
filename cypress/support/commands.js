// Comandos reaproveitados pelos testes.

const api = (caminho) => `${Cypress.env("api")}${caminho}`;

let contador = 0;
const usuarioUnico = () => `qa${Date.now().toString().slice(-8)}${++contador}`;

// Chamada à API REST pedindo JSON. Use { failOnStatusCode: false } para testar erros.
Cypress.Commands.add("api", (metodo, caminho, opcoes = {}) =>
  cy.request({ method: metodo, url: api(caminho), headers: { Accept: "application/json" }, ...opcoes })
);

// Cria um cliente novo pelo formulário de cadastro (sem passar pela tela) e devolve os dados dele.
// O navegador fica logado como esse cliente. Como o ParaBank limita os cadastros,
// os testes usam cy.clienteDaSuite() e só criam um cliente novo quando o teste é sobre o cadastro.
Cypress.Commands.add("criarCliente", (dados = {}) => {
  const cliente = {
    firstName: "Ana",
    lastName: "Souza",
    username: usuarioUnico(),
    password: "senha123",
    ...dados,
  };
  // Abrir a página antes cria a sessão; sem ela o cadastro é recusado.
  cy.request("/register.htm");
  cy.request({
    method: "POST",
    url: "/register.htm",
    form: true,
    body: {
      "customer.firstName": cliente.firstName,
      "customer.lastName": cliente.lastName,
      "customer.address.street": "Rua das Flores, 100",
      "customer.address.city": "Sao Paulo",
      "customer.address.state": "SP",
      "customer.address.zipCode": "01310-100",
      "customer.phoneNumber": "11999990000",
      "customer.ssn": "123-45-6789",
      "customer.username": cliente.username,
      "customer.password": cliente.password,
      repeatedPassword: cliente.password,
    },
  })
    .its("body")
    .should("contain", "Your account was created successfully");

  return cy.api("GET", `/login/${cliente.username}/${cliente.password}`).then(({ body }) => {
    cliente.id = body.id;
    return cy.api("GET", `/customers/${body.id}/accounts`).then(({ body: contas }) => {
      cliente.contaPrincipal = contas[0].id;
      return cliente;
    });
  });
});

// O cliente compartilhado pela execução inteira: criado na primeira vez, reaproveitado depois.
Cypress.Commands.add("clienteDaSuite", () =>
  cy.task("lerCliente").then((existente) =>
    existente ? existente : cy.criarCliente().then((novo) => cy.task("guardarCliente", novo))
  )
);

// Entra como o cliente reaproveitando a sessão (cy.session guarda os cookies entre os testes).
Cypress.Commands.add("entrar", (cliente) => {
  cy.session(cliente.username, () => {
    cy.request({
      method: "POST",
      url: "/login.htm",
      form: true,
      body: { username: cliente.username, password: cliente.password },
    });
  });
});

// Abre uma conta nova pela API, tirando o depósito mínimo da conta de origem.
// Tipo: 0 = corrente (CHECKING), 1 = poupança (SAVINGS).
Cypress.Commands.add("abrirConta", (cliente, tipo = 0) =>
  cy
    .api("POST", `/createAccount?customerId=${cliente.id}&newAccountType=${tipo}&fromAccountId=${cliente.contaPrincipal}`)
    .its("body.id")
);

Cypress.Commands.add("saldo", (contaId) => cy.api("GET", `/accounts/${contaId}`).its("body.balance"));

Cypress.Commands.add("contas", (clienteId) => cy.api("GET", `/customers/${clienteId}/accounts`).its("body"));

// Confere o formato de um objeto: { campo: "number" | "string" | "object" }.
Cypress.Commands.add("confereContrato", { prevSubject: true }, (objeto, contrato) => {
  Object.entries(contrato).forEach(([campo, tipo]) => {
    expect(objeto, `campo "${campo}"`).to.have.property(campo);
    expect(typeof objeto[campo], `tipo de "${campo}"`).to.eq(tipo);
  });
  return objeto;
});
