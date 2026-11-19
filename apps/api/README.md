# @gotousa/api

Backend (NestJS 12, ESM) do GoToUSA. Plano e decisões da fase de testes com a família (tudo no PC do fundador, rede de casa, só HTTP): [docs/backend-local.md](../../docs/backend-local.md).

**Hoje (passo 3):** rota de saúde `GET /api/health`, contas do Better Auth em `/api/auth/*` e `GET /api/me` (protegida pelo `SessionGuard`). Escuta só em `127.0.0.1:4000`; o app (porta 3000) repassa o `/api/*` para cá.

- `src/auth/`: Better Auth (`auth.ts`), Argon2id (`password.ts`), lista de quem pode criar conta (`allowlist.ts`), guarda de sessão e `/api/me`.
- `src/email/`: Nodemailer (`mailer.ts`, envio em segundo plano) e e-mails nos 3 idiomas (`templates.ts`, `messages/`).
- Tabelas: `pnpm --filter @gotousa/api auth:schema` gera as do Better Auth no `schema.prisma`; `pnpm db:migrate:new <nome>` cria a migração; `pnpm db:migrate` aplica.

## Como rodar (na raiz do repositório)

1. Docker Desktop aberto e `pnpm db:up`.
2. `.env` na raiz com `DATABASE_URL` (modelo em `.env.example`).
3. `pnpm api:dev` (desenvolvimento) ou `pnpm api:build` e `pnpm api:start` (produção).

## Organização

- `src/main.ts`: liga o servidor. `src/setup.ts`: Helmet, prefixo `/api`, `trust proxy` (comum ao servidor e aos testes).
- `src/config/env.ts`: lê o `.env` da raiz e valida com Zod (erros dizem a variável, nunca o valor).
- `src/prisma/`: conexão com o banco. O cliente gerado fica em `src/generated/` (fora do Git, refeito por `prisma generate`).
- `src/health/`: rota de saúde e testes.
- Build com SWC (`.swcrc`, `nest-cli.json`); tipos conferidos com `tsc --noEmit`. Imports relativos da API terminam em `.js`.
- Usa o `@gotousa/shared` direto do código TypeScript (o Node.js 26 roda o `shared` sem compilar; por isso os imports internos dele têm a extensão `.ts`).
