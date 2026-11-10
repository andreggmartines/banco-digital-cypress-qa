# BUG-08: Conta criada pela API informa saldo 0, mas o saldo real é 100

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Baixa |
| Prioridade | Média |
| Risco do plano | R04, R09 |
| Teste que detecta | `cypress/e2e/defeitos/seguranca-e-cadastro.cy.js` › BUG-08 |

## Passos para reproduzir
1. Chamar `POST /services/bank/createAccount?customerId=<id>&newAccountType=1&fromAccountId=<conta>`.
2. Ler o campo `balance` da resposta.
3. Consultar a conta nova com `GET /services/bank/accounts/<id da conta nova>`.

## Resultado esperado
O `balance` da resposta de criação é igual ao saldo real da conta (100, o depósito mínimo).

## Resultado obtido
A criação devolve `balance: 0`, e a consulta logo depois mostra **100**.

## Impacto
Um aplicativo que confie na resposta de criação mostra ao cliente um saldo errado.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
