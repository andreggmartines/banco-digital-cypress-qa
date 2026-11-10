# Banco Digital · Cypress QA

[![Testes](https://github.com/andreggmartines/banco-digital-cypress-qa/actions/workflows/testes.yml/badge.svg)](https://github.com/andreggmartines/banco-digital-cypress-qa/actions/workflows/testes.yml)

Projeto de portfólio de **Quality Assurance** de [André Martines](https://www.linkedin.com/in/andreggmartines/). São testes de tela, de API e de acessibilidade com **Cypress**, aplicados a um banco digital.

> **Cenário de estudo.** Neste exercício, eu entro como QA no time de um banco digital e recebo o sistema para testar antes de uma entrega. O sistema é o [ParaBank](https://parabank.parasoft.com), um banco de demonstração público feito para treinar testes. Os dados são fictícios e os defeitos são do próprio ParaBank.

> **English summary.** Cypress tests for ParaBank, a public demo bank: UI, REST API and accessibility (axe-core). Every money movement made on screen is double-checked through the API, and the suite asserts business rules ("the customer's total balance stays the same after a transfer") rather than fixed numbers. Two suites: a green regression suite and an "open defects" suite where each test describes the correct behaviour, fails today and links to a bug report. Ten defects were found, three of them critical: negative transfers, an unauthenticated API exposing any account, and a login that does not reliably reject a wrong password.

## Em resumo

| Entrega | Onde está |
|---|---|
| Plano de testes com escopo, 9 riscos priorizados e critérios de saída | [docs/plano-de-testes.md](docs/plano-de-testes.md) |
| 17 testes de regressão: cadastro, login, contas, transferência, empréstimo e API | [cypress/e2e/regressao](cypress/e2e/regressao/) |
| 12 testes de defeitos abertos, que falham de propósito | [cypress/e2e/defeitos](cypress/e2e/defeitos/) |
| 10 bug reports com passos, impacto e plano de reteste | [docs/bugs](docs/bugs/) |
| Comandos próprios: criar cliente, entrar, abrir conta, ler saldo e conferir contrato | [cypress/support/commands.js](cypress/support/commands.js) |
| Execução a cada push e toda segunda-feira no GitHub Actions | [.github/workflows/testes.yml](.github/workflows/testes.yml) |

> Uso de IA: usei IA como apoio para rascunhos de código e documentação. A estratégia, a cobertura e a revisão dos testes são minhas.

## Defeitos encontrados

| Defeito | Severidade | Risco |
|---|---|---|
| [BUG-02](docs/bugs/BUG-02.md): transferência aceita valor negativo, na tela e na API | Crítica | Dinheiro |
| [BUG-06](docs/bugs/BUG-06.md): a API mostra os dados de uma conta para quem não está logado | Crítica | Acesso |
| [BUG-10](docs/bugs/BUG-10.md): a senha errada não é recusada; às vezes abre a conta, inclusive a de outro cliente | Crítica | Acesso |
| [BUG-03](docs/bugs/BUG-03.md): transferência acima do saldo deixa a conta negativa | Alta | Dinheiro |
| [BUG-01](docs/bugs/BUG-01.md): cadastro com acento ("São Paulo") quebra e mostra o erro técnico | Média | Cadastro |
| [BUG-05](docs/bugs/BUG-05.md): transferência com valor em branco gera erro interno | Média | Dinheiro |
| [BUG-09](docs/bugs/BUG-09.md): login e cadastro com violações graves de acessibilidade | Média | Acessibilidade |
| [BUG-04](docs/bugs/BUG-04.md): transferência para a mesma conta é aceita | Baixa | Dinheiro |
| [BUG-07](docs/bugs/BUG-07.md): depois de sair, a área logada responde erro 500 | Baixa | Acesso |
| [BUG-08](docs/bugs/BUG-08.md): conta criada pela API informa saldo 0, mas o real é 100 | Baixa | API |

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou mais recente e o navegador Edge (no Windows já vem instalado).

```bash
npm install
npm test                # regressão (tem que ficar verde)
npm run test:defeitos   # defeitos abertos (falham de propósito)
npm run open            # modo visual, passo a passo
```

No CI (Linux), os testes rodam no Chrome. Se no Windows o Cypress fechar sem mostrar nada, rode com a aceleração de vídeo desligada: `set ELECTRON_EXTRA_LAUNCH_ARGS=--disable-gpu` antes do comando.

## Decisões de teste

- **Duas suítes.** A regressão cobre o que funciona e precisa ficar verde. A suíte de defeitos descreve o comportamento **correto**: cada teste falha hoje e aponta para um bug report. Quando o defeito for corrigido, o teste passa e vai para a regressão. No CI, o job de defeitos fica amarelo e não bloqueia nada.
- **Tela e API no mesmo teste.** Faço a ação pela tela e confiro o saldo pela API, que é a fonte da verdade.
- **Conferir a regra, não o número.** Em uma transferência entre contas do cliente, a soma dos saldos tem que continuar igual.
- **Contrato da API.** Um comando próprio (`confereContrato`) confere os campos e os tipos de cada resposta.
- **Respeito ao sistema público.** O ParaBank é compartilhado e protegido contra excesso de acessos. Cada execução cria **um** cliente, e todos os testes usam esse cliente (`cy.task` + `cy.session`). Os testes não mexem em dados de outras pessoas, e a falha de acesso da API é demonstrada só com leitura.
- **Acessibilidade** com `axe-core`, considerando as violações graves e críticas.

## Estrutura

```
cypress/
  e2e/
    regressao/   o que funciona e precisa ficar verde
    defeitos/    um teste por defeito, ligado ao bug report
  support/
    commands.js  comandos próprios (cliente, login, contas, API)
docs/
  plano-de-testes.md
  bugs/          BUG-01 a BUG-10
```

## Licença

MIT
