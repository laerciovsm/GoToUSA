# @gotousa/api

Backend (NestJS 12, ESM) do GoToUSA. Plano e decisões da fase de testes com a família (tudo no PC do fundador, rede de casa, só HTTP): [docs/backend-local.md](../../docs/backend-local.md).

**Hoje (passo 2):** só a rota de saúde `GET /api/health`, ligada ao PostgreSQL pelo Prisma 7. Escuta só em `127.0.0.1:4000`; o app (porta 3000) repassa o `/api/*` para cá.

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
