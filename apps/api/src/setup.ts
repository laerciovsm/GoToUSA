import type { NestExpressApplication } from "@nestjs/platform-express";
import { toNodeHandler } from "better-auth/node";
import helmet from "helmet";
import { AUTH, type Auth } from "./auth/auth.js";

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
  app.getHttpAdapter().getInstance().all("/api/auth/*splat", toNodeHandler(auth));

  app.useBodyParser("json", { limit: "100kb" });
  app.enableShutdownHooks();
}
