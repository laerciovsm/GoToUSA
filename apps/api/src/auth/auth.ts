import { DEFAULT_LOCALE, isLocale } from "@gotousa/shared";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { organization } from "better-auth/plugins";
import type { Env } from "../config/env.js";
import type { Mailer } from "../email/mailer.js";
import { renderEmail, renderInviteEmail } from "../email/templates.js";
import {
  INVITATION_EXPIRES_IN,
  INVITATION_LIMIT,
  inviteUrl,
  isInviteRole,
  JOURNEY_ERRORS,
  MEMBERSHIP_LIMIT,
  normalizeInviteeName,
  normalizeJourneyName,
  personIdSchema,
} from "../journey/rules.js";
import type { PrismaService } from "../prisma/prisma.service.js";
import { isSignupAllowed, SIGNUP_NOT_ALLOWED } from "./allowlist.js";
import { hashPassword, verifyPassword } from "./password.js";
import { authSchemaOptions, CLIENT_IP_HEADER, organizationSchemaOptions } from "./schema-options.js";

export const AUTH = Symbol("AUTH");

/** Origem usada para testar no próprio PC, além do endereço da rede (BETTER_AUTH_URL). */
const LOCALHOST_ORIGIN = "http://localhost:3000";

/**
 * Rotas do plugin de organização que o app não usa e que mostrariam dados demais
 * (convites para participantes) ou pulariam a confirmação de senha (apagar a jornada).
 * O app usa GET /api/journey e POST /api/journey/delete no lugar delas.
 */
export const BLOCKED_AUTH_PATHS = new Set([
  "/organization/delete",
  "/organization/get-full-organization",
  "/organization/list-invitations",
  "/organization/add-member",
]);

type UserWithLocale = { email: string; name: string; locale?: unknown };
type InvitationFields = { personId?: unknown; locale?: unknown; inviteeName?: unknown };

function fail(status: "FORBIDDEN" | "BAD_REQUEST", code: string): never {
  throw new APIError(status, { code, message: code });
}

