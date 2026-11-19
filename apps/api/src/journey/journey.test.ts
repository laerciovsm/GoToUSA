import "reflect-metadata";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.ts";
import { BLOCKED_AUTH_PATHS } from "../auth/auth.ts";
import { PrismaService } from "../prisma/prisma.service.ts";
import { configureApp } from "../setup.ts";
import { TEST_ENV } from "../test-env.ts";
import {
  inviteUrl,
  isInvitationId,
  isInvitationOpen,
  isInviteRole,
  normalizeInviteeName,
  normalizeJourneyName,
  personIdSchema,
} from "./rules.ts";

describe("regras das jornadas e convites", () => {
  it("convite só dá os papéis admin e participante (nunca dono)", () => {
    expect(isInviteRole("admin")).toBe(true);
    expect(isInviteRole("member")).toBe(true);
    expect(isInviteRole("owner")).toBe(false);
    expect(isInviteRole("admin,owner")).toBe(false);
    expect(isInviteRole(undefined)).toBe(false);
  });

  it("pessoa da família é um UUID", () => {
    expect(personIdSchema.safeParse("6f1c7a3e-2b4d-4e8f-9a0b-1c2d3e4f5a6b").success).toBe(true);
    expect(personIdSchema.safeParse("partner").success).toBe(false);
    expect(personIdSchema.safeParse("").success).toBe(false);
  });

  it("nome da jornada: uma linha, de 1 a 80 caracteres", () => {
    expect(normalizeJourneyName("  Jornada   da\nAna ")).toBe("Jornada da Ana");
    expect(normalizeJourneyName("   ")).toBeNull();
    expect(normalizeJourneyName("x".repeat(81))).toBeNull();
    expect(normalizeJourneyName(42)).toBeNull();
  });

  it("nome do convidado é opcional e limitado", () => {
    expect(normalizeInviteeName(" Bia ")).toBe("Bia");
    expect(normalizeInviteeName("")).toBeNull();
    expect(normalizeInviteeName(undefined)).toBeNull();
    expect(normalizeInviteeName("y".repeat(200))).toHaveLength(80);
  });

  it("código do convite: só letras e números, tamanho razoável", () => {
    expect(isInvitationId("AbCdEf0123456789AbCdEf0123456789")).toBe(true);
    expect(isInvitationId("../../etc")).toBe(false);
    expect(isInvitationId("abc")).toBe(false);
    expect(isInvitationId("a".repeat(65))).toBe(false);
  });

  it("convite vale só pendente e dentro do prazo", () => {
    const now = new Date("2026-11-19T12:00:00Z");
    const later = new Date("2026-11-20T12:00:00Z");
    const before = new Date("2026-11-18T12:00:00Z");
    expect(isInvitationOpen({ status: "pending", expiresAt: later }, now)).toBe(true);
    expect(isInvitationOpen({ status: "pending", expiresAt: before }, now)).toBe(false);
    expect(isInvitationOpen({ status: "canceled", expiresAt: later }, now)).toBe(false);
    expect(isInvitationOpen({ status: "accepted", expiresAt: later }, now)).toBe(false);
  });

  it("link do convite no idioma do convite (idioma desconhecido → reserva)", () => {
    expect(inviteUrl("http://192.168.0.6:3000", "es", "abc")).toBe("http://192.168.0.6:3000/es/account/invite?id=abc");
    expect(inviteUrl("http://192.168.0.6:3000", "xx", "abc")).toBe("http://192.168.0.6:3000/en-US/account/invite?id=abc");
  });
});

let app: NestExpressApplication | undefined;

/** API de teste com um banco de mentira (só o que as rotas abaixo usam). */
async function startApi(fakeDb: object): Promise<string> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule.forRoot(TEST_ENV)] })
    .overrideProvider(PrismaService)
    .useValue({ $queryRaw: async () => [], $disconnect: async () => {}, ...fakeDb })
    .compile();
  app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false, bodyParser: false });
  configureApp(app);
  await app.listen(0, "127.0.0.1");
  return `${await app.getUrl()}/api`.replace("[::1]", "127.0.0.1");
}

afterEach(async () => {
  await app?.close();
  app = undefined;
});

const VALID_ID = "AbCdEf0123456789AbCdEf0123456789";

describe("GET /api/invitations/:id (prévia pública)", () => {
  const stored = {
    id: VALID_ID,
    email: "bia@example.com",
    role: "admin",
    status: "pending",
    expiresAt: new Date(Date.now() + 86_400_000),
    personId: "6f1c7a3e-2b4d-4e8f-9a0b-1c2d3e4f5a6b",
    locale: "pt-BR",
    inviteeName: "Bia",
    organizationId: "org-secreta",
    inviterId: "user-secreto",
    organization: { name: "Jornada da Ana" },
    user: { name: "Ana" },
  };

  it("devolve só os campos permitidos", async () => {
    const base = await startApi({ invitation: { findUnique: async () => stored } });
    const res = await fetch(`${base}/invitations/${VALID_ID}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({
      email: "bia@example.com",
      journeyName: "Jornada da Ana",
      inviterName: "Ana",
      role: "admin",
      locale: "pt-BR",
      inviteeName: "Bia",
    });
  });

  it("inexistente, vencido, cancelado e código estranho dão a mesma resposta", async () => {
    const cases = [
      { found: null, id: VALID_ID },
      { found: { ...stored, expiresAt: new Date(Date.now() - 1000) }, id: VALID_ID },
      { found: { ...stored, status: "canceled" }, id: VALID_ID },
      { found: stored, id: "nao-e-um-codigo" },
    ];
    const bodies = new Set<string>();
    for (const c of cases) {
      const base = await startApi({ invitation: { findUnique: async () => c.found } });
      const res = await fetch(`${base}/invitations/${c.id}`);
      expect(res.status).toBe(404);
      bodies.add(await res.text());
      await app?.close();
      app = undefined;
    }
    expect(bodies.size).toBe(1);
  });
});

describe("rotas da jornada", () => {
  it("GET /api/journey e apagar a jornada pedem sessão", async () => {
    const base = await startApi({});
    expect((await fetch(`${base}/journey`)).status).toBe(401);
    const res = await fetch(`${base}/journey/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "x" }),
    });
    expect(res.status).toBe(401);
  });

  it("rotas do plugin que o app não usa ficam fechadas", async () => {
    const base = await startApi({});
    expect(BLOCKED_AUTH_PATHS.has("/organization/delete")).toBe(true);
    for (const path of BLOCKED_AUTH_PATHS) {
      const res = await fetch(`${base}/auth${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: TEST_ENV.BETTER_AUTH_URL },
        body: "{}",
      });
      expect(res.status, path).toBe(404);
    }
  });
});
