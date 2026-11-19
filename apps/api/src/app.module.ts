import { type DynamicModule, Module } from "@nestjs/common";
import { ENV, type Env } from "./config/env.js";
import { HealthController } from "./health/health.controller.js";
import { HealthService } from "./health/health.service.js";
import { PrismaService } from "./prisma/prisma.service.js";

@Module({})
export class AppModule {
  /** Monta a aplicação com a configuração já validada do .env. */
  static forRoot(env: Env): DynamicModule {
    return {
      module: AppModule,
      controllers: [HealthController],
      providers: [{ provide: ENV, useValue: env }, PrismaService, HealthService],
    };
  }
}
