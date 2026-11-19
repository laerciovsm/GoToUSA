import { inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

function create() {
  return createAuthClient({
    // Mesmo endereço do app: o /api/* é repassado para a API.
    baseURL: window.location.origin,
    basePath: "/api/auth",
    plugins: [
      inferAdditionalFields({ user: { locale: { type: "string", required: false } } }),
      // Jornada = organização (passo 4). Mesmos campos de apps/api/src/auth/schema-options.ts.
      organizationClient({
        schema: {
          invitation: {
            additionalFields: {
              personId: { type: "string", required: true },
              locale: { type: "string", required: true },
              inviteeName: { type: "string", required: false },
            },
          },
          member: { additionalFields: { personId: { type: "string", required: false } } },
        },
      }),
    ],
  });
}

let client: ReturnType<typeof create> | undefined;

/** Cliente oficial do Better Auth. Criado só no navegador (nunca na geração das páginas). */
export function getAuthClient() {
  client ??= create();
  return client;
}

/** Erros que têm texto próprio em Account.errors.* */
const KNOWN_ERRORS = new Set([
  "SIGNUP_NOT_ALLOWED",
  "INVALID_EMAIL_OR_PASSWORD",
  "EMAIL_NOT_VERIFIED",
  "PASSWORD_TOO_SHORT",
  "PASSWORD_TOO_LONG",
  "INVALID_EMAIL",
  "INVALID_PASSWORD",
  "INVALID_TOKEN",
  "ALREADY_IN_JOURNEY",
  "PERSON_ALREADY_IN_JOURNEY",
  "INVALID_INVITE",
  "INVALID_JOURNEY_NAME",
  "OWNER_HAS_JOURNEY",
  "USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION",
  "INVITATION_LIMIT_REACHED",
  "ORGANIZATION_MEMBERSHIP_LIMIT_REACHED",
  "YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION",
  "YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER",
]);

/** Códigos diferentes que significam a mesma coisa para a pessoa. */
const ALIASES: Record<string, string> = {
  TOKEN_EXPIRED: "INVALID_TOKEN",
  INVITATION_NOT_FOUND: "INVALID_INVITE",
  EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: "EMAIL_NOT_VERIFIED",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "SIGNUP_NOT_ALLOWED",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "ALREADY_IN_JOURNEY",
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "PERSON_ALREADY_IN_JOURNEY",
};

/** Erro do Better Auth ou da API → chave de texto traduzido (Account.errors.*). Nunca mostra o código técnico. */
export function authErrorKey(error: { code?: string; status?: number } | null | undefined): string {
  if (!error) return "generic";
  if (error.status === 429) return "TOO_MANY";
  const code = error.code ? (ALIASES[error.code] ?? error.code) : "";
  return KNOWN_ERRORS.has(code) ? code : "generic";
}

/** Chamada às rotas da nossa API (/api/journey, /api/invitations). Erro vira { code, status }. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<{ data: T; error: null } | { data: null; error: { code?: string; status: number } }> {
  try {
    const res = await fetch(`/api${path}`, {
      ...init,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const body: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const code = body && typeof body === "object" && "code" in body && typeof body.code === "string" ? body.code : undefined;
      return { data: null, error: { code, status: res.status } };
    }
    return { data: body as T, error: null };
  } catch {
    return { data: null, error: { status: 0 } };
  }
}
