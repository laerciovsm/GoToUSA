import { type CanActivate, type ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { AUTH, type Auth } from "./auth.js";

export type AuthSession = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;
export type RequestWithSession = Request & { session?: AuthSession };

/** Protege uma rota: só passa quem tem sessão válida. A sessão fica em `req.session`. */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithSession>();
    const session = await this.auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) throw new UnauthorizedException();
    req.session = session;
    return true;
  }
}
