import type { NestExpressApplication } from "@nestjs/platform-express";
import { toNodeHandler } from "better-auth/node";
import helmet from "helmet";
import { AUTH, type Auth, BLOCKED_AUTH_PATHS } from "./auth/auth.js";

/**
 * Configuração HTTP comum (servidor de verdade e testes).
 * A aplicação precisa ser criada com `bodyParser: false`: o Better Auth lê o corpo
 * das requisições sozinho e, pelo guia oficial, vem ANTES do leitor de JSON.
 * CORS fica desligado: só o próprio app chama a API, pelo rewrite da porta 3000.
 */
export function configureApp(app: NestExpressApplication): void {
  app.use(helmet());
  app.setGlobalPrefix("api");

  const auth = app.get<Auth>(AUTH);
  const server = app.getHttpAdapter().getInstance();
  // Rotas do plugin de organização que o app não usa: fechadas antes de chegar ao Better Auth.
  for (const path of BLOCKED_AUTH_PATHS) {
    server.all(`/api/auth${path}`, (_req: unknown, res: { status(code: number): { json(body: unknown): void } }) => {
      res.status(404).json({ code: "NOT_FOUND" });
    });
  }
  server.all("/api/auth/*splat", toNodeHandler(auth));

  app.useBodyParser("json", { limit: "100kb" });
  app.enableShutdownHooks();
}
