# Plano de testes: banco digital

> **Cenário de estudo.** Este projeto é um exercício: imagino que entrei como QA no time de um banco digital e recebi o sistema para testar antes de uma entrega. O sistema é o [ParaBank](https://parabank.parasoft.com), um banco de demonstração público, feito para treino de testes.

## 1. Contexto e objetivo

O ParaBank tem cadastro de clientes, login, contas corrente e poupança, transferências, empréstimos e extrato, pela tela e por uma API REST.

**Objetivo:** garantir que o dinheiro do cliente se comporta como deveria (o saldo bate, nada aparece ou some sem explicação), encontrar e documentar os defeitos e deixar a suíte rodando sozinha no CI.

Os testes são de caixa-preta: não tenho acesso ao código nem ao banco de dados. Confiro a tela e confirmo os valores pela API.

## 2. Escopo

**Dentro**
- Cadastro de cliente e validação dos campos.
- Login e logout.
- Abertura de conta corrente e poupança, com o depósito mínimo.
- Transferência entre contas do próprio cliente.
- Empréstimo aprovado e negado.
- Extrato da conta.
- API REST: login, contas, transferência e empréstimo.
- Acessibilidade das telas de entrada (login e cadastro).

**Fora, e por quê**
- **Pagamento de contas e atualização de cadastro:** ficam para uma próxima etapa; o foco é onde o dinheiro se move.
- **Telas de administração:** reiniciam o banco de demonstração para todo mundo que estiver usando.
- **Carga e desempenho:** o sistema é público e compartilhado.
- **Transferir de contas de outros clientes:** mesmo sendo dados de demonstração, mexer no saldo de outra pessoa atrapalharia quem usa o sistema. A falha de acesso é demonstrada só com leitura, entre dois clientes criados pelos testes.

## 3. Riscos e prioridade

Nota de 1 a 3 para probabilidade (P) e impacto (I). Prioridade = P × I.

| # | Risco | P | I | Prioridade |
|---|---|:-:|:-:|:-:|
| R01 | Transferência altera os saldos de forma errada | 2 | 3 | **6** |
| R02 | Transferência aceita valor inválido (negativo, vazio, acima do saldo) | 2 | 3 | **6** |
| R03 | Outra pessoa consegue ver ou mexer na conta do cliente | 2 | 3 | **6** |
| R04 | Conta nova abre sem o depósito mínimo, ou o depósito some | 2 | 3 | **6** |
| R05 | Empréstimo aprovado sem condição, ou negado sem motivo | 2 | 2 | **4** |
| R06 | Extrato não mostra uma movimentação | 1 | 3 | **3** |
| R07 | Cadastro aceita dados incompletos | 2 | 2 | **4** |
| R08 | Pessoas com deficiência não conseguem usar as telas de entrada | 2 | 2 | **4** |
| R09 | Resposta da API muda de formato e quebra o aplicativo | 1 | 2 | **2** |

## 4. Estratégia

- **Duas suítes.** A **regressão** cobre o que funciona e precisa ficar verde. A suíte de **defeitos abertos** descreve o comportamento correto que hoje não acontece: cada teste falha de propósito e aponta para um bug report. Quando o defeito for corrigido, o teste passa e vai para a regressão.
- **Tela + API no mesmo teste:** faço a ação pela tela e confiro o saldo pela API, que é a fonte da verdade.
- **Conferir a regra, não o número:** em uma transferência, a soma dos saldos do cliente tem que continuar igual.
- **Dados próprios:** cada execução cria um cliente novo, com usuário único, e todos os testes usam esse cliente. Nada depende de dados de outras pessoas. Criar um cliente por teste fez o sistema público bloquear a suíte por excesso de acessos (429), então a suíte foi desenhada para gerar o mínimo de cadastros.
- **Acessibilidade** com `axe-core`, considerando as violações graves e críticas.

## 5. Critérios de saída

- Regressão verde no CI.
- Cada teste da suíte de defeitos ligado a um bug report.
- Riscos de prioridade 6 cobertos pela tela e pela API.

## 6. Entregas

- Testes em `cypress/e2e/regressao` e `cypress/e2e/defeitos`.
- Bug reports em [docs/bugs](bugs/).
- CI no GitHub Actions, com as duas suítes separadas.
