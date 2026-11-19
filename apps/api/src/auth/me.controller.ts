import { Controller, Get, Header, Req, UseGuards } from "@nestjs/common";
import { type RequestWithSession, SessionGuard } from "./session.guard.js";

export type MeResponse = { id: string; name: string; email: string; locale: string | null };

/** GET /api/me: quem está logado (base para os passos 4 a 6). */
@Controller("me")
@UseGuards(SessionGuard)
export class MeController {
  @Get()
  @Header("Cache-Control", "no-store")
  me(@Req() req: RequestWithSession): MeResponse {
    const user = req.session!.user as MeResponse & { locale?: string | null };
    return { id: user.id, name: user.name, email: user.email, locale: user.locale ?? null };
  }
}
