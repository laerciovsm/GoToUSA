# GoToUSA

## Visão geral

O **GoToUSA** é uma aplicação web que acompanha qualquer pessoa, de qualquer país do mundo, na **jornada de preparação para morar nos Estados Unidos**. Funciona como um *companion*: ajuda a pessoa a montar e acompanhar a própria jornada do início ao fim.

## Ideia central (a alma do produto)

> O GoToUSA **não é** um app de vistos. É um **companheiro de jornada** com foco psicológico: ajudar a pessoa a enxergar o todo, ver a própria evolução e decidir pelos motivos certos.

- **Por que as pessoas desistem:** muita gente desiste do que quer porque não tem uma visão organizada do todo e, nas primeiras dificuldades, abandona. O app existe para resolver isso.
- **É uma jornada a ser cumprida:** isso fica claro desde o primeiro momento. A pessoa precisa **querer** de verdade e precisa **enxergar a evolução**.
- **Desistir pelos motivos certos também é sucesso:** se, ao ver o todo, a pessoa concluir "isso não é para mim", "não vale a pena para a minha situação" ou "não quero esse esforço", está tudo bem. Ela decidiu com consciência, e não por desorganização ou medo.
- **Visto, dinheiro e moradia são necessários, mas são consequência.** Antes de tudo isso existe a **preparação**: como juntar o dinheiro, onde morar e por quê, o que a pessoa gosta e não gosta.
- **Preferências pessoais importam:** clima (ex.: quem odeia calor), estilo de vida, tamanho de cidade, rotina. A jornada considera quem a pessoa é, não só os requisitos legais.
- **Quem executa a jornada é a pessoa, não o app.** O app é o guia e companheiro: mostra as tarefas necessárias, apoia, lembra e celebra, mas quem decide e age é sempre a pessoa.
- **Não é orientação jurídica:** o app mostra os **requisitos oficiais impostos pelos EUA** e deixa claro que é um **auxílio à jornada**.
- **Premissas psicológicas** (pequenas vitórias, progresso visível, planos concretos, sem culpa), **elemento lúdico** e **ritmo escolhido pela pessoa** estão detalhados em [docs/jornada.md](docs/jornada.md) e valem para todo o projeto.

### Motivação do projeto
- O fundador quer se mudar para os EUA e será o **primeiro usuário**, validando a ferramenta na própria jornada. Pessoas próximas que têm o mesmo objetivo também vão ajudar a validar.
- O investimento é o tempo do fundador. **Ganhar dinheiro não é o objetivo principal.** Se acontecer, será consequência de um produto que realmente ajuda.

## Visão do produto

### O problema
Muita gente diz "quero ir para os EUA" sem perceber que isso é uma **jornada preparatória** que vai muito além de conseguir o visto certo e fazer tudo dentro da lei. Envolve:
- um idioma novo;
- uma cultura diferente;
- diferenças entre estados e cidades (custo de vida, clima, regras);
- leis, regras e benefícios diferentes dos do país de origem;
- planejamento financeiro, familiar e emocional.

### A proposta
O GoToUSA ajuda a pessoa a **criar a própria jornada** e a evoluir nela, com tudo o que vai precisar organizado.

1. **Questionário inicial:** a pessoa responde perguntas sobre propósito da ida, nível de inglês, se tem filhos, quanto dinheiro (em USD) pretende levar, entre outras informações necessárias.
2. **Tempo nos EUA:** a pessoa escolhe por quanto tempo quer ficar nos EUA, e o app cria a jornada com base nesse tempo.
3. **Jornada personalizada:** a partir das respostas, o app gera as etapas, tarefas e orientações de que a pessoa vai precisar.
4. **Acompanhamento:** a pessoa marca o progresso, adiciona itens e vê a jornada evoluir.

### Conteúdo
- Tipos de visto e como obter cada um (orientação informativa).
- Orientações gerais sobre a vida nos EUA.
- **Foco principal: preparar a pessoa para a mudança**, incluindo idioma, cultura, diferenças regionais, leis, benefícios, finanças e família.

