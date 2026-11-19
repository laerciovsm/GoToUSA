import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

function create() {
  return createAuthClient({
    // Mesmo endereço do app: o /api/* é repassado para a API.
    baseURL: window.location.origin,
    basePath: "/api/auth",
    plugins: [inferAdditionalFields({ user: { locale: { type: "string", required: false } } })],
  });
}

let client: ReturnType<typeof create> | undefined;

/** Cliente oficial do Better Auth. Criado só no navegador (nunca na geração das páginas). */
export function getAuthClient() {
  client ??= create();
  return client;
}

/** Erro do Better Auth → chave de texto traduzido (Account.errors.*). Nunca mostra o código técnico. */
export function authErrorKey(error: { code?: string; status?: number } | null | undefined): string {
  if (!error) return "generic";
  if (error.status === 429) return "TOO_MANY";
  switch (error.code) {
    case "SIGNUP_NOT_ALLOWED":
    case "INVALID_EMAIL_OR_PASSWORD":
    case "EMAIL_NOT_VERIFIED":
    case "PASSWORD_TOO_SHORT":
    case "PASSWORD_TOO_LONG":
    case "INVALID_EMAIL":
    case "INVALID_PASSWORD":
    case "INVALID_TOKEN":
      return error.code;
    case "TOKEN_EXPIRED":
      return "INVALID_TOKEN";
    default:
      return "generic";
  }
}
