# BUG-10: Senha errada não é recusada: às vezes dá erro, às vezes abre a conta

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Crítica |
| Prioridade | Alta |
| Risco do plano | R03 |
| Teste que detecta | `cypress/e2e/defeitos/seguranca-e-cadastro.cy.js` › BUG-10 |

## Passos para reproduzir
1. Na página inicial, informar o usuário de um cliente existente e a senha `errada`.
2. Clicar em **Log In**.
3. Repetir algumas vezes.

## Resultado esperado
O acesso é negado com a mensagem **The username and password could not be verified.**

## Resultado obtido
O resultado muda de uma tentativa para outra. Nas execuções, apareceram três comportamentos:

1. **An internal error has occurred and has been logged.**
2. A área logada abre com as contas do próprio cliente, mesmo com a senha errada.
3. A área logada abre com as contas de **outro cliente** ("John Smith").

Não encontrei a causa: por ser um teste de caixa-preta, não vejo o servidor. Pode ter relação com outras pessoas usando o sistema público ao mesmo tempo.

## Impacto
Mesmo sendo intermitente, é o defeito mais grave do projeto: a senha deixa de proteger a conta, e uma pessoa pode ver os dados de outra.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
