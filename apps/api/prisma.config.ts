// Configuração do Prisma 7: onde fica o schema, as migrações e o endereço do banco.
// O Prisma 7 não lê o .env sozinho; lemos o .env da raiz do repositório, se existir.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const rootEnv = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Vazio só para gerar o cliente sem .env (ex.: testes); as migrações exigem o valor real.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
