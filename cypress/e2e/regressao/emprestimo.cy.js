describe("Empréstimo", () => {
  let cliente;

  before(() => cy.clienteDaSuite().then((c) => (cliente = c)));
  beforeEach(() => {
    cy.entrar(cliente);
    cy.visit("/requestloan.htm");
  });

  it("aprova um valor compatível com o saldo e cria a conta do empréstimo", () => {
    cy.get("#amount").type("500");
    cy.get("#downPayment").type("50");
    cy.get("#fromAccountId").select(String(cliente.contaPrincipal));
    cy.get("input[value='Apply Now']").click();
    cy.get("#loanStatus").should("have.text", "Approved");
    cy.get("#newAccountId")
      .invoke("text")
      .then((conta) => {
        cy.api("GET", `/accounts/${conta.trim()}`)
          .its("body")
          .should((emprestimo) => {
            expect(emprestimo.type).to.eq("LOAN");
            expect(emprestimo.balance).to.eq(500);
          });
      });
  });

  it("nega um valor muito acima do que o cliente tem", () => {
    cy.get("#amount").type("1000000");
    cy.get("#downPayment").type("10");
    cy.get("input[value='Apply Now']").click();
    cy.get("#loanStatus").should("have.text", "Denied");
    cy.contains("We cannot grant a loan in that amount with your available funds.").should("be.visible");
  });
});
