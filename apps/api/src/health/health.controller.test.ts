import "reflect-metadata";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.ts";
import { PrismaService } from "../prisma/prisma.service.ts";
import { configureApp } from "../setup.ts";
import { TEST_ENV } from "../test-env.ts";

let app: NestExpressApplication | undefined;

/** Sobe a API numa porta livre com um banco de mentira. Devolve o endereço base (…/api). */
export async function startTestApi(fakeDb: { $queryRaw: () => Promise<unknown> }): Promise<string> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule.forRoot(TEST_ENV)] })
    .overrideProvider(PrismaService)
    .useValue({ ...fakeDb, $disconnect: async () => {} })
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

describe("GET /api/health", () => {
  it("responde 200 quando o banco responde", async () => {
    const res = await fetch(`${await startTestApi({ $queryRaw: async () => [{ "?column?": 1 }] })}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", database: "ok" });
    expect(res.headers.get("cache-control")).toBe("no-store");
    // Helmet ligado e sem revelar que é Express
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-powered-by")).toBeNull();
  });

  it("responde 503 sem detalhes internos quando o banco está fora", async () => {
    const base = await startTestApi({ $queryRaw: async () => { throw new Error("ECONNREFUSED 127.0.0.1:5432"); } });
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(503);
    const body = await res.text();
    expect(JSON.parse(body)).toEqual({ status: "error", database: "unavailable" });
    expect(body).not.toMatch(/ECONNREFUSED|5432/);
  });

  it("não libera CORS para outros sites", async () => {
    const base = await startTestApi({ $queryRaw: async () => [] });
    const res = await fetch(`${base}/health`, { headers: { Origin: "https://site-qualquer.example" } });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("GET /api/me", () => {
  it("responde 401 sem sessão", async () => {
    const base = await startTestApi({ $queryRaw: async () => [] });
    const res = await fetch(`${base}/me`);
    expect(res.status).toBe(401);
  });

  it("responde 401 com um cookie de sessão inventado", async () => {
    const base = await startTestApi({ $queryRaw: async () => [] });
    const res = await fetch(`${base}/me`, { headers: { Cookie: "better-auth.session_token=inventado.assinatura" } });
    expect(res.status).toBe(401);
  });
});
