import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { z } from "zod";
import { isSignupAllowed } from "../auth/allowlist.js";
import { verifyPassword } from "../auth/password.js";
import { type RequestWithSession, SessionGuard } from "../auth/session.guard.js";
import { ENV, type Env } from "../config/env.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { inviteUrl, isInvitationId, isInvitationOpen, JOURNEY_ERRORS } from "./rules.js";

export type JourneyMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  personId: string | null;
  isMe: boolean;
};

export type JourneyInvitation = {
  id: string;
  email: string;
  role: string;
  personId: string;
  inviteeName: string | null;
  locale: string;
  expiresAt: string;
  url: string;
};

export type JourneyResponse = {
  /** Pode criar jornada (está na lista do .env e ainda não está em nenhuma). */
  canCreate: boolean;
  journey: null | {
    id: string;
    name: string;
    role: string;
    members: JourneyMember[];
    /** Só para dono e admin; vazio para participantes. */
    invitations: JourneyInvitation[];
  };
};

export type InvitationPreview = {
  email: string;
  journeyName: string;
  inviterName: string;
  role: string;
  locale: string;
  inviteeName: string | null;
};

const deleteBody = z.object({ password: z.string().min(1).max(128) });

const MANAGER_ROLES = new Set(["owner", "admin"]);

/** Jornada da pessoa logada e as pessoas dela (docs/backend-local.md, passo 4). */
@Controller("journey")
@UseGuards(SessionGuard)
export class JourneyController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  @Get()
  @Header("Cache-Control", "no-store")
  async current(@Req() req: RequestWithSession): Promise<JourneyResponse> {
    const user = req.session!.user;
    const me = await this.prisma.member.findFirst({
      where: { userId: user.id },
      include: {
        organization: {
          include: {
            members: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" } },
            invitations: { where: { status: "pending", expiresAt: { gt: new Date() } }, orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!me) {
      return { canCreate: isSignupAllowed(user.email, this.env.AUTH_SIGNUP_ALLOWLIST), journey: null };
    }

    const org = me.organization;
    const manager = MANAGER_ROLES.has(me.role);
    return {
      canCreate: false,
      journey: {
        id: org.id,
        name: org.name,
        role: me.role,
        members: org.members.map((m) => ({
          id: m.id,
          name: m.user.name,
          email: m.user.email,
          role: m.role,
          personId: m.personId,
          isMe: m.userId === user.id,
        })),
        invitations: manager
          ? org.invitations.map((i) => ({
              id: i.id,
              email: i.email,
              role: i.role ?? "member",
              personId: i.personId,
              inviteeName: i.inviteeName,
              locale: i.locale,
              expiresAt: i.expiresAt.toISOString(),
              url: inviteUrl(this.env.BETTER_AUTH_URL, i.locale, i.id),
            }))
          : [],
      },
    };
  }

  /** Apaga a jornada: só o dono, com a senha. Os dados no navegador continuam. */
  @Post("delete")
  @HttpCode(200)
  async remove(@Req() req: RequestWithSession, @Body() body: unknown): Promise<{ deleted: true }> {
    const parsed = deleteBody.safeParse(body);
    if (!parsed.success) throw new BadRequestException({ code: "INVALID_PASSWORD" });
    const user = req.session!.user;

    const me = await this.prisma.member.findFirst({ where: { userId: user.id, role: "owner" } });
    if (!me) throw new ForbiddenException({ code: "NOT_OWNER" });

    const account = await this.prisma.account.findFirst({ where: { userId: user.id, providerId: "credential" } });
    if (!account?.password || !(await verifyPassword({ hash: account.password, password: parsed.data.password }))) {
      throw new BadRequestException({ code: "INVALID_PASSWORD" });
    }

    await this.prisma.$transaction([
      this.prisma.session.updateMany({ where: { activeOrganizationId: me.organizationId }, data: { activeOrganizationId: null } }),
      this.prisma.organization.delete({ where: { id: me.organizationId } }),
    ]);
    return { deleted: true };
  }
}

/**
 * Prévia pública do convite (sem sessão): só quem convidou, o nome da jornada, o e-mail e o papel.
 * O Better Auth só mostra o convite para quem já está logado com o e-mail convidado.
 * Convite inexistente, vencido, cancelado ou usado: a mesma resposta 404.
 */
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":id")
  @Header("Cache-Control", "no-store")
  async preview(@Param("id") id: string): Promise<InvitationPreview> {
    const notFound = () => new NotFoundException({ code: JOURNEY_ERRORS.INVALID_INVITE });
    if (!isInvitationId(id)) throw notFound();
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: { organization: { select: { name: true } }, user: { select: { name: true } } },
    });
    if (!invitation || !isInvitationOpen(invitation, new Date())) throw notFound();
    return {
      email: invitation.email,
      journeyName: invitation.organization.name,
      inviterName: invitation.user.name,
      role: invitation.role ?? "member",
      locale: invitation.locale,
      inviteeName: invitation.inviteeName,
    };
  }
}
