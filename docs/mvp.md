# Escopo do MVP (rascunho)

> Documento vivo. Define a **primeira versão** do GoToUSA: o mínimo necessário para o fundador e um pequeno grupo de pessoas usarem o app na própria jornada real e validarem a ideia.

## Objetivo do MVP

Responder a uma pergunta: **"Ver o todo organizado e acompanhar a própria evolução realmente ajuda a pessoa a avançar (ou a decidir com consciência)?"**

- **Usuários:** o fundador e de 3 a 5 pessoas próximas que também querem se mudar para os EUA.
- **Uso real:** cada um usa o app na própria jornada, no ritmo que escolher.
- **Não é lançamento público:** roda localmente ou num endereço privado, sem cobrança.

## Princípio do recorte

Os validadores estão **no começo da jornada**. Por isso, o MVP aprofunda o conteúdo das fases que eles vão viver agora (0, 1 e 2) e mostra as demais fases apenas como visão geral. O conteúdo das fases seguintes é escrito conforme eles avançam.

## Cenário inicial de validação

O conteúdo começa pelo cenário real do fundador:
- **Propósito:** trabalho formal, com caminho para residência permanente (Green Card por emprego), possivelmente passando antes por um visto de trabalho temporário.
- **Família:** casal + filho de 21 anos com **deficiência intelectual e autismo nível 3** (nível mais alto de suporte), que depende da mãe. Tem boa saúde, não faz tratamento especial e usa **medicação controlada contínua**.
- **Preferência pessoal marcante:** não gosta de calor.
- **Temas críticos que este cenário exige:** filho que pela idade não entra como dependente (regra dos menores de 21 e CSPA), *guardianship* (a curatela brasileira não vale automaticamente nos EUA), medicação controlada (receita americana, entrada com estoque inicial), fim dos serviços escolares aos 21/22 anos, programas estaduais para adultos com deficiência e filas de espera, acesso a benefícios conforme o status imigratório, e escolha do estado.

Por ser um dos cenários mais complexos, ele testa bem o motor da jornada. Os demais cenários entram depois **como conteúdo e regras, sem mudar código**. Quem responder um cenário ainda não coberto vê a parte comum da jornada e um aviso de "conteúdo em construção".

## Decisão técnica: MVP sem backend, preparado para o backend

> **Atualização de 19/11/2026:** para testar o acesso compartilhado com a família, o backend começa **localmente** (no PC do fundador, só na rede de casa), sem publicar. O modo sem conta continua. Ver [backend-local.md](backend-local.md).

**Decidido:** como no MVP não há conta nem pagamento, **tudo roda no navegador**:
- Só o frontend (Next.js). Os dados ficam no **IndexedDB** e podem ser levados a outro aparelho com **baixar/importar**.
- O conteúdo da jornada fica em arquivos no repositório, versionados no Git (ver [conteudo.md](conteudo.md)).
- **Vantagem:** muito menos trabalho para chegar a algo usável e validar mais cedo.

**Atualizar conteúdo não exige backend:** num app web, corrigir um arquivo, fazer o commit e publicar de novo leva minutos, e todos veem a versão nova no próximo acesso.

**Cuidados para adicionar o backend depois sem retrabalho:**
1. **Monorepo desde o início:** `apps/web`, `apps/api` (nasce vazio) e `packages/shared`.
2. **Regras no pacote compartilhado:** tipos, validações (Zod) e o **motor de geração da jornada** ficam em `packages/shared`, e não presos ao frontend. A API futura usa o mesmo código.
3. **Camada de armazenamento:** as telas chamam "salvar jornada" e "carregar jornada", nunca o IndexedDB diretamente. Hoje a implementação usa o navegador; depois, a API.
4. **UUID em tudo:** jornadas, tarefas e respostas têm identificadores únicos, para subir ao servidor sem conflito nem duplicação.
5. **IDs estáveis no conteúdo:** cada tarefa do conteúdo tem um identificador fixo, para que atualizações de conteúdo não quebrem o progresso salvo.
6. **Arquivo de exportação com versão:** jornadas baixadas em versões antigas continuam importáveis, inclusive para a conta.

## Funcionalidades

