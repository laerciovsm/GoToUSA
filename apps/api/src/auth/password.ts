import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id (exigência do CLAUDE.md). 64 MiB, 3 passagens, paralelismo 1:
 * acima do mínimo da OWASP (19 MiB, 2 passagens, 1). Ver docs/backend-local.md.
 */
const ARGON2_OPTIONS = {
  algorithm: 2, // Argon2id (o enum do pacote não funciona com isolatedModules)
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword({ hash: stored, password }: { hash: string; password: string }): Promise<boolean> {
  try {
    return await verify(stored, password);
  } catch {
    // Hash em formato inesperado: trata como senha que não confere.
    return false;
  }
}
