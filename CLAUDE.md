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
| `pnpm test` | Roda os testes automáticos (Vitest): questionário, traduções completas, motor da jornada e validação do conteúdo |

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
- [x] Questionário inicial (perguntas e regras): **aprovado em 16/11/2026** em [docs/questionario-perguntas.md](docs/questionario-perguntas.md), traduzido para en-US e es
- [ ] Orçamento da mudança: documentado em [docs/orcamento.md](docs/orcamento.md); faltam as fontes oficiais das taxas e as fontes das estimativas
- [ ] Modelo da jornada (fases, etapas e regras de geração)
- [ ] Estratégia de conteúdo (fontes, revisão, idiomas)
- [ ] Wireframes das telas principais
- [x] Preparação do ambiente e esqueleto do projeto (marco 1)
- [ ] Implementação do MVP (marco 1 concluído; marco 2, o questionário, implementado e com os ajustes do primeiro teste do fundador feitos em 16/11/2026, aguardando novo teste no celular)

## Próximos passos (onde paramos)

1. ~~Revisar o questionário~~ (aprovado em 16/11/2026, com o orçamento da mudança incluído).
2. ~~Traduzir o questionário para en-US e es~~ (feito).
3. **Marco 2:** questionário implementado. Primeiro teste do fundador feito em 16/11/2026, com estes ajustes:
   - opção **"Do lar"** na situação de trabalho (você e cônjuge); quem é do lar não vê perguntas de carreira;
   - **sexo** (Masculino/Feminino) de todas as pessoas, nascimento e **situação de trabalho** do cônjuge;
   - **nascimento com mês e ano** para você e o cônjuge (`you.birth`, `partner.birth`, desde 17/11/2026), como já era para filhos e dependentes; quem respondeu só o ano vê o aviso "pergunta nova para responder" no bloco;
   - gravidez só para mulheres de 18 a 55 anos; inglês só para filhos a partir de 3 anos; etapa da escola conforme a idade;
   - opções que só aparecem quando fazem sentido (cônjuge e filho adulto na renda, moradia do empregador, intercâmbio de ensino médio, filial nos EUA);
   - textos que se ajustam ao sexo ("Filha 1", "área dela") nos 3 idiomas;
   - botão para recomeçar o questionário do zero.
   Em 17/11/2026, também implementados: bloco **Seu momento**, **remédios padronizados** (quantidade, unidade e frequência; formato salvo na versão 2, com migração), **equipamentos, especialistas e quem fica no país** como opções e **cidades por estado** (Census Bureau, Vintage 2025).
   Também em 17/11/2026: perguntas de **hobbies, bem-estar, passeios e viagens pelo próprio país** no Bloco 6 ([docs/questionario-perguntas.md](docs/questionario-perguntas.md#hobbies-bem-estar-e-passeios-implementado-em-17112026)).
   Tudo já está no GitHub. **Falta:** o fundador recomeçar o questionário no celular e testar de novo (inclusive se o zoom ao digitar parou); os ajustes entram em novos commits.
   **Pendências do questionário:** capital de cada estado com fonte oficial (.gov de cada estado); profissão e cargo como lista padronizada (avaliar O\*NET).
4. **Marco 3: motor da jornada**, em 5 passos, documentando antes de implementar:
   1. ✅ **Modelo da jornada:** aprovado em 17/11/2026 em [docs/jornada.md](docs/jornada.md#modelo-da-jornada-marco-3-passo-1--aprovado-em-17112026) (três camadas: conteúdo, jornada gerada e progresso; pesos baixo, médio e alto; data de ida conta do dia 1º; prazo vencido vira "prioridade"; nascimento continua com mês e ano).
   2. ✅ **Formato do conteúdo:** aprovado em 17/11/2026 em [docs/jornada.md](docs/jornada.md#formato-do-conteúdo-marco-3-passo-2--aprovado-em-17112026) (uma pasta por tarefa em `content/journey/tasks/`, `task.json` + um Markdown simples por idioma, **3 idiomas obrigatórios desde já**, testes automáticos).
   3. ✅ **Regras de geração:** aprovadas em 17/11/2026 em [docs/jornada.md](docs/jornada.md#regras-de-geração-marco-3-passo-3--aprovado-em-17112026) (condições como dados no `task.json`, fatos calculados em código testado, tarefas **essenciais** entram para todos mesmo sem resposta, o que não se aplica não trava nada, destaque, próximo passo).
   4. ✅ **Cálculo de prazos:** aprovado em 17/11/2026 em [docs/jornada.md](docs/jornada.md#cálculo-de-prazos-marco-3-passo-4--aprovado-em-17112026) (o mês da ida é a **meta**; prazos em mês e ano; Fase 0 com 1 mês a partir do início; conferência de realidade pelo tempo disponível).
   5. ✅ **Perfil da família e caminhos de visto:** aprovado em 17/11/2026 em [docs/caminhos-visto.md](docs/caminhos-visto.md#como-o-motor-gera-o-perfil-e-os-caminhos-marco-3-passo-5--aprovado-em-17112026) (perfil calculado na hora; pontos de atenção = alertas da jornada; caminhos em `content/journey/paths/` com fonte oficial obrigatória; agrupados, sem ranking; avaliação de **cada adulto que vai**; asilo e refúgio fora). Premissa reforçada: todo fato sobre visto vem de fonte oficial, sempre.
   - **Registro nas tarefas** de alinhamento e documentação (anotar o combinado e a situação dos documentos, sem enviar arquivos): [docs/jornada.md](docs/jornada.md#registro-da-tarefa-decisão-do-fundador-em-17112026).
   - ✅ **Implementado em 17/11/2026:** motor em `packages/shared/src/journey/` (ver [docs/jornada.md](docs/jornada.md#implementação-do-motor-marco-3--17112026)), conteúdo de exemplo em `content/journey/` (7 tarefas, 3 idiomas, sem fatos legais) e a pergunta **"pretende trabalhar ou estudar nos EUA?"** para filhos e dependentes adultos (quem vai trabalhar entra no Bloco 11).
   **Próximo:** Marco 5, as telas da jornada, **aprovadas em 17/11/2026** em [docs/telas.md](docs/telas.md) (barra inferior com Hoje · Jornada · Família · Mais; abre em Hoje depois do essencial; trilha simples; recompensa só na tarefa completa). Construção em 6 partes, cada uma testada no celular pelo fundador. **Partes 1 e 2 implementadas em 17/11/2026** (salvamento do progresso, conteúdo no build, telas Jornada e Tarefa em `/journey`, ver [docs/telas.md](docs/telas.md#partes-1-e-2-implementadas-17112026)); testadas pelo fundador. **Parte 4 (Família e Caminho, em `/family`) implementada em 17/11/2026**, antes da parte 3, para mostrar os caminhos de visto; aguardando o teste no celular. **Parte 3 (Hoje, em `/today`) implementada em 17/11/2026**; o app abre em Hoje depois do essencial. O fundador preferiu acumular funções para testar tudo junto. **Parte 5 (mala por tema, carimbos e check-in de fase; progresso salvo na versão 2, com migração) implementada em 17/11/2026.** **Parte 6 (por tema, filtro por pessoa e tarefa própria) implementada em 17/11/2026: Marco 5 concluído**, aguardando o teste acumulado do fundador no celular. **Aba "Mais" com baixar e importar a jornada, ajustes, questionário, idioma e aviso legal, implementada em 17/11/2026** (formato do arquivo em `packages/shared/src/backup.ts`). Pendência de tela: cartão "Novidades". Em paralelo: conteúdo real da Fase 0, sempre a partir de fonte oficial.
   - ✅ **Caminhos de visto (17/11/2026):** 20 caminhos resumidos das páginas do USCIS, nos 3 idiomas, com fonte e data em cada fato, e a tarefa essencial **"Conversar com um advogado de imigração"** ([docs/caminhos-visto.md](docs/caminhos-visto.md#caminhos-publicados-levantamento-de-17112026)). O fundador **não revisa caminho a caminho**: sempre citar a fonte e dizer que o app é apoio à jornada e que o processo legal é conduzido por advogado ou profissional especializado. Aparecem na tela Família. Pendente: lista de países de tratado e instruções da loteria (o site do Departamento de Estado recusa acesso automático).
5. **Anotado para o momento certo:** custos personalizados e custo total aproximado da família ([docs/orcamento.md](docs/orcamento.md#custos-personalizados)).
6. Em paralelo: conteúdo da Fase 0 para o cenário inicial e levantamento das taxas oficiais do orçamento (passaporte no Brasil, vistos, USCIS, impostos e DMV dos estados da lista curta), sempre a partir de fontes oficiais.

## Como trabalhamos

- O fundador costuma pedir para **documentar antes de implementar** ("só documente por enquanto"). Respeitar: não escrever código sem pedido.
- **Funcionalidade primeiro, perfumaria depois:** construir só o que é necessário agora para funcionar; o que não é necessário agora (avatares, animações elaboradas, ilustrações) fica para depois. O design atual (cores, fontes, layout do celular) foi aprovado e continua como está.
- Comunicação em **português do Brasil**, com explicações simples. O fundador está aprendendo Git e desenvolvimento.
- Ao final de cada etapa aprovada: atualizar a documentação, fazer commit e push (`git` em `C:\Program Files\Git\cmd\git.exe` se não estiver no PATH).
- Servidor local para testar no celular: `pnpm build` e depois `pnpm --filter @gotousa/web start -H 0.0.0.0 -p 3000`, acessando `http://<IP-do-PC>:3000` no mesmo Wi-Fi.
