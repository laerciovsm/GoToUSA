import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";

/**
 * Configuração HTTP comum (servidor de verdade e testes).
 * CORS fica desligado: só o próprio app chama a API, pelo rewrite da porta 3000.
 */
export function configureApp(app: NestExpressApplication): void {
  app.use(helmet());
  // O app (Next.js) repassa as requisições do próprio PC; só nesse caso
  // confiamos no X-Forwarded-For para saber o IP real do celular.
  app.set("trust proxy", "loopback");
  app.setGlobalPrefix("api");
  app.enableShutdownHooks();
}
