/**
 * Versão do aviso legal. Sempre que o texto do aviso mudar de forma relevante,
 * aumente este número: quem aceitou uma versão anterior precisará aceitar de novo.
 */
export const DISCLAIMER_VERSION = 1;

/** Registro do aceite do aviso legal (hoje no navegador; no futuro, também na conta). */
export type DisclaimerAcceptance = {
  version: number;
  /** Data e hora do aceite em ISO 8601. */
  acceptedAt: string;
};

export function isValidDisclaimerAcceptance(value: unknown): value is DisclaimerAcceptance {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.version === DISCLAIMER_VERSION && typeof v.acceptedAt === "string";
}
