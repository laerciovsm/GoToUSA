# Acesso compartilhado à jornada (família)

> Decisão do fundador em 19/11/2026. **Quem executa** está implementado (modelo atual, só no navegador). **Contas, convites e acesso de cada pessoa** ficam para a fase do backend, depois do MVP.

## Por quê

Uma mudança de família não é feita por uma pessoa só. Cada pessoa tem um papel e precisa fazer a sua parte: ver as informações, concluir as tarefas dela e atualizar o app. O responsável pela jornada tem a visão do todo e coordena. Ver o outro concluir a parte dele motiva, divide o peso e deixa claro quem está fazendo o quê (premissas de [jornada.md](jornada.md#premissas-psicológicas)).

## Dois conceitos separados

| Conceito | O que define | Valores | De onde vem |
|---|---|---|---|
| **Tipo de pessoa** | *Quais tarefas* a pessoa recebe | você, cônjuge, filho, dependente | Questionário (já existe) |
| **Papel de acesso** | *O que a pessoa pode fazer* no app | dono, admin, participante | Convite (fase do backend) |

Nada fica preso a nomes. O nome (apelido) serve só para exibição e para o e-mail do convite. A lógica usa o tipo de pessoa e o papel.

## Quem executa (implementado em 19/11/2026)

Cada tarefa separa **para quem é** (a pessoa da tarefa) de **quem executa**. Exemplo: a tarefa da curatela é *para* o filho, mas quem *executa* é o responsável.

- **No conteúdo**, cada tarefa diz quem executa por papel, no campo `executor` do `task.json`:
  - `person`: a própria pessoa da tarefa, se ela pode executar; senão, o responsável pela jornada;
  - `owner`: o responsável pela jornada;
  - `family`: a família toda.
- **Quem pode executar** (`canExecute`): você e o cônjuge; filhos e dependentes com **18 anos ou mais hoje**, que **não dependem de ajuda** nas atividades diárias (`health.autonomy` diferente de `help` e `full`) e **não têm representante legal** (`health.legalGuardian` diferente de `yes` e `in_progress`). Sem idade conhecida, não executa. Crianças e adultos incapazes nunca executam: o responsável faz por eles.
- **Responsável pela jornada:** hoje é "você" no questionário. Com as contas, será o dono da jornada.
- **Trocar quem executa:** na tela da tarefa, "Quem faz" lista os adultos que podem executar e "A família toda". Escolher o padrão de novo volta a seguir o conteúdo. Se a pessoa escolhida deixar de poder executar (ex.: a resposta de autonomia mudou), a tarefa volta ao padrão.
- **Onde aparece:** no cartão da tarefa ("Quem faz: …", quando a família tem mais de uma pessoa) e na tela da tarefa. O **filtro por pessoa** mostra as tarefas *para* a pessoa, as que ela *executa* e as da família toda.
- **Formato salvo:** progresso na **versão 3**, com `executors` (chave da tarefa → ID da pessoa ou `family`), com migração das versões 1 e 2. Código em `packages/shared/src/journey/executor.ts`, com testes.
- **Tarefas próprias:** por enquanto, as pessoas marcadas na tarefa própria valem como "para quem" e "quem faz".

## Papéis de acesso (fase do backend)

| Papel | Quantos | Pode |
|---|---|---|
| **Dono** | Um só, quem criou a jornada | Tudo. Não pode ser removido. Pode transferir a jornada para outro admin |
| **Admin** | Um ou mais (ex.: o cônjuge como co-responsável) | Ver e mudar tudo: questionário, meta, orçamento, caminhos. Convidar e remover pessoas. Trocar quem executa |
| **Participante** | Vários | Ver as informações gerais e as tarefas dele. Marcar progresso, subtarefas, Registro e anotações das tarefas que executa. Não muda o questionário, a meta nem as tarefas dos outros |

- **Privacidade dentro da família:** por padrão, o participante **não vê** as respostas de saúde e de dinheiro dos outros. O responsável decide o que compartilhar (LGPD: são dados sensíveis de outras pessoas).
- **Crianças e adultos incapazes não recebem acesso:** o responsável (ou o curador) atualiza por eles.
- **Histórico visível:** "Cônjuge concluiu Conferir o passaporte". É reconhecimento, sem cobrança e sem nada negativo.
- Candidato forte ao **plano pago** (a definir em [comercializacao.md](comercializacao.md)).

## Convite e criação da conta (fase do backend)

1. O dono ou um admin abre "Pessoas da jornada", escolhe **uma pessoa que já está na família** (ex.: "Cônjuge", "Filho 1") e informa **nome e e-mail**. A conta fica ligada àquela pessoa, para o app saber quais tarefas são dela (pode haver dois filhos).
2. O app envia um **e-mail com link** para a pessoa confirmar o e-mail.
3. A pessoa abre o link, **cria a própria senha**, aceita o **aviso legal** e o **uso dos dados dela** por conta própria (o consentimento é dela, não do admin).
4. Pronto: ela entra e vê a jornada conforme o papel.

**Segurança:**
- Link de **uso único e com validade** (ex.: 7 dias). O admin pode reenviar ou cancelar.
- O admin **nunca** escolhe nem vê a senha de ninguém.
- Senha com **Argon2id**, **2FA** opcional, biblioteca de autenticação testada (nunca escrita do zero). Ver a seção Segurança do [CLAUDE.md](../CLAUDE.md#segurança).
- O app **nunca revela se um e-mail já tem conta** (mesma mensagem nos dois casos).
- Limite de tentativas e de envios de convite.
- **Remover acesso:** o admin remove; o participante pode sair. As anotações da pessoa ficam na jornada.

**O que isso exige:** backend, banco de dados, contas e um serviço de envio de e-mail com domínio próprio (custos em [comercializacao.md](comercializacao.md)).

## Pendências

- Uma pessoa em duas jornadas (ex.: o filho adulto que também tem a própria jornada): avaliar depois.
- Definir o que o participante vê do orçamento e dos caminhos de visto.
- Executor nas tarefas próprias (separar "para quem" de "quem faz").
