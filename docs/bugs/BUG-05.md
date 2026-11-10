# BUG-05: Transferência com valor em branco gera erro interno

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Média |
| Prioridade | Média |
| Risco do plano | R02 |
| Teste que detecta | `cypress/e2e/defeitos/transferencia.cy.js` › BUG-05 |

## Passos para reproduzir
1. Entrar e abrir **Transfer Funds**.
2. Deixar o campo **Amount** vazio e escolher as contas.
3. Clicar em **Transfer**.

## Resultado esperado
Uma mensagem de validação pede o valor, ao lado do campo.

## Resultado obtido
A tela mostra **An internal error has occurred and has been logged.**

## Impacto
O cliente não entende o que fez de errado. O erro interno também mostra que a entrada não é validada antes de chegar ao servidor.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
