# BUG-06: A API mostra os dados de uma conta para quem não está logado

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Crítica |
| Prioridade | Alta |
| Risco do plano | R03 |
| Teste que detecta | `cypress/e2e/defeitos/seguranca-e-cadastro.cy.js` › BUG-06 |

## Passos para reproduzir
1. Sem fazer login (sem cookies), chamar `GET /services/bank/accounts/<número da conta>`.

## Resultado esperado
A API responde **401** ou **403** e não devolve nada.

## Resultado obtido
A API responde **200** com o número, o tipo, o saldo e o dono da conta. Basta saber (ou tentar) números de conta.

## Impacto
Qualquer pessoa na internet consegue consultar o saldo de qualquer cliente. Em um banco real isso seria um vazamento de dados sigilosos. O teste só lê dados de um cliente criado pelo próprio teste.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
