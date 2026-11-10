# BUG-07: Depois de sair, a área logada responde erro 500

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Baixa |
| Prioridade | Baixa |
| Risco do plano | R03 |
| Teste que detecta | `cypress/e2e/defeitos/seguranca-e-cadastro.cy.js` › BUG-07 |

## Passos para reproduzir
1. Entrar e clicar em **Log Out**.
2. Abrir `/overview.htm` (por exemplo, com o botão Voltar ou um favorito).

## Resultado esperado
O sistema leva para a tela de login.

## Resultado obtido
O servidor responde **500 Internal Server Error**.

## Impacto
O cliente vê uma página de erro em vez de ser convidado a entrar de novo. Erros 500 em um fluxo comum também atrapalham o monitoramento.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
