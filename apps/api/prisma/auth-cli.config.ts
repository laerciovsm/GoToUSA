// Só para a CLI do Better Auth gerar as tabelas no schema.prisma:
//   pnpm --filter @gotousa/api auth:schema
// Não é usado pela API. As opções que mudam tabelas vêm de src/auth/schema-options.ts.
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authSchemaOptions } from "../src/auth/schema-options.ts";

export const auth = betterAuth({
  database: prismaAdapter({} as never, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  ...authSchemaOptions,
});
