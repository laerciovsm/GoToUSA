/** Nesta fase, só os e-mails da lista AUTH_SIGNUP_ALLOWLIST criam conta sem convite. */
export function isSignupAllowed(email: unknown, allowlist: readonly string[]): boolean {
  if (typeof email !== "string") return false;
  return allowlist.includes(email.trim().toLowerCase());
}

/** Código de erro que o app traduz ("Nesta fase de testes, o cadastro é só por convite"). */
export const SIGNUP_NOT_ALLOWED = "SIGNUP_NOT_ALLOWED";
