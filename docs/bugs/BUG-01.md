# BUG-01: Cadastro com acento quebra e mostra o erro técnico do servidor

| Campo | Valor |
|---|---|
| Ambiente | https://parabank.parasoft.com/parabank, Edge, Windows 10, novembro de 2026 |
| Severidade | Média |
| Prioridade | Alta |
| Risco do plano | R07 |
| Teste que detecta | `cypress/e2e/defeitos/seguranca-e-cadastro.cy.js` › BUG-01 |

## Passos para reproduzir
1. Abrir a tela **Register**.
2. Preencher todos os campos, com a cidade `São Paulo` (ou um nome como `João Conceição`).
3. Clicar em **Register**.

## Resultado esperado
O cadastro é concluído e a tela mostra `Welcome <usuário>`.

## Resultado obtido
A página responde **HTTP Status 400** e exibe o rastro técnico do servidor (stack trace). O cliente não é criado. Sem acento, com `Sao Paulo`, o cadastro funciona.

## Impacto
Qualquer cliente brasileiro com acento no nome ou no endereço não consegue abrir conta. O rastro técnico também expõe detalhes internos do sistema para quem quiser atacá-lo.

## Evidência
Rode `npm run test:defeitos`. O teste deste defeito falha, e o Cypress guarda o print da tela no momento da falha em `cypress/screenshots`.

## Reteste
O teste descreve o comportamento correto. Quando o defeito for corrigido, ele passa: nessa hora, mova-o para `cypress/e2e/regressao`, onde ele protege contra a volta do bug.
