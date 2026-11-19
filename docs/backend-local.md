# Backend local (fase de testes com a família)

> Decisão do fundador em 19/11/2026: montar backend, banco de dados, contas e e-mail **tudo no PC do fundador**, sem publicar nada na web, para testar com a família **na mesma rede Wi-Fi**. **Só HTTP durante esta fase** (decisão do fundador). Documentado antes de implementar.

## Objetivo

Validar com a família o **acesso compartilhado** ([acesso-compartilhado.md](acesso-compartilhado.md)): o responsável cria a conta, convida as pessoas por e-mail, cada uma entra no próprio celular, vê a jornada, faz a sua parte e atualiza o app.

- **O modo gratuito sem conta continua funcionando** como hoje (tudo no navegador). A conta é uma opção a mais.
- Nada fica acessível pela internet: só pela rede de casa.

## Visão geral

```
Celulares da família (mesmo Wi-Fi)
        │  http://192.168.0.6:3000
        ▼
┌──────────────────── PC do fundador ────────────────────┐
│  App web (Next.js) :3000  ── /api/* ──►  API (NestJS) :4000 │
│                                              │          │
│                         PostgreSQL :5432 ◄───┤          │
│                         Mailpit :1025/:8025 ◄┤ (testes) │
│                         Gmail (SMTP) ◄───────┘ (família)│
└────────────────────────────────────────────────────────┘
```

- **Uma única porta aberta na rede: 3000** (o app). O app repassa `/api/*` para a API (recurso *rewrites* do Next.js). Assim, para o navegador, app e API são o mesmo endereço: **sem CORS** e o cookie de sessão fica só nesse endereço.
- **API, banco e Mailpit escutam só no próprio PC** (`127.0.0.1`), nunca na rede.
- O **PC precisa estar ligado** para a família usar.

## Componentes

| Peça | Ferramenta | Licença | Observação |
|---|---|---|---|
| API | NestJS (já na stack) | MIT | `apps/api` (hoje só tem o README) |
| Banco | PostgreSQL (imagem oficial) | PostgreSQL | Pelo Docker Compose |
| Acesso ao banco | Prisma (já na stack) | Apache 2.0 | Migrações versionadas no Git |
| Autenticação | **Better Auth** | MIT | Ver abaixo |
| Hash de senha | **Argon2id** (exigência do CLAUDE.md) | — | Better Auth usa scrypt por padrão; trocamos pelo Argon2id com as opções `password.hash` e `password.verify` |
| E-mail | **Nodemailer** | MIT No Attribution | Envio por SMTP |
| E-mail de teste | **Mailpit** | MIT | Captura os e-mails sem enviar; tela em `http://localhost:8025` |
| E-mail real (família) | **Gmail** com **senha de app** | — | Ver abaixo |
| Validação | Zod de `packages/shared` | MIT | O mesmo código do navegador |
| Cache (Valkey) | **Fica de fora nesta fase** | — | Sessões e limites de tentativas cabem no PostgreSQL. Entra quando for necessário |

### Por que Better Auth

- Biblioteca de autenticação **pronta e testada** (premissa: nunca escrever autenticação do zero), MIT, muito usada (cerca de 30 mil estrelas no GitHub em 19/11/2026).
- Já traz o que o desenho do acesso compartilhado precisa:
  - **e-mail e senha** com **confirmação de e-mail** (`requireEmailVerification`) e **recuperação de senha**;
  - senha de **8 a 128 caracteres** por padrão;
  - **plugin de organização**: cada **jornada é uma organização**, com os papéis **owner, admin e member**, que são os nossos **dono, admin e participante**;
  - **convites por e-mail** com validade (padrão de 48 horas, configurável em `invitationExpiresIn`; vamos usar 7 dias);
  - **controle de acesso** com permissões próprias (`createAccessControl`);
  - **2FA** por plugin (fica para antes da publicação).
- Fontes: documentação oficial do Better Auth (plugin de organização e e-mail e senha) e o repositório no GitHub, conferidos em 19/11/2026.
- **Integração com o NestJS:** o pacote de NestJS para Better Auth é **mantido pela comunidade**, não pelo Better Auth. Para não depender dele, a proposta é **montar o manipulador oficial do Better Auth** (para Node/Express) dentro do NestJS e escrever um **guarda** pequeno que pergunta ao Better Auth quem é a sessão. A decisão final fica para o passo 3, depois de testar.

### E-mail: Mailpit nos testes, Gmail para a família

- **Mailpit** (desenvolvimento): todos os e-mails ficam presos numa tela local. Ninguém recebe nada de verdade e a cota do Gmail não é gasta.
- **Gmail** (teste com a família): envio por SMTP com uma **senha de app** do Google. Regras do Google (página de ajuda "Fazer login com senhas de app", conferida em 19/11/2026):
  - exige a **verificação em 2 etapas** ligada;
  - não aparece em contas de trabalho ou escola, com Proteção Avançada ou com 2 etapas só por chave de segurança;
  - **trocar a senha da conta Google revoga todas as senhas de app**;
  - o próprio Google diz que senha de app "não é recomendada". Serve para o teste local; para publicar, usar um serviço de e-mail próprio.
- **Recomendação:** criar um **Gmail novo só para o GoToUSA**, em vez de usar o pessoal.
- A senha de app fica **só no `.env`**, que nunca vai para o Git.
- **Alternativa sem e-mail:** a tela de convite terá o botão **"Copiar link do convite"**, para mandar pelo WhatsApp se o e-mail cair no spam.

## Banco de dados: o que fica guardado

**Tabelas do Better Auth** (criadas por ele, com migração do Prisma):
- `user` (nome, e-mail, e-mail confirmado), `account` (senha com hash Argon2id), `session`, `verification` (códigos de confirmação);
- `organization` (= **jornada**), `member` (pessoa ↔ jornada ↔ papel), `invitation` (convites).

