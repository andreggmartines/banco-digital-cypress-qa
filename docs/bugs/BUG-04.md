# BUG-04: Transferência para a mesma conta é aceita

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Baixa |
| Prioridade | Média |
| Risco do plano | R02 |
| Teste que detecta | `cypress/e2e/defeitos/transferencia.cy.js` › BUG-04 |

## Passos para reproduzir
1. Entrar e abrir **Transfer Funds**.
2. Escolher a mesma conta como origem e destino, valor `10`.
3. Clicar em **Transfer**.

## Resultado esperado
O sistema avisa que origem e destino precisam ser diferentes.

## Resultado obtido
A tela mostra **Transfer Complete!** e registra uma movimentação sem efeito no extrato.

## Impacto
Polui o extrato com movimentações que confundem o cliente e a conciliação.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
