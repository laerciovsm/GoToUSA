import { DEFAULT_LOCALE, isLocale } from "@gotousa/shared";
import { z } from "zod";

/** Regras das jornadas e dos convites (docs/backend-local.md, passo 4). Sem banco: testáveis sozinhas. */

/** Papéis que podem ser dados por convite. O dono (owner) é só quem criou a jornada. */
export const INVITE_ROLES = ["admin", "member"] as const;
export type InviteRole = (typeof INVITE_ROLES)[number];

export function isInviteRole(role: unknown): role is InviteRole {
  return typeof role === "string" && (INVITE_ROLES as readonly string[]).includes(role);
}

/** Pessoa da família no questionário: UUID, como em packages/shared. */
export const personIdSchema = z.uuid();

/** Código do convite gerado pelo Better Auth (32 letras e números). Conferir antes de ir ao banco. */
const INVITATION_ID = /^[A-Za-z0-9]{16,64}$/;

export function isInvitationId(id: unknown): id is string {
  return typeof id === "string" && INVITATION_ID.test(id);
}

export const JOURNEY_NAME_MAX = 80;

/** Nome da jornada: 1 a 80 caracteres, uma linha só. */
export function normalizeJourneyName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const clean = name.replace(/\s+/g, " ").trim();
  return clean.length >= 1 && clean.length <= JOURNEY_NAME_MAX ? clean : null;
}

/** Nome de quem é convidado (opcional): uma linha, até 80 caracteres; vazio vira null. */
export function normalizeInviteeName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const clean = name.replace(/\s+/g, " ").trim().slice(0, 80);
  return clean || null;
}

/** Validade do convite, em segundos (7 dias). */
export const INVITATION_EXPIRES_IN = 7 * 24 * 60 * 60;
export const MEMBERSHIP_LIMIT = 10;
export const INVITATION_LIMIT = 20;

/** Link do convite no app, no idioma do convite. */
export function inviteUrl(baseUrl: string, locale: string, invitationId: string): string {
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return `${baseUrl}/${lang}/account/invite?id=${encodeURIComponent(invitationId)}`;
}

/** Convite que ainda vale: pendente e dentro do prazo. */
export function isInvitationOpen(invitation: { status: string; expiresAt: Date }, now: Date): boolean {
  return invitation.status === "pending" && invitation.expiresAt > now;
}

/** Códigos de erro nossos (o app traduz). */
export const JOURNEY_ERRORS = {
  ALREADY_IN_JOURNEY: "ALREADY_IN_JOURNEY",
  PERSON_ALREADY_IN_JOURNEY: "PERSON_ALREADY_IN_JOURNEY",
  INVALID_INVITE: "INVALID_INVITE",
  INVALID_JOURNEY_NAME: "INVALID_JOURNEY_NAME",
  OWNER_HAS_JOURNEY: "OWNER_HAS_JOURNEY",
} as const;
