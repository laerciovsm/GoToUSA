import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

/** Endereços em que a API pode escutar: só o próprio PC, nunca a rede. */
const LOOPBACK_HOSTS = ["127.0.0.1", "::1", "localhost"] as const;

const envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  API_HOST: z.enum(LOOPBACK_HOSTS).default("127.0.0.1"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
});

export type Env = z.infer<typeof envSchema>;

/** Token de injeção da configuração já validada. */
export const ENV = Symbol("ENV");

/**
 * Valida as variáveis de ambiente. Em caso de erro, diz QUAIS variáveis
 * estão com problema, nunca os valores (que podem conter senhas).
 */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
    throw new Error(
      `Variáveis de ambiente ausentes ou inválidas: ${names.join(", ")}. ` +
        "Confira o arquivo .env na raiz do repositório (modelo em .env.example).",
    );
  }
  return result.data;
}

/** Lê o .env da raiz do repositório, se existir (variáveis já definidas no sistema têm prioridade). */
export function loadRootEnvFile(): void {
  // src/config/env.ts ou dist/config/env.js → raiz do repositório
  const rootEnv = fileURLToPath(new URL("../../../../.env", import.meta.url));
  if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);
}
