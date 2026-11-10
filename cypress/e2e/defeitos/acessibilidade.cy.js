// DEFEITOS ABERTOS · Acessibilidade das telas de entrada, com axe-core.
// Considera só as violações graves e críticas (serious e critical).

const registrar = (violacoes) => {
  cy.task(
    "log",
    violacoes
      .map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elemento(s))`)
      .join("\n")
  );
};

const telas = [
  { nome: "login (página inicial)", url: "/index.htm" },
  { nome: "cadastro", url: "/register.htm" },
];

describe("Defeitos abertos · Acessibilidade (BUG-09)", () => {
  telas.forEach(({ nome, url }) => {
    it(`BUG-09 · a tela de ${nome} não tem violações graves de acessibilidade`, () => {
      cy.visit(url);
      cy.injectAxe();
      cy.checkA11y(null, { includedImpacts: ["serious", "critical"] }, registrar);
    });
  });
});
