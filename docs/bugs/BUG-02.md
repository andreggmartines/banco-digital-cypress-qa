# BUG-02: Transferência aceita valor negativo, na tela e na API

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Crítica |
| Prioridade | Alta |
| Risco do plano | R02 |
| Teste que detecta | `cypress/e2e/defeitos/transferencia.cy.js` › BUG-02 |

## Passos para reproduzir
1. Entrar com um cliente que tenha duas contas.
2. Abrir **Transfer Funds**.
3. Informar `-50`, escolher a conta de origem e a de destino.
4. Clicar em **Transfer**.
5. Repetir pela API: `POST /services/bank/transfer?fromAccountId=<origem>&toAccountId=<destino>&amount=-50`.

## Resultado esperado
O valor é recusado com uma mensagem clara e nenhum saldo muda. A API responde 400.

## Resultado obtido
A tela mostra **Transfer Complete!** e a API responde **200**. Na prática o dinheiro anda ao contrário: a conta de destino perde 50 e a de origem ganha 50.

## Impacto
Um cliente consegue tirar dinheiro de uma conta escolhendo-a como "destino". É uma falha direta na regra mais importante de um banco.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
