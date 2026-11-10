# BUG-09: Telas de login e cadastro têm violações graves de acessibilidade

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Média |
| Prioridade | Média |
| Risco do plano | R08 |
| Teste que detecta | `cypress/e2e/defeitos/acessibilidade.cy.js` › BUG-09 |

## Passos para reproduzir
1. Abrir a página inicial (login) e a tela de cadastro.
2. Rodar o axe-core (`cy.injectAxe()` e `cy.checkA11y()`), considerando violações graves e críticas.

## Resultado esperado
Nenhuma violação grave ou crítica.

## Resultado obtido
Cinco regras violadas nas duas telas:

| Regra | Impacto | Login | Cadastro |
|---|---|:-:|:-:|
| `label`: campo de formulário sem rótulo | crítico | 2 | 13 |
| `image-alt`: imagem sem texto alternativo | crítico | 1 | 1 |
| `color-contrast`: contraste insuficiente | grave | 6 | 14 |
| `html-has-lang`: página sem idioma definido | grave | 1 | 1 |
| `link-name`: link sem texto | grave | 1 | 1 |

Os números são de elementos afetados.

## Impacto
Quem usa leitor de tela não sabe o que digitar em cada campo, e quem tem baixa visão tem dificuldade para ler. A Lei Brasileira de Inclusão (13.146/2015) exige acessibilidade em serviços digitais.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
