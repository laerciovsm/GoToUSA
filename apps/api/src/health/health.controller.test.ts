import "reflect-metadata";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.ts";
import { PrismaService } from "../prisma/prisma.service.ts";
import { configureApp } from "../setup.ts";

let app: NestExpressApplication | undefined;

/** Sobe a API numa porta livre com um banco de mentira. */
async function startWith(fakeDb: { $queryRaw: () => Promise<unknown> }): Promise<string> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule.forRoot({ DATABASE_URL: "postgresql://x:y@127.0.0.1:5432/z", API_HOST: "127.0.0.1", API_PORT: 0 })],
  })
    .overrideProvider(PrismaService)
    .useValue({ ...fakeDb, $disconnect: async () => {} })
    .compile();
  app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
  configureApp(app);
  await app.listen(0, "127.0.0.1");
  return `${await app.getUrl()}/api/health`.replace("[::1]", "127.0.0.1");
}

afterEach(async () => {
  await app?.close();
  app = undefined;
});

describe("GET /api/health", () => {
  it("responde 200 quando o banco responde", async () => {
    const res = await fetch(await startWith({ $queryRaw: async () => [{ "?column?": 1 }] }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", database: "ok" });
    expect(res.headers.get("cache-control")).toBe("no-store");
    // Helmet ligado e sem revelar que é Express
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-powered-by")).toBeNull();
  });

  it("responde 503 sem detalhes internos quando o banco está fora", async () => {
    const res = await fetch(await startWith({ $queryRaw: async () => { throw new Error("ECONNREFUSED 127.0.0.1:5432"); } }));
    expect(res.status).toBe(503);
    const body = await res.text();
    expect(JSON.parse(body)).toEqual({ status: "error", database: "unavailable" });
    expect(body).not.toMatch(/ECONNREFUSED|5432/);
  });

  it("não libera CORS para outros sites", async () => {
    const url = await startWith({ $queryRaw: async () => [] });
    const res = await fetch(url, { headers: { Origin: "https://site-qualquer.example" } });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});
