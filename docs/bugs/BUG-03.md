# BUG-03: Transferência acima do saldo deixa a conta negativa

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Alta |
| Prioridade | Alta |
| Risco do plano | R02 |
| Teste que detecta | `cypress/e2e/defeitos/transferencia.cy.js` › BUG-03 |

## Passos para reproduzir
1. Entrar com um cliente e conferir o saldo da conta principal.
2. Abrir **Transfer Funds**.
3. Informar um valor maior que o saldo (saldo + 1000) para outra conta do cliente.
4. Clicar em **Transfer**.

## Resultado esperado
A transferência é recusada por saldo insuficiente.

## Resultado obtido
A tela mostra **Transfer Complete!** e a conta de origem fica com saldo negativo (no teste, **-$1000.00** em **Accounts Overview**).

## Impacto
O cliente gasta dinheiro que não tem, sem limite de crédito contratado.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