/** Configuração das contas e das jornadas. Detalhes e motivos em docs/backend-local.md (passos 3 e 4). */
export function createAuth(env: Env, prisma: PrismaService, mailer: Mailer) {
  /** A pessoa já faz parte de alguma jornada? (nesta fase, cada pessoa fica numa jornada só) */
  const isInAnyJourney = async (userId: string) => (await prisma.member.count({ where: { userId } })) > 0;

  /** Existe um convite pendente e dentro do prazo para este e-mail? */
  const hasOpenInvitation = async (email: unknown) => {
    if (typeof email !== "string" || !email.trim()) return false;
    const count = await prisma.invitation.count({
      where: { email: email.trim().toLowerCase(), status: "pending", expiresAt: { gt: new Date() } },
    });
    return count > 0;
  };

  return betterAuth({
    appName: "GoToUSA",
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [...new Set([env.BETTER_AUTH_URL, LOCALHOST_ORIGIN])],
    database: prismaAdapter(prisma, { provider: "postgresql" }),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      password: { hash: hashPassword, verify: verifyPassword },
      sendResetPassword: async ({ user, url }) => {
        const u = user as UserWithLocale;
        mailer.sendInBackground(u.email, renderEmail("reset", u.locale, { name: u.name, url }));
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        const u = user as UserWithLocale;
        mailer.sendInBackground(u.email, renderEmail("verify", u.locale, { name: u.name, url }));
      },
    },

    user: {
      ...authSchemaOptions.user,
      deleteUser: {
        enabled: true,
        // O dono apaga a jornada antes; os outros saem dela junto com a conta.
        beforeDelete: async (user) => {
          const owner = await prisma.member.count({ where: { userId: user.id, role: "owner" } });
          if (owner > 0) fail("BAD_REQUEST", JOURNEY_ERRORS.OWNER_HAS_JOURNEY);
        },
      },
    },

    rateLimit: {
      ...authSchemaOptions.rateLimit,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
        "/organization/invite-member": { window: 60, max: 5 },
      },
    },

    advanced: {
      // Só o servidor do app grava este cabeçalho, e a API só aceita conexões do próprio PC.
      ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] },
    },

    plugins: [
      organization({
        schema: organizationSchemaOptions,
        // Só quem está na lista cria jornada; uma por pessoa.
        allowUserToCreateOrganization: (user) => isSignupAllowed(user.email, env.AUTH_SIGNUP_ALLOWLIST),
        organizationLimit: 1,
        membershipLimit: MEMBERSHIP_LIMIT,
        invitationLimit: INVITATION_LIMIT,
        invitationExpiresIn: INVITATION_EXPIRES_IN,
        cancelPendingInvitationsOnReInvite: true,
        // O link do convite pode circular fora da caixa de e-mail (botão "Copiar link").
        requireEmailVerificationOnInvitation: true,

        sendInvitationEmail: async (data) => {
          const fields = data.invitation as InvitationFields;
          const locale = typeof fields.locale === "string" ? fields.locale : DEFAULT_LOCALE;
          const email = renderInviteEmail(locale, {
            inviteeName: typeof fields.inviteeName === "string" ? fields.inviteeName : null,
            inviterName: data.inviter.user.name,
            journeyName: data.organization.name,
            url: inviteUrl(env.BETTER_AUTH_URL, locale, data.id),
          });
          mailer.sendInBackground(data.email, email);
        },

        organizationHooks: {
          beforeCreateOrganization: async ({ organization: org, user }) => {
            if (await isInAnyJourney(user.id)) fail("BAD_REQUEST", JOURNEY_ERRORS.ALREADY_IN_JOURNEY);
            const name = normalizeJourneyName(org.name);
            if (!name) fail("BAD_REQUEST", JOURNEY_ERRORS.INVALID_JOURNEY_NAME);
            return { data: { ...org, name, logo: undefined, metadata: undefined } };
          },

          beforeUpdateOrganization: async ({ organization: org }) => {
            if (org.name === undefined) return { data: {} };
            const name = normalizeJourneyName(org.name);
            if (!name) fail("BAD_REQUEST", JOURNEY_ERRORS.INVALID_JOURNEY_NAME);
            return { data: { name } };
          },

          beforeCreateInvitation: async ({ invitation }) => {
            if (!isInviteRole(invitation.role)) fail("BAD_REQUEST", "INVALID_ROLE");
            const personId = personIdSchema.safeParse(invitation.personId);
            if (!personId.success) fail("BAD_REQUEST", "INVALID_PERSON");
            if (typeof invitation.locale !== "string" || !isLocale(invitation.locale)) fail("BAD_REQUEST", "INVALID_LOCALE");

            // Uma conta por pessoa da família na jornada (nem membro, nem outro convite pendente).
            const taken = await prisma.member.count({
              where: { organizationId: invitation.organizationId, personId: personId.data },
            });
            const pending = await prisma.invitation.count({
              where: {
                organizationId: invitation.organizationId,
                personId: personId.data,
                status: "pending",
                expiresAt: { gt: new Date() },
              },
            });
            if (taken + pending > 0) fail("BAD_REQUEST", JOURNEY_ERRORS.PERSON_ALREADY_IN_JOURNEY);

            return { data: { ...invitation, personId: personId.data, inviteeName: normalizeInviteeName(invitation.inviteeName) } };
          },

          beforeAcceptInvitation: async ({ invitation, user }) => {
            if (await isInAnyJourney(user.id)) fail("BAD_REQUEST", JOURNEY_ERRORS.ALREADY_IN_JOURNEY);
            const personId = (invitation as InvitationFields).personId;
            const taken = await prisma.member.count({
              where: { organizationId: invitation.organizationId, personId: typeof personId === "string" ? personId : "" },
            });
            if (taken > 0) fail("BAD_REQUEST", JOURNEY_ERRORS.PERSON_ALREADY_IN_JOURNEY);
          },

          // O Better Auth cria o membro sem os nossos campos: liga a conta à pessoa da família.
          afterAcceptInvitation: async ({ invitation, member }) => {
            const personId = (invitation as InvitationFields).personId;
            if (typeof personId === "string") {
              await prisma.member.update({ where: { id: member.id }, data: { personId } });
            }
          },
        },
      }),
    ],

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (BLOCKED_AUTH_PATHS.has(ctx.path)) throw new APIError("NOT_FOUND");
        if (ctx.path !== "/sign-up/email") return;
        // Cria conta quem está na lista ou tem um convite pendente e válido para o e-mail.
        const email: unknown = ctx.body?.email;
        if (!isSignupAllowed(email, env.AUTH_SIGNUP_ALLOWLIST) && !(await hasOpenInvitation(email))) {
          throw new APIError("FORBIDDEN", { code: SIGNUP_NOT_ALLOWED, message: SIGNUP_NOT_ALLOWED });
        }
        const locale: unknown = ctx.body?.locale;
        if (locale !== undefined && !(typeof locale === "string" && isLocale(locale))) {
          throw new APIError("BAD_REQUEST", { code: "INVALID_LOCALE", message: "INVALID_LOCALE" });
        }
        if (locale === undefined && ctx.body) ctx.body.locale = DEFAULT_LOCALE;
      }),
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