### Questionário e jornada: diretrizes
- **O questionário é o norteador de tudo no app** (decisão de 16/11/2026): jornada, **perfil da família**, **caminhos de visto para conhecer**, orçamento e prioridades saem das respostas. Se uma tela precisa de um dado, ele vira pergunta adaptativa. O app dá o **norte**, nunca assessoria ("vale a pena conhecer este caminho", nunca "você se qualifica"). Referência legal de base: a [INA no USCIS](https://www.uscis.gov/laws-and-policy/legislation/immigration-and-nationality-act). Ver [docs/caminhos-visto.md](docs/caminhos-visto.md).
- **Perfil profissional de você e do cônjuge** (Bloco 11): base dos caminhos por trabalho e por mérito profissional. Quem é **do lar** não vê as perguntas de carreira, só nacionalidade e escolaridade.
- **Sexo: só Masculino e Feminino, como consta no passaporte ou documento** (decisão do fundador em 16/11/2026: é o que vale para visto e processos, não a identidade de gênero). É perguntado para todas as pessoas da família e serve para mostrar só o que se aplica (ex.: gravidez só para mulheres de 18 a 55 anos) e para ajustar os textos ("Filha 1", "área dela").
- **Seu momento** (Bloco 12, decisão de 17/11/2026): poucas perguntas opcionais sobre a **situação de vida** (momento atual, eventos recentes, decisão, apoio do cônjuge e da família), sem escalas clínicas e sem nota. Servem só para ajustar o ritmo e o começo da jornada.
- **Digitar o mínimo e padronizar** (decisão de 17/11/2026): sempre que possível, opções para escolher em vez de texto livre (remédios com quantidade, unidade e frequência; equipamentos; especialistas; quem fica no país; cidades). Texto livre só no "porquê", em apelidos e no "Outro".
- **Cidades de destino por estado:** as 3 maiores em destaque e busca pelas demais, com dados oficiais do U.S. Census Bureau. A **capital com selo** está aprovada, mas pendente de fonte oficial (ver [docs/questionario-perguntas.md](docs/questionario-perguntas.md#cidades-dos-eua-fonte-e-capitais)).
- **Lógica sem perguntas absurdas:** perguntas e opções só aparecem quando fazem sentido para aquela pessoa (ex.: inglês só para filhos a partir de 3 anos, etapa da escola conforme a idade, "Filho(a) adulto(a)" só se houver filho adulto). Ao criar perguntas, sempre pensar nesses casos.
- **Questionário completo e detalhado:** precisa deixar muito claro o que a pessoa quer e prever qualquer situação. Exemplos: filho maior de idade com deficiência que depende da pessoa, pai ou mãe idoso que mora junto e vai na mudança, escolaridade, profissão, saúde, finanças.
- **Completo, mas sem excesso:** perguntar só o essencial. O questionário é **adaptativo**, ou seja, as perguntas seguintes dependem das respostas anteriores, para ninguém responder o que não se aplica.
- **Jornada o mais completa e organizada possível:** organizada em fases → etapas → tarefas → subtarefas. Cada tarefa se aplica às pessoas certas da família (titular, cônjuge, filhos, outros dependentes).
- A pessoa pode **editar as respostas depois**, e a jornada é recalculada.
- Detalhes em [docs/questionario.md](docs/questionario.md) e [docs/jornada.md](docs/jornada.md).
- Conteúdo, atualização legal, regras de linguagem, perfil dos estados e cruzamento de saúde: [docs/conteudo.md](docs/conteudo.md).
- Escopo da primeira versão: [docs/mvp.md](docs/mvp.md).
- Orçamento da mudança (custos até a mudança, custo mensal nos EUA com impostos e taxas do estado, renda × despesas): [docs/orcamento.md](docs/orcamento.md).
- Identidade visual, paleta e lúdico (trilha da família, mala da prontidão, carimbos): [docs/design.md](docs/design.md).
- Telas da jornada (Marco 5): [docs/telas.md](docs/telas.md).
- Acesso compartilhado (quem executa, papéis dono/admin/participante, convite por e-mail): [docs/acesso-compartilhado.md](docs/acesso-compartilhado.md).
- Checklist para quando for comercializar (custos, simulação de custo da IA, empresa, jurídico): [docs/comercializacao.md](docs/comercializacao.md).

### Funcionalidades decididas
- **Aviso legal com aceite obrigatório:** antes de começar, a pessoa lê e **aceita** que o app não dá orientação jurídica, apenas apresenta requisitos oficiais e é um auxílio à jornada.
- **Indicador de progresso** ao longo da jornada (detalhes em [docs/jornada.md](docs/jornada.md)).
- **Recompensas** ao concluir tarefas e marcos.
- **Baixar e importar a jornada:** no modo gratuito (dados só no navegador), a pessoa pode baixar um arquivo com a jornada e importá-lo depois, em outro aparelho ou ao criar a conta.

### Fora do escopo (por enquanto)
- **Não** executar nem dar entrada em processos de visto.
- **Não** coletar documentos, como passaporte e certidões.
- **Não** coletar dados pessoais sensíveis. As respostas do questionário servem apenas para montar a jornada.
- **Não** dar aconselhamento jurídico.
- **Não** tratar de asilo e refúgio: não é o objetivo do app (decisão de 17/11/2026).

## Modelo de negócio (freemium)

- **Grátis, sem cadastro:** a pessoa responde o questionário e vê a jornada sugerida. Tudo fica salvo **no navegador** (IndexedDB), sem dados no servidor. O app avisa que limpar o navegador apaga os dados e oferece **baixar a jornada** para importar depois.
- **Momento de criar a conta:** depois de ver a jornada, a pessoa cria a conta para continuar. A jornada salva no navegador é **transferida para a conta**, sem perder nada.
- **Pago, com conta:** **plano anual com valor fixo**, porque ninguém planeja e executa uma mudança dessas em 6 meses. O valor ainda será definido.
- **Pagamento por um Merchant of Record** (ex.: Paddle): a plataforma vende em nosso nome e cuida de **todos os impostos de cada país**. Não há mensalidade, apenas um percentual por venda.
- **Nunca** armazenamos dados de cartão. O sistema só recebe a confirmação de pagamento da plataforma.
- O que fica no plano grátis e o que fica no pago ainda será definido.

## Internacionalização (todos os idiomas)

A ferramenta deve estar preparada para **qualquer idioma** desde o primeiro dia:
- **Nenhum texto fixo no código:** tudo vem de arquivos de tradução.
- Suporte a idiomas escritos **da direita para a esquerda** (árabe, hebraico, persa, urdu), com layout espelhado.
- Regras de **plural e gênero** de cada idioma (formato ICU MessageFormat).
- Datas, números e moedas formatados conforme o idioma e o país do usuário.
- Fontes que cubram todos os alfabetos (latino, cirílico, árabe, chinês, japonês, coreano, devanágari etc.).
- Layout que aguenta textos mais longos (o alemão chega a ser 30% maior que o inglês).
- Sem texto dentro de imagens.
- **Idiomas do lançamento:** inglês (`en-US`), português (`pt-BR`) e espanhol (`es`).
- Idioma reserva (*fallback*): inglês.
- Termos oficiais americanos (Green Card, SSN, USCIS) mantidos em inglês, com explicação no idioma do usuário.
- O conteúdo da jornada também é traduzível, não só a interface.

## Princípios

- **Só informação oficial e verificada (premissa inegociável):** nada é inventado. Todo fato do conteúdo tem fonte oficial e data de verificação. Conhecimento de memória, inclusive da IA, não é fonte. Detalhes em [docs/conteudo.md](docs/conteudo.md#premissa-só-informação-oficial-e-verificada).
- **Atualização automática do conteúdo, sem revisão humana:** detecção de mudanças nas fontes, resumo por IA, verificações automáticas e publicação com aviso padrão e link da fonte na íntegra. O projeto não depende de pessoas revisando nem da assinatura do Claude Code.
- **O preço de venda precisa pagar os custos de operação (incluindo a IA por uso) e dar margem.**
- **Somente dentro da lei americana (premissa inegociável):** toda e qualquer sugestão, tarefa, dica ou conteúdo do app precisa estar **dentro da lei dos EUA**. Nada de trabalho sem autorização ("bico" ilegal), atalhos ou jeitinhos. Quando um tema tem risco legal (ex.: trabalho, permanência, status), o app explica a regra geral com fonte oficial e alerta para as consequências de descumpri-la.
- **Positivo, mas sempre baseado em fatos (premissa):** nada negativo na jornada (sem "atrasada", "falhou" ou vermelho de erro). O que precisa de atenção aparece de forma positiva, com ajuda para se reorganizar. **Mas positivo nunca esconde risco:** o app se baseia nos fatos, deixa claro quando algo não vai bem e explica as consequências, com fonte oficial. Não "passa a mão na cabeça" de quem não faz a sua parte. Detalhes em [docs/jornada.md](docs/jornada.md#premissas-psicológicas).
- **Fácil de usar, user friendly (premissa):** tudo simples e visual: nomes fáceis (ex.: peso baixo, médio, alto), poucas decisões por vez, botões grandes, linguagem do dia a dia.
- **Legalidade:** orientar apenas caminhos legais. Deixar claro que o conteúdo é informativo, **não é aconselhamento jurídico**, e citar fontes oficiais (USCIS, Departamento de Estado etc.) com data da última revisão.
- **Global e multilíngue:** pensado para pessoas de qualquer país, com suporte a vários idiomas desde o início.
- **Privacidade:** coletar o mínimo de dados possível e respeitar a LGPD, o GDPR e a CCPA.
- **Só web, celular primeiro (premissa):** **não** haverá app nativo para Android ou iOS. Quem quiser usa pelo navegador do celular. Todo o desenvolvimento parte da tela do celular e depois se adapta a telas maiores:
  - layout pensado primeiro para telas a partir de ~360px de largura;
  - áreas de toque com no mínimo 44×44px e nada que dependa de passar o mouse por cima (*hover*);
  - leve e rápido em conexões móveis lentas (páginas estáticas, poucas imagens, pouco JavaScript);
  - respeitar as áreas seguras da tela (entalhe/"notch" e barras do sistema);
  - testar sempre na largura de celular, além do computador.
  - campos de digitação e seleção com letra de **no mínimo 16px** (regra global em `globals.css`), para o iPhone não dar zoom ao tocar no campo. Nunca bloquear o zoom manual (`maximum-scale=1`), por acessibilidade.
  - Depois do MVP, a aplicação vira **PWA**: a pessoa pode "instalar" o site na tela inicial do celular, com ícone próprio e funcionamento offline, sem passar por loja de aplicativos.
- **Acessível:** seguindo boas práticas de acessibilidade (WCAG).
- **Segurança em primeiro lugar** (ver seção Segurança).
- **Custo zero no desenvolvimento:** todas as ferramentas são gratuitas e têm licenças que permitem uso comercial.

## Stack tecnológica

| Camada | Tecnologia | Licença |
|---|---|---|
| Linguagem | TypeScript no Node.js LTS | MIT / Apache 2.0 |
| Frontend | Next.js (React) | MIT |
| Visual | Tailwind CSS + shadcn/ui | MIT |
| Backend (API) | NestJS | MIT |
| Banco de dados | PostgreSQL | PostgreSQL (permissiva) |
| Acesso ao banco (ORM) | Prisma | Apache 2.0 |
| Cache e sessões | Valkey (substituto gratuito do Redis) | BSD |
| Validação | Zod (regras compartilhadas entre front e back) | MIT |
| Idiomas (i18n) | next-intl | MIT |
| Testes | Vitest (unitários) + Playwright (navegador) | MIT / Apache 2.0 |
| Ambiente local | Docker Compose | Apache 2.0 |
| Gerenciador de pacotes | pnpm (workspaces / monorepo) | MIT |

> **Docker Desktop:** gratuito apenas para uso pessoal e empresas pequenas (menos de 250 funcionários e menos de US$ 10 mi de faturamento). Alternativas 100% gratuitas: Rancher Desktop ou Podman.

## Segurança

- Guia de referência: **OWASP Top 10**.
- Senhas com hash **Argon2id** e suporte a 2FA. Autenticação com biblioteca testada, nunca escrita do zero.
- API com limite de requisições, Helmet (cabeçalhos de segurança), proteção CSRF, CORS restrito e validação de toda entrada com Zod.
- Dados sensíveis (se um dia forem coletados) criptografados no banco.
- Segredos em `.env`, **nunca** versionados. Manter um `.env.example` sem valores reais.
- HTTPS também no ambiente local (`mkcert`).
- Verificações automáticas: Dependabot, Trivy, Gitleaks e Semgrep. O CodeQL do GitHub só é gratuito em repositórios públicos.

## Estrutura planejada

```
GoToUSA/
├── apps/
│   ├── web/            ← frontend (Next.js)
│   └── api/            ← backend (NestJS)
├── packages/
│   └── shared/         ← tipos, validações e motor da jornada (compartilhados)
├── content/            ← conteúdo da jornada (MDX/JSON), versionado no Git
├── docs/               ← documentação do produto
├── docker-compose.yml  ← PostgreSQL + Valkey (após o MVP)
├── .env.example
└── CLAUDE.md
```

## Como rodar

Na raiz do repositório:

| Comando | O que faz |
|---|---|
| `pnpm install` | Instala as dependências de todo o monorepo |
| `pnpm dev` | Servidor de desenvolvimento em http://localhost:3000 |
| `pnpm build` | Gera a versão de produção |
| `pnpm start` | Roda a versão de produção (depois do build) |
| `pnpm lint` | Verifica o código (ESLint) |
| `pnpm typecheck` | Verifica os tipos (TypeScript) |
| `pnpm test` | Roda os testes automáticos (Vitest): questionário, traduções completas (questionário e interface), motor da jornada, caminhos de visto, validação do conteúdo, progresso e baixar/importar |

### Convenções do código
- **Next.js 16** (App Router): o antigo `middleware.ts` agora se chama `proxy.ts`. Antes de escrever código Next.js, consultar os guias em `apps/web/node_modules/next/dist/docs/` (ver `apps/web/AGENTS.md`), porque a versão tem mudanças em relação ao que é comum na internet.
- **Idiomas:** rotas em `apps/web/src/app/[locale]/`. O idioma vem de `next/root-params`. Textos da interface ficam em `apps/web/messages/<idioma>.json`; **nenhum texto fixo no código**. A lista de idiomas fica em `packages/shared/src/i18n.ts`.
- **Cores:** usar os tokens da paleta (`bg-surface`, `text-ink`, `bg-primary`, `bg-action`, `text-done` etc.), definidos em `apps/web/src/app/globals.css`. Nunca cores soltas.
- **Direção do texto:** usar propriedades lógicas (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) para funcionar em idiomas da direita para a esquerda.
- **Regras compartilhadas** (tipos, validações, motor da jornada) ficam em `packages/shared`, nunca presas ao frontend.
- **Questionário:** perguntas, opções e condições em `packages/shared/src/questionnaire/definition.ts` (IDs estáveis, nunca renomear). Textos em `apps/web/messages/questionnaire/<idioma>.json`, na chave igual ao ID. Ao criar uma pergunta, adicione os textos nos 3 idiomas; o teste `messages.test.ts` falha se faltar algum.
  - `when`: condição para a pergunta aparecer. `optionWhen`: condição para cada opção aparecer (aplicada por `visibleOptions`).
  - Bloco sem nenhuma pergunta visível não aparece na lista (`blockApplies`).
  - **Textos com gênero:** usar `{sex, select, male {…} female {…} other {…}}` (ICU). Variáveis em todo texto de pergunta, calculadas por `textSexValues`: `sex` (pessoa da vez; cônjuge nas perguntas `partner.*`; senão você), `partnerSex` e `adultChildSex`. O `other` é a forma neutra com "(a)".
  - Na tela do questionário há o botão **"Recomeçar o questionário do zero"** (apaga as respostas do navegador, com confirmação).
  - **Formato salvo com versão** (`schemaVersion`, hoje 2). Ao mudar o formato, criar a migração em `packages/shared/src/questionnaire/schema.ts` para não perder dados de quem já respondeu.
  - Para trocar o **tipo** de uma pergunta (ex.: de texto para opções), criar um **ID novo** e retirar o antigo; nunca reaproveitar o ID com outro formato.
  - **Cidades dos EUA:** `pnpm data:cities` gera `apps/web/public/data/us-cities/<UF>.json` a partir do arquivo oficial do Census (`scripts/build-us-cities.mjs`).
- **Armazenamento:** as telas usam só os repositórios de `apps/web/src/lib/storage/` (hoje IndexedDB; depois, a API). Todo dado lido passa pela validação Zod de `packages/shared`.
- **UUID:** usar `uuid()` de `@gotousa/shared`, que funciona também sem HTTPS (teste no celular pela rede local).
- **Jornada:** motor em `packages/shared/src/journey/`; conteúdo em `content/journey/` (uma pasta por tarefa: `task.json` + `pt-BR.md`, `en-US.md`, `es.md`). Ao criar uma tarefa, escreva os 3 idiomas e rode `pnpm test`: o teste `content.test.ts` bloqueia conteúdo com problema. Fato legal, prazo oficial ou taxa só com fonte oficial em `sources` e citado no texto com `[[fonte:id]]`.
- **Telas:** `apps/web/src/app/[locale]/{today,journey,family,more}/page.tsx` (rotas) e `apps/web/src/components/{today,journey,family,more}/`. As telas da jornada usam `JourneyGate` (carrega respostas e progresso, mostra carregando/erro/convite ao questionário) e guardam o estado na URL (`?task=`, `?phase=`, `?view=theme`, `?person=`, `?new=1`, `?own=`, `?path=`), para o "voltar" do celular funcionar. Fontes oficiais sempre pelo componente fixo `official-sources.tsx`; Markdown do conteúdo só por `simple-markdown.tsx` (seguro, sem HTML).
- **Progresso salvo na versão 3** (v2: `checkins`, `pausedAt`, `endedAt`; v3: `executors`), com migração das versões 1 e 2 em `parseProgress`. Ao mudar o formato, nova versão com migração, como no questionário.
- **Quem executa:** todo `task.json` tem `executor` (`person`, `owner` ou `family`), por papel, nunca por nome. Regras em `packages/shared/src/journey/executor.ts` (`canExecute`, `defaultExecutor`, `executorOptions`, `setTaskExecutor`). Ver [docs/acesso-compartilhado.md](docs/acesso-compartilhado.md).
- **Baixar e importar:** formato em `packages/shared/src/backup.ts` (`createBackup`, `parseBackup`): só respostas e progresso, validados por Zod e pelas migrações, limite de 2 MB. Ao criar um dado novo salvo no navegador, incluí-lo no arquivo.
- **Condições do conteúdo:** além de `q` (família) e `p` (pessoa da vez), `w` lê a resposta de carreira do adulto da vez (`you.<w>` para você, `career.<w>` para os outros); em respostas de várias escolhas, `gte`/`lte` contam os itens marcados.
- **Telas da jornada:** `apps/web/src/components/journey/`. O conteúdo chega pelo servidor no build (`apps/web/src/lib/journey/content.ts`, que importa `@gotousa/shared/node`; nunca importar isso em componente do navegador). Mudanças no progresso só pelas funções de `packages/shared/src/journey/progress.ts`. Textos da interface em `apps/web/messages/<idioma>.json`; o teste `ui-messages.test.ts` falha se um idioma tiver chaves diferentes do pt-BR.

## Ambiente de desenvolvimento

- Sistema: Windows 11 com PowerShell.
- Node.js 26 LTS e pnpm 12. Se `node`/`pnpm` não forem reconhecidos num terminal aberto antes da instalação, reinicie o terminal.
- Por enquanto, apenas servidor local (nada publicado na web).
- Git instalado em `C:\Program Files\Git\cmd\git.exe`. Se `git` não for reconhecido no terminal, use o caminho completo.
- GitHub CLI instalado em `C:\Program Files\GitHub CLI\gh.exe` (sem login no ambiente do Claude Code). O push funciona pela credencial salva no Windows.

## Repositório

- GitHub (privado): https://github.com/laerciovsm/GoToUSA
- Branch principal: `main`

## Status

- [x] Visão do produto definida
- [x] Stack tecnológica definida
- [x] Modelo de negócio (freemium, plano anual) definido
- [ ] Valor do plano anual e divisão entre grátis e pago
- [x] Escopo do MVP: sem backend (preparado para ele), cenário inicial definido. Ver [docs/mvp.md](docs/mvp.md)
- [x] Questionário inicial: **aprovado em 16/11/2026** ([docs/questionario-perguntas.md](docs/questionario-perguntas.md)), nos 3 idiomas
- [ ] Orçamento da mudança: documentado em [docs/orcamento.md](docs/orcamento.md); faltam as fontes oficiais das taxas e das estimativas
- [x] Modelo da jornada (fases, etapas, regras de geração, prazos, perfil e caminhos): **aprovado em 17/11/2026** ([docs/jornada.md](docs/jornada.md), [docs/caminhos-visto.md](docs/caminhos-visto.md))
- [x] Estratégia de conteúdo (só fonte oficial, 3 idiomas, aviso padrão): [docs/conteudo.md](docs/conteudo.md)
- [x] Telas da jornada: **aprovadas em 17/11/2026** ([docs/telas.md](docs/telas.md))
- [x] Marco 1: ambiente e esqueleto do projeto
- [x] Marco 2: questionário (com os ajustes dos testes do fundador)
- [x] Marco 3: motor da jornada
- [x] Caminhos de visto: 20 caminhos das fontes oficiais do USCIS
- [x] Marco 5: telas da jornada (Hoje, Jornada, Tarefa, Família, Caminho, check-in, tarefa própria) e aba Mais (baixar e importar)
- [ ] **Teste acumulado do fundador no celular** (em andamento, 17/11/2026)
- [ ] Conteúdo real da jornada além das tarefas de exemplo (Fase 0 em diante), sempre com fonte oficial
- [ ] Publicação sem backend, para os colegas do fundador usarem
- [x] Quem executa cada tarefa (por papel), implementado em 19/11/2026
- [ ] Backend com conta e acesso compartilhado da família (depois do MVP; desenho em [docs/acesso-compartilhado.md](docs/acesso-compartilhado.md))

## Onde paramos (17/11/2026)

O app já funciona de ponta a ponta no navegador do celular, **sem backend**: aviso legal → questionário → jornada com telas → caminhos de visto → baixar e importar. Tudo está no GitHub. **O fundador está fazendo o teste acumulado no celular** e vai mandar os ajustes de uma vez; corrigir em lote.

### O que existe hoje

**Questionário** (Marco 2, `/questionnaire`, aberto pela aba Mais)
- 13 blocos (parte essencial de ~10 minutos + blocos para completar), adaptativo, nos 3 idiomas, com textos que mudam com o sexo (`select` do ICU).
- Ajustes dos testes do fundador (16 e 17/11/2026): "Do lar" sem perguntas de carreira; sexo só M/F (como no passaporte) para todos; gravidez só para mulheres de 18 a 55 anos; inglês só para filhos a partir de 3 anos; escola conforme a idade; opções que só aparecem quando fazem sentido; botão "Recomeçar do zero"; bloco **Seu momento**; remédios padronizados (quantidade, unidade, frequência); equipamentos, especialistas e quem fica no país como opções; **cidades por estado** (Census Bureau, Vintage 2025); hobbies, bem-estar, passeios e viagens; pergunta "pretende trabalhar ou estudar?" para filhos e dependentes adultos (quem vai trabalhar entra no Bloco 11).
- **Nascimento com mês e ano** para você e o cônjuge (`you.birth`, `partner.birth`), como já era para filhos e dependentes. Quem respondeu só o ano antes vê "pergunta nova para responder" no bloco; até lá, o ano antigo continua valendo.
- Atalho `/questionnaire?block=<id>` abre um bloco direto (usado por "Mudar resposta").
- Campos com letra de 16px para o iPhone não dar zoom (falta o fundador confirmar).

**Motor da jornada** (Marco 3, `packages/shared/src/journey/`)
- Três camadas: conteúdo (`content/journey`), jornada gerada (calculada na hora) e progresso (salvo no navegador). Condições como dados, fatos calculados, essenciais entram mesmo sem resposta, prazos pela meta (mês da ida), prioridade sem nada negativo, conferência de realidade, prontidão com pesos baixo/médio/alto, caminhos avaliados por adulto.
- Conteúdo de exemplo: 10 tarefas nos 3 idiomas (conversar em família, conhecer os caminhos, **conversar com um advogado de imigração**, definir a data de ida, orçamento, plano de inglês, plano de cuidados, conferir passaporte, **representação legal para o passaporte e o visto**, **pedir a curatela, com um advogado**). Têm fato com fonte a tarefa do advogado (USCIS), a de representação legal e a de curatela; as outras não têm fato legal.
- **Representação legal** (ajuste do teste do fundador, 17/11/2026): aparece para filho ou dependente com 18 anos ou mais (hoje ou na ida) que não é independente no dia a dia. Fontes: Estatuto da Pessoa com Deficiência e Código Civil (Planalto), IN 173/2020 e dúvidas da Polícia Federal, 9 FAM 403.2 e 504.7 (Departamento de Estado) e Policy Manual do USCIS. Pontos-chave: maioridade no Brasil aos 18; a deficiência sozinha não tira a capacidade; curatela é extraordinária e não é exigida para emitir documentos; com curador, a PF pede o consentimento dele ou autorização judicial; nos EUA, o responsável legal só vale se nomeado por tribunal ou autoridade.
- **Curatela** (ajuste do teste do fundador, 17/11/2026): pergunta nova `health.legalGuardian` (adulto na ida que não é independente: já tem representante legal nomeado pela Justiça?). Com "Não" ou "Não sei", entra a tarefa **Pedir a curatela, com um advogado** (filho adulto com deficiência ou pai/avô idoso), com Código Civil (arts. 4º, 1.767, 1.775, 1.775-A, 1.783-A), Código de Processo Civil (arts. 747 a 758, texto do portal da Câmara, porque o Planalto recusa o download automático do CPC), Estatuto da Pessoa com Deficiência e IN 173 da PF. A tarefa de representação legal ganhou o caso de quem não consegue expressar a vontade e a subtarefa "confirmar com a PF, antes de agendar, o que o curador leva e assina" (as páginas da PF não têm passo a passo para esse caso).

**Caminhos de visto** (`content/journey/paths/`, [docs/caminhos-visto.md](docs/caminhos-visto.md#caminhos-publicados-levantamento-de-17112026))
- 20 caminhos resumidos das páginas do **USCIS** (conferidas em 17/11/2026): EB-1 (3), EB-2, EB-2 NIW, EB-3, H-1B, L-1, O-1, EB-5, E-2, TN, E-3, H-1B1, parente imediato, preferência familiar, K-1, F-1/M-1, J-1 e loteria. Cada fato com a fonte; "Links oficiais para consultar" do Departamento de Estado (os mesmos que o USCIS indica) onde a página não pôde ser lida.
- **O fundador não revisa caminho a caminho** (decisão de 17/11/2026): dar toda a informação oficial possível, sempre com a fonte e sempre dizendo que o app é apoio à jornada e que o processo legal é conduzido por advogado ou profissional especializado.
- Limites: o site do Departamento de Estado recusa acesso automático (lista de países com tratado E-1/E-2 e instruções anuais da loteria não usadas como dado; o texto manda conferir); E-1 fora (o questionário não pergunta sobre comércio); aposentadoria sem caminho (sem categoria específica nas páginas oficiais).

**Telas** (Marco 5, [docs/telas.md](docs/telas.md)), barra inferior com **Hoje · Jornada · Família · Mais**
- **Abertura:** com o aviso aceito e o essencial concluído, a tela inicial leva direto para Hoje.
- **Hoje** (`/today`): meta e meses que faltam; um único próximo passo e "mais passos desta semana" (conforme as horas escolhidas); cartões de tempo apertado, prioridades, blocos que faltam, data que já passou e o seu porquê; mala da prontidão com "ver por tema"; **check-in** ao fim de cada fase (Continuar · Ajustar o plano · Pausar · Encerrar) e cartão de jornada pausada ou encerrada com "Retomar".
- **Jornada** (`/journey`): atalho para os caminhos; **Por fase · Por tema**; filtro por pessoa; carimbos do passaporte; trilha das fases; etapas com "x de y"; selos Prioridade, Destaque e Aguardando; **tarefa própria** (`?new=1`, `?own=<id>`).
- **Tarefa** (`/journey?task=<chave>`): por que importa, passos, passo a passo, fontes com o aviso padrão, "Quando e onde?", **Registro** (combinado, documentos ou anotações), anotação pessoal, Comecei · Concluí · Não se aplica (tudo desfazível), comemoração só na tarefa completa (com a recompensa escolhida) e convite para o check-in ao fechar a fase.
- **Família** (`/family`): quem vai (idade hoje e na meta), perfil profissional, cuidados, dinheiro (dica de renda única), preferências, pontos de atenção e **caminhos para conhecer** (agrupados, sem ranking, "aparece por"); cada seção com "Mudar resposta".
- **Caminho** (`/family?path=<id>`): por que apareceu (por pessoa), requisitos com fonte, caixa fixa "Converse com um advogado de imigração", o que fazer agora e o aviso padrão.
- **Mais** (`/more`): **baixar a jornada** (arquivo .json, sem documentos nem senhas, com aviso de privacidade) e **importar** (validação completa, resumo e confirmação); ajustes (meta, data de chegada real, prazo da Descoberta); questionário; idioma; aviso legal. A tela inicial tem "Já tem uma jornada baixada? Importe aqui".

### Para o teste do fundador (17/11/2026)
1. Abrir http://<IP-do-PC>:3000 e conferir se vai direto para **Hoje**.
2. Questionário (aba Mais): responder as 2 perguntas novas de nascimento; conferir se o zoom ao digitar parou.
3. **Família:** idades e caminhos de visto (abrir um caminho).
4. **Jornada:** carimbos, Por fase/Por tema, filtro por pessoa, abrir e concluir uma tarefa (passos, Registro, comemoração), criar uma tarefa própria, concluir a Descoberta para ver o check-in.
5. **Mais:** baixar a jornada e importar em outro navegador.

### Próximos passos
1. **Corrigir em lote** o que o fundador encontrar no teste.
2. **Publicar sem backend** para os colegas do fundador (decisão de 17/11/2026: seguir só com o navegador, sem login nem banco, por ser o mais seguro). Documentar antes de implementar: hospedagem gratuita que permita esse uso (conferir os termos), cabeçalhos de segurança completos (CSP), página de privacidade explicando que nada sai do aparelho, verificações automáticas no GitHub (Dependabot, Gitleaks), aviso de que o conteúdo ainda é pouco.
3. **Conteúdo real da jornada** (Fase 0 em diante), sempre a partir de fonte oficial, e as taxas oficiais do orçamento.
4. Pendências menores: cartão "Novidades" (precisa guardar o que a pessoa já viu); capital de cada estado com fonte .gov; profissão e cargo como lista padronizada (avaliar O\*NET); lista de países com tratado e instruções da loteria por uma fonte oficial legível (ex.: Federal Register, 9 FAM).
5. **Depois do MVP:** backend com conta (login seguro, Argon2id, 2FA, banco criptografado, transferência da jornada do navegador para a conta) e **acesso compartilhado da família** (dono, admins e participantes, convite por e-mail; [docs/acesso-compartilhado.md](docs/acesso-compartilhado.md)), PWA, custos personalizados da família ([docs/orcamento.md](docs/orcamento.md#custos-personalizados)).

### Histórico das decisões e etapas
- **16/11/2026:** questionário aprovado e traduzido; primeiro teste do fundador e ajustes; questionário como norte de tudo; sexo M/F como no passaporte.
- **17/11/2026:** Marco 3 em 5 passos aprovados e implementados (modelo, formato do conteúdo, regras, prazos, perfil e caminhos); premissas reforçadas (só fonte oficial; positivo, mas baseado em fatos; fácil de usar; 3 idiomas sempre); registro nas tarefas; asilo e refúgio fora do app; telas aprovadas (funcionalidade primeiro, perfumaria depois; recompensa só na tarefa completa); Marco 5 implementado em 6 partes; 20 caminhos de visto do USCIS; nascimento com mês e ano; aba Mais com baixar e importar.
- **19/11/2026:** ajustes do teste do fundador (representação legal e curatela, com fontes do Brasil e dos EUA); decisão do acesso compartilhado da família (papéis por tipo de pessoa e de acesso, convite por e-mail, só com o backend); **quem executa** implementado (progresso versão 3).

## Como trabalhamos

- O fundador costuma pedir para **documentar antes de implementar** ("só documente por enquanto"). Respeitar: não escrever código sem pedido.
- **Funcionalidade primeiro, perfumaria depois:** construir só o que é necessário agora para funcionar; o que não é necessário agora (avatares, animações elaboradas, ilustrações) fica para depois. O design atual (cores, fontes, layout do celular) foi aprovado e continua como está.
- Comunicação em **português do Brasil**, com explicações simples. O fundador está aprendendo Git e desenvolvimento.
- Ao final de cada etapa aprovada: atualizar a documentação, fazer commit e push (`git` em `C:\Program Files\Git\cmd\git.exe` se não estiver no PATH).
- Servidor local para testar no celular: `pnpm build` e depois `pnpm --filter @gotousa/web start -H 0.0.0.0 -p 3000`, acessando `http://<IP-do-PC>:3000` no mesmo Wi-Fi.
