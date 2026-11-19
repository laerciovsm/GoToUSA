import { type DynamicModule, Module } from "@nestjs/common";
import { AUTH, createAuth } from "./auth/auth.js";
import { MeController } from "./auth/me.controller.js";
import { SessionGuard } from "./auth/session.guard.js";
import { ENV, type Env } from "./config/env.js";
import { createMailer, MAILER, type Mailer } from "./email/mailer.js";
import { HealthController } from "./health/health.controller.js";
import { HealthService } from "./health/health.service.js";
import { InvitationsController, JourneyController } from "./journey/journey.controller.js";
import { PrismaService } from "./prisma/prisma.service.js";

@Module({})
export class AppModule {
  /** Monta a aplicação com a configuração já validada do .env. */
  static forRoot(env: Env): DynamicModule {
    return {
      module: AppModule,
      controllers: [HealthController, MeController, JourneyController, InvitationsController],
      providers: [
        { provide: ENV, useValue: env },
        PrismaService,
        HealthService,
        { provide: MAILER, useFactory: () => createMailer(env) },
        {
          provide: AUTH,
          useFactory: (prisma: PrismaService, mailer: Mailer) => createAuth(env, prisma, mailer),
          inject: [PrismaService, MAILER],
        },
        SessionGuard,
      ],
    };
  }
}
