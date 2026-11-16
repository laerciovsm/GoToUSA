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
- **Questionário completo e detalhado:** precisa deixar muito claro o que a pessoa quer e prever qualquer situação. Exemplos: filho maior de idade com deficiência que depende da pessoa, pai ou mãe idoso que mora junto e vai na mudança, escolaridade, profissão, saúde, finanças.
- **Completo, mas sem excesso:** perguntar só o essencial. O questionário é **adaptativo**, ou seja, as perguntas seguintes dependem das respostas anteriores, para ninguém responder o que não se aplica.
- **Jornada o mais completa e organizada possível:** organizada em fases → etapas → tarefas → subtarefas. Cada tarefa se aplica às pessoas certas da família (titular, cônjuge, filhos, outros dependentes).
- A pessoa pode **editar as respostas depois**, e a jornada é recalculada.
- Detalhes em [docs/questionario.md](docs/questionario.md) e [docs/jornada.md](docs/jornada.md).

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

- **Legalidade:** orientar apenas caminhos legais. Deixar claro que o conteúdo é informativo, **não é aconselhamento jurídico**, e citar fontes oficiais (USCIS, Departamento de Estado etc.) com data da última revisão.
- **Global e multilíngue:** pensado para pessoas de qualquer país, com suporte a vários idiomas desde o início.
- **Privacidade:** coletar o mínimo de dados possível e respeitar a LGPD, o GDPR e a CCPA.
- **Acessível e leve:** pensado primeiro para o celular, funcionando bem em conexões lentas e seguindo boas práticas de acessibilidade (WCAG).
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
│   └── shared/         ← tipos e validações compartilhados
├── docker-compose.yml  ← PostgreSQL + Valkey
├── .env.example
└── CLAUDE.md
```

## Ambiente de desenvolvimento

- Sistema: Windows 11 com PowerShell.
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
- [ ] Escopo do MVP (primeira versão)
- [ ] Questionário inicial (perguntas e regras)
- [ ] Modelo da jornada (fases, etapas e regras de geração)
- [ ] Estratégia de conteúdo (fontes, revisão, idiomas)
- [ ] Wireframes das telas principais
- [ ] Preparação do ambiente e esqueleto do projeto
- [ ] Implementação do MVP
