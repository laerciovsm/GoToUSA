import { DEFAULT_LOCALE, isLocale } from "@gotousa/shared";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { Env } from "../config/env.js";
import type { Mailer } from "../email/mailer.js";
import { renderEmail } from "../email/templates.js";
import type { PrismaService } from "../prisma/prisma.service.js";
import { isSignupAllowed, SIGNUP_NOT_ALLOWED } from "./allowlist.js";
import { hashPassword, verifyPassword } from "./password.js";
import { authSchemaOptions, CLIENT_IP_HEADER } from "./schema-options.js";

export const AUTH = Symbol("AUTH");

/** Origem usada para testar no próprio PC, além do endereço da rede (BETTER_AUTH_URL). */
const LOCALHOST_ORIGIN = "http://localhost:3000";

type UserWithLocale = { email: string; name: string; locale?: unknown };

/** Configuração das contas. Detalhes e motivos em docs/backend-local.md (passo 3). */
export function createAuth(env: Env, prisma: PrismaService, mailer: Mailer) {
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
      deleteUser: { enabled: true },
    },

    rateLimit: {
      ...authSchemaOptions.rateLimit,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
      },
    },

    advanced: {
      // Só o servidor do app grava este cabeçalho, e a API só aceita conexões do próprio PC.
      ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] },
    },

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;
        if (!isSignupAllowed(ctx.body?.email, env.AUTH_SIGNUP_ALLOWLIST)) {
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