### Obrigatório (sem isso não há MVP)
| # | Funcionalidade | Observação |
|---|---|---|
| 1 | **Aviso legal com aceite** | Não é orientação jurídica, é um auxílio à jornada |
| 2 | **Boas-vindas com expectativa clara** | É uma jornada longa, você é quem executa, o app é o guia, e desistir com consciência também é válido |
| 3 | **Questionário completo e adaptativo** | Todos os blocos de [questionario.md](questionario.md), com progresso salvo e edição posterior |
| 4 | **Geração da jornada** | Regras que transformam respostas em fases, etapas, tarefas e subtarefas, com prazos calculados a partir da data de partida |
| 5 | **Conteúdo das Fases 0, 1 e 2** | Tarefas completas para os propósitos dos validadores. Fases 3 a 6 aparecem como visão geral |
| 6 | **Visão da jornada por fase e por tema** | Com tarefas, subtarefas e status (a fazer, em andamento, concluída, não se aplica) |
| 7 | **Tarefas próprias** | A pessoa adiciona o que quiser |
| 8 | **Prontidão para a mudança** | Total e por tema, com tarefas de pesos diferentes |
| 9 | **Tela "Hoje"** | Um único próximo passo |
| 10 | **Baixar e importar a jornada** | Garante que ninguém perde dados |
| 11 | **Responsivo (celular primeiro) e i18n desde o início** | Nenhum texto fixo no código, layout pronto para idiomas da direita para a esquerda |

### Importante (entra se não atrasar o essencial)
| # | Funcionalidade | Observação |
|---|---|---|
| 12 | **O seu porquê em destaque** | Mostrado na tela inicial e nos check-ins |
| 13 | **Check-in ao fim de cada fase** | Continuar, pausar, ajustar ou encerrar |
| 14 | **Recompensas escolhidas pela pessoa** | Sugeridas ao concluir tarefas e marcos |
| 15 | **Trilha simples e carimbos do passaporte** | Versão visual simples, que pode ser refinada depois |
| 16 | **Contagem regressiva** até a data de partida | Simples de fazer |
| 17 | **Carta para o eu do futuro** | Simples de fazer |
| 18 | **Orçamento da mudança (versão simples)** | Custos até a mudança, custo mensal no(s) estado(s) da lista curta e "a conta fecha?", com taxas oficiais conferidas. Ver [orcamento.md](orcamento.md) |

### Depois do MVP
- Contas, transferência da jornada do navegador para a conta e acesso em vários aparelhos
- Backend (NestJS), banco de dados (PostgreSQL) e cache (Valkey)
- Pagamento (plano anual via Merchant of Record)
- Lembretes por e-mail ou notificação e resumo do período
- Expressão em inglês e curiosidade do dia
- Funcionamento offline (PWA)
- Conteúdo detalhado das Fases 3 a 6
- Comparação de destinos com as preferências da pessoa
- Traduções completas do conteúdo para en-US e es

## Idiomas no MVP

- **Interface:** pt-BR, en-US e es desde o início. São textos curtos, fáceis de traduzir.
- **Conteúdo da jornada:** primeiro em **pt-BR**, que é o idioma dos validadores. A estrutura já fica pronta para tradução, e en-US e es entram antes de qualquer lançamento público.

## Critérios de sucesso

O MVP é considerado validado se, depois de cerca de 2 meses de uso:
- o fundador continua usando no ritmo que escolheu;
- a maioria dos validadores completa o questionário e a Fase 0;
- os validadores dizem que **passaram a enxergar o todo** e que as tarefas fazem sentido para a situação deles;
- aparecem pedidos espontâneos de melhorias, o que é sinal de uso real.

Medição: conversas com os validadores ao fim de cada mês (no MVP não há coleta de dados de uso).

## Ordem de construção (marcos)

1. ✅ **Esqueleto:** monorepo, Next.js, i18n nos 3 idiomas, layout base responsivo, aviso legal e boas-vindas.
2. 🧪 **Questionário:** blocos, ramificação, salvamento no IndexedDB, edição. *Implementado em 16/11/2026, aguardando o teste do fundador no celular.* Regras em `packages/shared/src/questionnaire/`, telas em `apps/web/src/components/questionnaire/`, textos em `apps/web/messages/questionnaire/`.
3. **Motor da jornada:** formato do conteúdo, regras de geração, cálculo de prazos, **perfil da família** e **caminhos de visto para conhecer** (ver [caminhos-visto.md](caminhos-visto.md)). Tudo gerado a partir do questionário.
4. **Conteúdo da Fase 0** (escrito em paralelo aos marcos 2 e 3).
5. **Telas da jornada:** por fase e por tema, tarefas, prontidão, tela "Hoje". Ver [telas.md](telas.md).
6. **Baixar e importar.** ➜ **Primeira versão usável pelo fundador.**
7. **Conteúdo das Fases 1 e 2** e funcionalidades "importantes".
8. **Testes com os validadores** e ajustes.

## Decisões tomadas
- [x] MVP sem backend, preparado para adicioná-lo depois
- [x] Cenário inicial: trabalho + família com filho adulto dependente com deficiência
- [x] Questionário completo para todos os cenários; conteúdo começa pelo cenário inicial

## Pendências
- [ ] Levantar os propósitos dos demais validadores
- [ ] Definir a lista curta de estados para o primeiro perfil detalhado
- [ ] Definir se a atualização automática do conteúdo entra no MVP ou logo depois