**Tabelas do GoToUSA:**
- `journey_data`: para cada jornada, o **questionário** e o **progresso** (JSON validado pelos mesmos Zod do navegador e com as mesmas migrações de formato), mais um **número de versão** para evitar que duas pessoas salvando ao mesmo tempo apaguem o trabalho uma da outra.
- `member_person`: liga a conta à **pessoa da família** no questionário (ex.: "Cônjuge", "Filho 1"), para cada um ver as suas tarefas.
- `activity`: histórico ("Cônjuge concluiu Conferir o passaporte").

**O que nunca vai para o banco:** documentos, números de documentos, senhas em texto (só o hash), dados de cartão.

## Quem pode fazer o quê (aplicado na API)

As permissões de [acesso-compartilhado.md](acesso-compartilhado.md#papéis-de-acesso-fase-do-backend) são conferidas **na API**, nunca só na tela:

- **Participante:** recebe a jornada **sem** as respostas de saúde e de dinheiro dos outros. Só pode alterar o progresso das tarefas que executa.
- **Admin e dono:** tudo. Só o dono apaga ou transfere a jornada.
- Toda entrada passa pelo Zod. Toda alteração confere o papel e a versão.

## Fluxos

**1. Criar a conta do responsável**
- Nesta fase, **cadastro aberto só para e-mails autorizados** (lista no `.env`, ex.: o e-mail do fundador). O resto entra só por convite.
- Cadastro com nome, e-mail e senha → e-mail de confirmação → login.
- **Levar a jornada para a conta:** depois do login, o app oferece copiar a jornada salva no navegador para a conta (mesma validação do importar). A cópia do navegador só é apagada se a pessoa quiser.

**2. Convidar uma pessoa**
- O dono ou o admin escolhe a pessoa da família (ex.: "Cônjuge"), informa nome e e-mail e escolhe o papel (admin ou participante).
- O app envia o e-mail com o link (válido por 7 dias) e mostra "Copiar link do convite".
- Crianças e adultos que não podem executar tarefas não aparecem na lista de quem pode ser convidado.

**3. Aceitar o convite**
- A pessoa abre o link, cria a **própria senha**, aceita o **aviso legal** e o uso dos dados dela, e entra na jornada.
- O Better Auth exige uma sessão com o mesmo e-mail do convite para aceitar. A confirmação do e-mail pelo próprio link do convite será definida no passo 4.

**4. Usar no dia a dia**
- Cada pessoa vê a jornada conforme o papel. O filtro por pessoa já abre nas tarefas dela.
- Cada salvamento leva o número da versão. Se outra pessoa salvou antes, o app recarrega a versão nova e reaplica a mudança, sem perder o que foi digitado.

## Segurança nesta fase

**O que vale desde já:**
- Senha com **Argon2id**; o admin nunca vê nem escolhe a senha de ninguém.
- Convites de **uso único**, com validade, que o admin pode cancelar ou reenviar.
- **Limite de tentativas** de login e de envio de convites.
- Mensagens que **não revelam se um e-mail tem conta**.
- Cookies de sessão **HttpOnly** e **SameSite**.
- **Segredos só no `.env`** (senha do banco, segredo do Better Auth, senha de app do Gmail). O `.env.example` traz só os nomes.
- **Firewall do Windows:** liberar a porta 3000 **só para rede privada**. Banco, API e Mailpit escutam só em `127.0.0.1`.
- **Dados da família no PC:** ligar a **criptografia do disco** do Windows e fazer **backup do banco** (comando `pg_dump`, com script pronto).

**Riscos aceitos só nesta fase (decisão do fundador):**
- **HTTP sem criptografia:** a senha e os dados passam abertos pelo Wi-Fi de casa. Por isso o cookie não usa a marca `Secure`, que só funciona em HTTPS. Risco baixo numa rede doméstica com senha forte e só com a família.
- **Dados sensíveis sem criptografia por campo no banco:** a proteção é a criptografia do disco e o banco fechado no PC.
- **Sem 2FA** por enquanto.

**Antes de qualquer publicação (obrigatório):** HTTPS, cookie `Secure`, criptografia dos dados sensíveis no banco, 2FA, serviço de e-mail próprio no lugar do Gmail, cabeçalhos de segurança, verificações automáticas (Dependabot, Gitleaks) e a revisão da seção Segurança do [CLAUDE.md](../CLAUDE.md#segurança).

## O que precisa ser instalado no PC

- **Docker** para rodar o PostgreSQL e o Mailpit, com um `docker-compose.yml` no repositório. Opções: **Docker Desktop** (gratuito para uso pessoal e empresas pequenas) ou **Rancher Desktop** (totalmente gratuito). Os dois precisam do **WSL 2** do Windows. **Instalados em 19/11/2026:** WSL 2 e Docker Desktop 4.99.
- **Alternativa sem Docker:** instalar o PostgreSQL direto no Windows e o Mailpit como programa. Funciona, mas a configuração fica fora do repositório e é mais difícil de repetir.
- **Recomendação:** Docker Desktop. É o que a stack já previa, e subir e desligar tudo fica num só comando.

## Hospedagem na web, depois

O mesmo projeto em contêineres roda na web com o **Docker Engine** (Linux, gratuito); o Docker Desktop é só a ferramenta do Windows. Serviços que funcionam:
- **VPS** (servidor virtual) com **acesso root por SSH**, de preferência com virtualização **KVM** (OpenVZ ou LXC às vezes não rodam Docker);
- **plataforma de contêineres** que publica a partir de um `Dockerfile`, de preferência com **PostgreSQL gerenciado** (backup automático).

**Não serve:** hospedagem de sites compartilhada (cPanel, WordPress). Antes de contratar: procurar "Docker", "Dockerfile" ou "container" na documentação, perguntar ao suporte, conferir os termos e onde ficam os dados (LGPD). A comparação será feita nas fontes oficiais de cada serviço e documentada antes da contratação.

## Implementação em passos

Cada passo é testado, documentado e enviado ao GitHub antes do próximo.

1. **Banco e e-mail de teste:** WSL 2 e Docker instalados; `docker-compose.yml` com PostgreSQL e Mailpit (só em `127.0.0.1`); `.env.example` atualizado. *Pronto quando:* `pnpm db:up` sobe tudo e a tela do Mailpit abre. **Concluído em 19/11/2026:** PostgreSQL 18.7 e Mailpit 1.27 sobem saudáveis; banco responde; Mailpit recebeu um e-mail de teste; as portas 5432, 1025 e 8025 não respondem pela rede (só no PC). Senha do banco só no `.env`; o volume `postgres-data` guarda os dados entre reinícios.
2. **API vazia:** NestJS em `apps/api` com Prisma, rota de saúde (`/api/health`) e o *rewrite* do app. *Pronto quando:* o celular abre `http://<IP>:3000/api/health`. **Concluído em 19/11/2026** (ver [Passo 2 em detalhe](#passo-2-em-detalhe-api-vazia)); falta só o fundador abrir no celular.
3. **Contas e login:** Better Auth com Argon2id, cadastro só para e-mails autorizados, confirmação de e-mail (Mailpit), login, sair, recuperar senha. Telas de entrar e criar conta nos 3 idiomas. *Pronto quando:* o fundador cria a conta e entra pelo celular. **Implementado e testado em 19/11/2026** (ver [Resultado do passo 3](#resultado-do-passo-3)); falta o fundador testar no celular.
4. **Convites:** jornada como organização, convite com escolha da pessoa e do papel, e-mail com link, "Copiar link", aceitar o convite. Gmail configurado. *Pronto quando:* o cônjuge recebe o convite no e-mail e entra.
5. **Jornada no servidor:** levar a jornada do navegador para a conta; carregar e salvar pela API (o repositório de armazenamento troca o IndexedDB pela API quando há sessão); versão contra salvamentos simultâneos; histórico. *Pronto quando:* o que um conclui aparece no celular do outro.
6. **Permissões:** participante sem saúde e dinheiro dos outros, alterando só as tarefas que executa; testes automáticos de cada regra. *Pronto quando:* os testes de permissão passam e o fundador confere com a família.

## Passo 2 em detalhe: API vazia

> Documentado em 19/11/2026, antes de implementar. Versões conferidas no npm e nas documentações oficiais (guia de migração do NestJS 12, guia de atualização do Prisma 7 e guia de *rewrites* do Next.js 16 em `apps/web/node_modules/next/dist/docs/`) nessa data.
>
> **Implementado e testado em 19/11/2026.** O que mudou em relação ao plano está em [O que a implementação decidiu](#o-que-a-implementação-decidiu).

**Objetivo:** ter o servidor do backend funcionando e ligado ao banco, **sem nenhuma regra de negócio ainda**. É a base sobre a qual entram as contas (passo 3). O app continua funcionando igual, com ou sem a API ligada.

### Versões escolhidas

| Peça | Versão | Por quê |
|---|---|---|
| NestJS | **12** (lançado em 27/08/2026) | Versão atual. Os pacotes do NestJS 12 são **só ESM** (módulos modernos do JavaScript); a API nasce em ESM (`"type": "module"`), como recomenda o guia |
| Express (por baixo do NestJS) | 5 | O que o `@nestjs/platform-express` 12 usa |
| Prisma | **7.10.1** (estável) | No npm, a etiqueta "latest" do Prisma aponta hoje para uma **versão de teste (8.0 rc)**. Fixamos a 7.10.1, a última estável. A 8 só depois de sair a versão final |
| Driver do PostgreSQL | `@prisma/adapter-pg` 7.10.1 | O Prisma 7 **exige** um adaptador de banco |
| TypeScript da API | 6 | As ferramentas do NestJS 12 (CLI e geradores) exigem o TypeScript 6. O resto do projeto continua no 5.9 por enquanto; atualizar tudo será uma tarefa separada. O TypeScript 7 (versão nova, reescrita) fica para depois |
| Testes | Vitest | Igual ao resto do projeto; é o padrão do NestJS 12 para projetos ESM. Precisa do `unplugin-swc` para os decoradores do NestJS |
| Segurança HTTP | Helmet 8 | Cabeçalhos de segurança (exigência do CLAUDE.md) |

### Arquivos novos

```
apps/api/
├── package.json          ← @gotousa/api, "type": "module"
├── tsconfig.json
├── nest-cli.json         ← build com SWC
├── vitest.config.ts
├── prisma.config.ts      ← onde fica o schema e a DATABASE_URL (Prisma 7)
├── prisma/schema.prisma  ← ainda sem tabelas (elas chegam no passo 3)
└── src/
    ├── main.ts           ← liga o servidor em 127.0.0.1:4000, prefixo /api
    ├── app.module.ts
    ├── config/env.ts     ← lê e valida o .env com Zod
    ├── prisma/           ← conexão com o banco (abre ao ligar, fecha ao desligar)
    └── health/           ← rota GET /api/health e o teste dela
```

- O cliente do banco que o Prisma gera fica em `apps/api/src/generated/` e **não vai para o Git** (é refeito a cada build com `prisma generate`; no Prisma 7 ele não fica mais dentro de `node_modules`).
- O `.env` continua **um só, na raiz**. A API lê esse arquivo com a opção `--env-file` do próprio Node.js (o Prisma 7 não lê o `.env` sozinho), sem pacote extra.

### Variáveis novas no `.env`

| Variável | Exemplo | Para quê |
|---|---|---|
| `DATABASE_URL` | `postgresql://gotousa:<senha>@127.0.0.1:5432/gotousa` | Endereço do banco para a API. Repete a senha do `POSTGRES_PASSWORD` |
| `API_HOST` | `127.0.0.1` | A API escuta **só no PC**, nunca na rede |
| `API_PORT` | `4000` | Porta da API |
| `API_INTERNAL_URL` | `http://127.0.0.1:4000` | Para onde o app repassa o `/api/*` |

- Ao ligar, a API **confere o `.env` com Zod**. Se faltar algo ou estiver errado, ela não liga e diz **qual variável** está com problema, **sem mostrar o valor**.
- O `API_INTERNAL_URL` é lido quando o app é gerado (`pnpm build`). Se mudar, é preciso gerar o app de novo.

### A rota de saúde (`GET /api/health`)

Serve para saber se a API e o banco estão de pé. Não precisa de login e não mostra nenhum detalhe interno (versões, erros, endereços).

| Situação | Resposta |
|---|---|
| Tudo certo | `200` com `{"status":"ok","database":"ok"}` |
| Banco desligado | `503` com `{"status":"error","database":"unavailable"}` |

Para saber se o banco responde, a API faz uma consulta mínima (`SELECT 1`), com tempo limite curto para não travar.

### Como o app conversa com a API (o *rewrite*)

- No `apps/web/next.config.ts` entra uma regra de *rewrite*: tudo o que chega em **`/api/...`** na porta 3000 é repassado para **`http://127.0.0.1:4000/api/...`**.
- O `proxy.ts` (troca de idioma) **já ignora** os endereços que começam com `/api`. Não precisa mudar.
- Assim o celular só fala com a porta 3000: **sem CORS**, e a porta 4000 fica fechada para a rede.
- **Se a API estiver desligada**, o app continua funcionando no modo sem conta. Só o `/api/...` responde com erro.

### Segurança desde o passo 2

- API escutando **só em `127.0.0.1`**. Nenhuma porta nova no firewall.
- **Helmet** (cabeçalhos de segurança); sem o cabeçalho que revela que é Express.
- **CORS desligado.** Ninguém de outro site chama a API, só o próprio app pela porta 3000.
- Tamanho máximo do corpo das requisições pequeno (o padrão do Express, 100 KB; a jornada importada chega a 2 MB e terá limite próprio no passo 5).
- **IP real de quem acessa:** para a API, toda requisição chega do próprio PC (vem do app). Para o limite de tentativas do passo 3 funcionar por celular, a API vai confiar no cabeçalho `X-Forwarded-For` **só quando a requisição vier do próprio PC** (`trust proxy` em *loopback*). No passo 2 conferimos se o Next.js manda esse cabeçalho.
- Logs sem senhas nem conteúdo do `.env`.
- O limite de tentativas (`@nestjs/throttler`) entra no **passo 3**, junto com o login, que é onde ele é necessário.

### Usar o `packages/shared` na API

- O `packages/shared` hoje é usado direto do código TypeScript, sem ser compilado antes (o Next.js e o Vitest fazem isso sozinhos). O Node.js, na hora de rodar a API, não consegue fazer o mesmo: os imports do `shared` não têm extensão de arquivo.
- **Proposta:** a API compila o código dela com o **SWC** (pela CLI do NestJS) e **embute o `shared` no resultado** (com o Rspack, que o NestJS 12 usa por padrão em monorepos). Assim o `shared` continua igual.
- **Alternativa**, se a proposta não funcionar bem: ajustar os imports do `shared` para que o Node.js consiga rodá-lo direto.
- No passo 2 a API já importa **uma coisa pequena do `shared`** (por exemplo, a lista de idiomas), só para provar que funciona. As contas do passo 3 vão depender disso.

### Comandos novos

| Comando | O que faz |
|---|---|
| `pnpm api:dev` | API em modo de desenvolvimento (reinicia sozinha a cada mudança) |
| `pnpm api:build` | Gera o cliente do banco e a versão de produção da API |
| `pnpm api:start` | Roda a versão de produção da API (depois do `api:build`) |

O `pnpm test` e o `pnpm typecheck` passam a incluir a API (o `pnpm lint` ainda não; ver abaixo).

**Para o teste com a família, a ordem fica:**
1. abrir o Docker Desktop e rodar `pnpm db:up`;
2. num terminal: `pnpm api:build` e depois `pnpm api:start`;
3. em outro terminal: `pnpm build` e depois `pnpm --filter @gotousa/web start -H 0.0.0.0 -p 3000`.

Depois, se ficar cansativo, um comando só para ligar tudo.

### Pontos para conferir na implementação

- O pnpm do projeto bloqueia scripts de instalação (`allowBuilds`), e o `@swc/core` está bloqueado hoje. Conferir se o SWC e o Prisma funcionam assim; se algum precisar de script de instalação, liberar só ele e explicar por quê.
- Conferir se o Next.js 16 repassa o `X-Forwarded-For` no *rewrite*.
- Decidir entre a proposta e a alternativa de uso do `shared` (acima).

### O que a implementação decidiu

- **`packages/shared`: ficou a alternativa.** Os imports internos do `shared` agora têm a extensão **`.ts`** (ex.: `from "./i18n.ts"`), com `allowImportingTsExtensions` nos `tsconfig` do `shared`, do app e da API. Assim o **Node.js 26 roda o `shared` direto**, sem compilar, e a API não precisa embutir nada (sem Rspack). O app e os testes continuam iguais. **Regra nova:** todo import relativo dentro do `shared` leva a extensão `.ts`, e o `shared` só usa TypeScript que o Node consegue apagar (nada de `enum`, `namespace` ou propriedades no construtor).
- **Build da API:** a CLI do NestJS compila com o **SWC**, arquivo por arquivo (`.swcrc`, saída ESM em `apps/api/dist`, sem os arquivos de teste). Os tipos são conferidos à parte com `tsc --noEmit`.
- **Scripts de instalação:** o `@swc/core` funciona bloqueado. O **Prisma** precisou ser liberado no `pnpm-workspace.yaml` (`prisma` e `@prisma/engines`). São pacotes oficiais do Prisma: um confere o ambiente e o outro baixa o motor de migrações do banco, necessário a partir do passo 3.
- **Aviso do Prisma sobre o Node.js:** o Prisma 7.10.1 diz suportar o Node.js 20.19+, 22.12+ e 24+. O projeto usa o **Node.js 26**, e tudo funcionou (gerar o cliente, conectar, consultar). Fica de olho: se algo estranho aparecer no Prisma, essa é a primeira suspeita.
- **`X-Forwarded-For`: o Next.js 16 NÃO repassa no *rewrite*** (conferido com um servidor de eco: só chega o `X-Forwarded-Host`). Para a API, toda requisição parece vir do próprio PC. Não afeta o passo 2, mas o **limite de tentativas do passo 3 não pode depender do IP** como está. Ver as pendências.
- **Lint:** como o `packages/shared`, a API ainda não tem ESLint próprio. O `pnpm lint` continua conferindo só o app; a API é conferida pelo `typecheck` e pelos testes.
- **Testes da API** (Vitest, 8 testes): leitura do `.env` (padrões, variável faltando sem mostrar valores, recusa de escutar na rede) e a rota de saúde de verdade numa porta livre, com banco de mentira (200, 503 sem detalhes internos, Helmet ligado, sem `X-Powered-By`, sem CORS).
- **A API recusa ligar** se `API_HOST` não for do próprio PC (`127.0.0.1`, `::1` ou `localhost`).

**Resultado dos testes de 19/11/2026:**
1. `http://192.168.0.6:3000/api/health` pela rede: `200 {"status":"ok","database":"ok"}`.
2. Com o banco desligado: `503 {"status":"error","database":"unavailable"}` em cerca de 0,1 s, e as páginas do app continuam abrindo. Ao religar o banco, volta para `ok` sem reiniciar a API.
3. Porta 4000 pela rede: não responde.
4. A API importa `LOCALES` do `shared` (aparece no log ao ligar).
5. `pnpm typecheck`, `pnpm test` (117 + 8) e `pnpm lint` passam.

### Pronto quando

1. O celular abre **`http://192.168.0.6:3000/api/health`** e vê `{"status":"ok","database":"ok"}`.
2. Com o banco desligado (`pnpm db:down`), a mesma rota mostra `database: unavailable`, e **o resto do app continua funcionando**.
3. A porta **4000 não responde pela rede**, só no PC.
4. A API usa algo do `packages/shared` sem erro.
5. `pnpm test`, `pnpm typecheck` e `pnpm lint` passam.

## Passo 3 em detalhe: contas e login

> **Implementado e testado em 19/11/2026** (ver [Resultado do passo 3](#resultado-do-passo-3)). Falta só o teste do fundador no celular.
>
> Documentado em 19/11/2026, antes de implementar. Fontes conferidas nessa data: documentação oficial do Better Auth (integração com Express, e-mail e senha, e-mail, adaptador do Prisma, limite de requisições, ganchos e segurança), o npm, o guia de *custom server* do Next.js 16 (em `apps/web/node_modules/next/dist/docs/`) e o *Password Storage Cheat Sheet* da OWASP.

**Objetivo:** o fundador cria a conta, confirma o e-mail, entra e sai pelo celular, e recupera a senha se esquecer. **A jornada ainda não vai para a conta** (isso é o passo 5), e ainda não há convites (passo 4). O modo sem conta continua igual.

### Versões e pacotes

| Pacote | Versão | Licença | Para quê |
|---|---|---|---|
| `better-auth` | 1.7.25 (estável; existe uma 1.8 beta, que não usaremos) | MIT | Contas, sessões, confirmação de e-mail, recuperação de senha, limite de tentativas |
| `@better-auth/prisma-adapter` | 1.7.25 | MIT | Liga o Better Auth ao Prisma (aceita o Prisma 7) |
| `auth` (CLI oficial do Better Auth, mesmo repositório) | 1.7.25 | MIT | Gera as tabelas do Better Auth no `schema.prisma` |
| `@node-rs/argon2` | 2.2.2 | MIT | **Argon2id** (é o que o próprio Better Auth usa no exemplo). Vem pronto para Windows, **sem script de instalação** |
| `nodemailer` | 10.6.0 | MIT-0 | Envio dos e-mails por SMTP (Mailpit agora, Gmail no passo 4) |

### Como o Better Auth entra no NestJS (decisão da pendência)

- **Usamos o manipulador oficial** do Better Auth para Node (`toNodeHandler`), montado no Express que o NestJS usa por baixo, na rota **`/api/auth/*splat`** (formato do Express 5). **Não usamos o pacote da comunidade.**
- O guia oficial manda montar o Better Auth **antes** do leitor de JSON. Por isso a API desliga o leitor automático do NestJS (`bodyParser: false`) e liga o leitor de JSON **depois** do Better Auth.
- O Better Auth exige ESM; a API já é ESM.
- Um **guarda** pequeno do NestJS pergunta ao Better Auth quem é a sessão (`auth.api.getSession`). Ele protege as rotas da API a partir de agora. Para testar o guarda, entra a rota **`GET /api/me`** (nome, e-mail e idioma de quem está logado). Ela vai servir de base para os passos 4 a 6.

### Senha com Argon2id

- O Better Auth usa scrypt por padrão. Trocamos pelo **Argon2id** com as opções `password.hash` e `password.verify`.
- Parâmetros: **64 MiB de memória, 3 passagens, paralelismo 1**. Ficam acima do mínimo da OWASP (19 MiB, 2 passagens, paralelismo 1). O tempo será medido no PC: a meta é ficar abaixo de 1 segundo por login.
- Senha de **8 a 128 caracteres** (padrão do Better Auth). A tela mostra a regra antes de a pessoa digitar.

### Tabelas novas no banco (primeira migração)

- Geradas pela CLI do Better Auth no `schema.prisma` e aplicadas com `prisma migrate`. **As migrações ficam versionadas no Git** (`apps/api/prisma/migrations/`).
- `user`: nome, e-mail, e-mail confirmado, **idioma** (campo nosso, para os e-mails irem no idioma da pessoa) e datas.
- `account`: o **hash Argon2id** da senha (nunca a senha).
- `session`: sessões. O Better Auth guarda junto o **IP e o navegador** de cada sessão. Isso serve para o limite de tentativas e, no futuro, para "onde estou conectado". Fica registrado na página de privacidade quando ela existir.
- `verification`: códigos de confirmação de e-mail e de troca de senha.
- `rateLimit`: contadores do limite de tentativas. Ficam no banco para não zerar quando a API reinicia.
- As tabelas de jornada (`organization`, `member`, `invitation`) **não** entram agora; chegam no passo 4.

### Quem pode criar conta

- **Só os e-mails da lista `AUTH_SIGNUP_ALLOWLIST`** do `.env` (no começo, só o e-mail do fundador). Isso é feito por um **gancho** (*hook*) do Better Auth na rota de cadastro, como mostra a documentação oficial.
- E-mail fora da lista: a tela mostra "Nesta fase de testes, o cadastro é só por convite". As outras pessoas entram pelo convite do passo 4.

### Fluxos e telas

As telas ficam no app, nos **3 idiomas**, seguindo as regras de sempre (celular primeiro, botões grandes, linguagem simples, nada de vermelho de erro).

| Fluxo | Como funciona |
|---|---|
| **Criar conta** | Nome (como quer ser chamado), e-mail e senha. Ao enviar, aparece sempre a mesma mensagem: "Se este e-mail puder ser usado, enviamos um link de confirmação". **Não revela se o e-mail já tem conta**: com a confirmação de e-mail ligada, o Better Auth responde igual nos dois casos e simula o cálculo da senha, para que nem o tempo da resposta denuncie |
| **Confirmar o e-mail** | O e-mail traz um link. Ao abrir, a conta é confirmada e a pessoa já entra (`autoSignInAfterVerification`). **Sem confirmar, não entra** (`requireEmailVerification`); se tentar, o app reenvia o link |
| **Entrar** | E-mail e senha. Senha errada mostra "E-mail ou senha não conferem", sem dizer qual dos dois |
| **Esqueci a senha** | A pessoa informa o e-mail e a mensagem é sempre a mesma. O link do e-mail abre a tela "Criar nova senha". Ao trocar a senha, **todas as outras sessões caem** (`revokeSessionsOnPasswordReset`) |
| **Sair** | Encerra a sessão neste aparelho |
| **Apagar minha conta** | Pede a senha de novo e apaga a conta e as sessões (privacidade: LGPD e GDPR). A jornada salva no navegador continua lá |

- **Onde ficam:** na aba **Mais**, uma seção **"Conta"** (Entrar / Criar conta; logado: nome, e-mail, Sair, Apagar conta). Rotas em `apps/web/src/app/[locale]/account/`: entrar, criar conta, "confira seu e-mail", esqueci a senha e nova senha.
- **A seção só aparece quando o backend existe.** O app sem backend, que será publicado para os colegas, não pode mostrar "Entrar". Para isso há uma chave no `.env` (`ACCOUNTS_ENABLED=true`), lida no `pnpm build`.
- **No app**, o cliente oficial do Better Auth para React (`better-auth/react`) fala com `/api/auth` no mesmo endereço. Ele só é carregado nas telas de conta, para não pesar no resto.
- **Aviso legal no cadastro:** a tela de criar conta lembra o aviso legal (que a pessoa já aceitou ao abrir o app) e diz, em linguagem simples, o que a conta guarda: nome, e-mail, idioma, a senha protegida e os dados de acesso.
- **Erros** do Better Auth (senha curta, muitas tentativas, e-mail não confirmado) viram textos amigáveis traduzidos, nunca o código técnico.

### E-mails

- Enviados pelo **Nodemailer**. Neste passo vão **só para o Mailpit** (`127.0.0.1:1025`): ninguém recebe nada de verdade, e você vê tudo em `http://localhost:8025`. O Gmail entra no passo 4.
- **Dois e-mails:** confirmar o e-mail e criar nova senha. Saem no **idioma da pessoa** (campo `locale` da conta, conferido com a lista de idiomas do `packages/shared`).
- **Textos fora do código**, em arquivos de tradução da API (`apps/api/src/email/messages/<idioma>.json`), com teste automático que falha se um idioma tiver chaves diferentes do pt-BR, como já acontece no app.
- Texto simples e HTML mínimo, sem imagens, com o link escrito por extenso.
- Seguindo a documentação, a API **não espera o envio terminar** antes de responder (evita que o tempo de resposta revele se o e-mail existe). Se o envio falhar, o erro vai para o log, sem o conteúdo do e-mail.
- **Validade dos links:** os padrões do Better Auth serão conferidos no código na implementação e anotados aqui.

### Limite de tentativas e o IP do celular (resolve a pendência do passo 2)

**O problema:** o *rewrite* do Next.js 16 não repassa o IP do celular. Para a API, todo mundo parece ser o próprio PC. Pela documentação do Better Auth, sem IP todos os acessos dividem um contador só. Bastaria alguém errar a senha várias vezes para bloquear a família inteira por alguns minutos.

**Proposta: um servidor próprio do app** (*custom server*, recurso oficial do Next.js descrito no guia da versão 16):
- um arquivo pequeno, `apps/web/server.mjs`, que liga o Next.js e, **antes de cada requisição**, apaga qualquer cabeçalho `x-gotousa-client-ip` que venha de fora e grava nele o **IP real da conexão**;
- o *rewrite* repassa esse cabeçalho para a API (o teste do passo 2 mostrou que os cabeçalhos da requisição chegam na API);
- o Better Auth lê o IP **só desse cabeçalho** (`advanced.ipAddress.ipAddressHeaders`). Ninguém consegue falsificá-lo: o servidor do app sempre sobrescreve, e a API só aceita conexões do próprio PC;
- o `pnpm --filter @gotousa/web start` passa a rodar esse servidor, na porta 3000 e na rede de casa, como hoje. O `pnpm dev` continua igual.

O guia do Next.js recomenda servidor próprio só quando o roteador do Next não resolve, e este é o caso. **Alternativa**, se der problema: ficar com o contador único e limites mais folgados (risco aceitável numa rede só com a família), anotando isso aqui.

**Limites** (ligados também fora do modo produção, porque o padrão do Better Auth é desligado em desenvolvimento):

| Rota | Limite por IP |
|---|---|
| Entrar | 5 tentativas por minuto |
| Criar conta | 3 por minuto |
| Esqueci a senha e reenviar confirmação | 3 por minuto |
| Demais rotas de conta | padrão do Better Auth (100 a cada 10 segundos) |

Passou do limite: a tela diz "Muitas tentativas. Espere um minuto e tente de novo".

### Sessão e cookies (só HTTP nesta fase)

- Cookie de sessão **HttpOnly** e **SameSite=Lax** (padrões do Better Auth). **Sem a marca `Secure`**: o Better Auth só a liga quando o endereço é `https`. É o risco aceito desta fase.
- Sessão de **7 dias**, renovada a cada dia de uso (padrões do Better Auth).
- **Proteção contra CSRF:** o Better Auth confere a origem de cada requisição. Origens aceitas: o endereço do app na rede (`BETTER_AUTH_URL`, ex.: `http://192.168.0.6:3000`) e `http://localhost:3000` (para testar no PC).
- **O IP do PC precisa ser fixo**, porque os links dos e-mails usam o `BETTER_AUTH_URL`. **Tarefa do fundador:** reservar o IP `192.168.0.6` para o PC no roteador (chamado "reserva de DHCP" ou "IP fixo"). Se o IP mudar, basta atualizar o `.env`.

### Variáveis novas no `.env`

| Variável | Exemplo | Para quê |
|---|---|---|
| `BETTER_AUTH_SECRET` | 32+ caracteres aleatórios (o Claude Code gera) | Assina e protege sessões e códigos |
| `BETTER_AUTH_URL` | `http://192.168.0.6:3000` | Endereço do app na rede (links dos e-mails e origem aceita) |
| `AUTH_SIGNUP_ALLOWLIST` | o e-mail do fundador | Quem pode criar conta sem convite (separados por vírgula) |
| `SMTP_HOST` / `SMTP_PORT` | `127.0.0.1` / `1025` | Servidor de e-mail (Mailpit agora) |
| `SMTP_USER` / `SMTP_PASS` | vazios agora | Usados no passo 4 (Gmail) |
| `MAIL_FROM` | `GoToUSA <nao-responda@gotousa.local>` | Remetente dos e-mails |
| `ACCOUNTS_ENABLED` | `true` | Mostra a seção Conta no app (lido no `pnpm build`) |

Como hoje, a API confere tudo com Zod ao ligar e recusa ligar se faltar algo, dizendo **qual** variável, sem mostrar o valor. O `next.config.ts` passa a ler o `.env` da raiz (com o recurso do próprio Node.js) para o `ACCOUNTS_ENABLED` e o `API_INTERNAL_URL`.

### Comandos novos

| Comando | O que faz |
|---|---|
| `pnpm db:migrate` | Aplica as migrações do banco (rodar depois de atualizar o código) |
| `pnpm db:migrate:new <nome>` | Cria uma migração nova a partir do `schema.prisma` (uso no desenvolvimento) |

### Testes automáticos

- Hash e conferência da senha (formato Argon2id, senha errada recusada).
- Gancho da lista de e-mails (dentro aceita, fora recusa, sem diferenciar maiúsculas).
- Textos dos e-mails completos nos 3 idiomas, e-mail no idioma da conta.
- Leitura do `.env` com as variáveis novas.
- Guarda de sessão: `/api/me` sem sessão responde `401`.
- Servidor do app: o cabeçalho de IP vindo de fora é sempre trocado pelo IP real.
- Textos das telas nos 3 idiomas (o teste `ui-messages.test.ts` que já existe).
- Os testes que precisam do banco de verdade (cadastro completo, limite de tentativas) são feitos **à mão** neste passo (lista abaixo). Testes automáticos com um banco de teste separado entram no passo 6, junto com as permissões.

### Pronto quando (teste do fundador)

1. Na aba **Mais → Conta**, pelo celular, o fundador cria a conta com o e-mail da lista.
2. O e-mail de confirmação aparece no Mailpit (`http://localhost:8025`, no PC), no idioma do app. O link confirma a conta e já entra.
3. **Sair** e **entrar** de novo pelo celular. `http://192.168.0.6:3000/api/me` mostra o nome e o e-mail.
4. Um e-mail **fora da lista** não consegue criar conta, com mensagem amigável.
5. Errar a senha 6 vezes seguidas mostra "Muitas tentativas"; **outro aparelho continua conseguindo entrar** (prova de que o limite é por IP).
6. **Esqueci a senha:** chega o e-mail, a senha é trocada e a sessão antiga cai.
7. **Apagar a conta** funciona, e a jornada no navegador continua lá.
8. O app **sem** `ACCOUNTS_ENABLED` não mostra a seção Conta.
9. `pnpm test`, `pnpm typecheck` e `pnpm lint` passam.

### Resultado do passo 3

**O que a implementação confirmou ou decidiu:**
- **Better Auth 1.7.25, não 1.7.26:** a 1.7.26 foi publicada em 18/11/2026 às 17:52 (UTC), menos de 1 dia antes da instalação. O pnpm 12 tem uma proteção que só aceita pacotes publicados há pelo menos 1 dia (`minimumReleaseAge`): versões recém-publicadas são o alvo típico de ataques à cadeia de pacotes. Ao instalar, o pnpm criou exceções sozinho no `pnpm-workspace.yaml`. **As exceções foram removidas** e o Better Auth voltou para a 1.7.25 (publicada em 14/11/2026). As tabelas e os padrões conferidos são os mesmos, e todos os testes foram refeitos.
- **Servidor próprio do app adotado** (`apps/web/server.mjs` + `client-ip.mjs`). O `pnpm --filter @gotousa/web start` roda esse servidor (padrão `127.0.0.1:3000`; para a rede, `-H 0.0.0.0 -p 3000`, como antes).
- **Validade dos links** (conferida no código do Better Auth 1.7.25): confirmação de e-mail e nova senha valem **1 hora** (3600 s). O link de nova senha só pode ser usado uma vez.
- **Limites padrão do Better Auth** (conferidos no código): entrar e criar conta, 3 a cada 10 s; esqueci a senha e reenviar confirmação, 3 por minuto. Os nossos substituem os de entrar (5 por minuto) e criar conta (3 por minuto).
- **Tabelas geradas pela CLI** com `pnpm --filter @gotousa/api auth:schema` (configuração só para a CLI em `apps/api/prisma/auth-cli.config.ts`; as opções que mudam tabelas ficam em `apps/api/src/auth/schema-options.ts`). Primeira migração: `apps/api/prisma/migrations/20261119154029_better_auth/`.
- **Argon2id medido:** cerca de **0,26 s** por login no PC (meta: abaixo de 1 s).
- **Montagem no NestJS:** a API é criada com `bodyParser: false`; o Better Auth fica em `/api/auth/*splat` e o leitor de JSON (100 KB) vem depois (`apps/api/src/setup.ts`).
- **`ACCOUNTS_ENABLED`:** o `next.config.ts` lê do `.env` da raiz **só** essa chave e o `API_INTERNAL_URL` (os segredos da API não entram no app). Com a chave desligada, o código da seção Conta **nem vai para o navegador** e as rotas `/account` dão 404.
- **E-mails:** textos em `apps/api/src/email/messages/<idioma>.ts` (arquivos TypeScript, para irem junto no build da API).
- **Testes automáticos novos:** API 23 (senha, lista de e-mails, `.env`, e-mails nos 3 idiomas e protegidos contra HTML malicioso, `/api/me` sem sessão) e app 4 (IP real e tentativa de falsificar). Total do projeto: 144.

**Teste completo feito pelo Claude Code em 19/11/2026** (com um e-mail de teste e o Mailpit; dados de teste apagados no fim):

| Teste | Resultado |
|---|---|
| E-mail fora da lista | `403 SIGNUP_NOT_ALLOWED` |
| Cadastro na lista | `200`; e-mail no idioma da conta (testado em espanhol e português) |
| Cadastro repetido do mesmo e-mail | **mesma resposta `200`** (não revela que existe) |
| Entrar sem confirmar | `403 EMAIL_NOT_VERIFIED` (e reenvia o link) |
| Link do e-mail pelo app | confirma, já entra (cookie `HttpOnly; SameSite=Lax`, 7 dias) e volta para `/<idioma>/account?verified=1` |
| `/api/me` pelo app | nome, e-mail e idioma |
| 6 senhas erradas de um IP | 5 × `401`, depois `429` |
| Ao mesmo tempo, outro IP | entra normalmente (**limite por aparelho**) |
| Tentar falsificar o cabeçalho de IP | continua bloqueado (vale o IP real) |
| Origem de outro site | `403 INVALID_ORIGIN` |
| Esqueci a senha (e-mail existe / não existe) | **mesma mensagem** nos dois casos |
| Trocar a senha pelo link | troca; a sessão antiga cai (`401`); senha antiga não entra |
| Apagar a conta (senha errada / certa) | `400 INVALID_PASSWORD` / conta apagada, sessão cai |
| App gerado com `ACCOUNTS_ENABLED=false` | `/account` dá 404; seção Conta fora do código do navegador |

## Pendências desta fase

- ~~IP real do celular (passo 3)~~: **resolvido** com o servidor próprio do app (`server.mjs`), testado em 19/11/2026.
- ~~Definir no passo 3 se o NestJS usa o manipulador oficial do Better Auth ou o pacote da comunidade~~: **manipulador oficial** (ver o passo 3).

- Definir no passo 4 como o link do convite também confirma o e-mail.
- Script de backup do banco e como restaurar.
