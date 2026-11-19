import { Logger } from "@nestjs/common";
import nodemailer from "nodemailer";
import type { Env } from "../config/env.js";
import type { RenderedEmail } from "./templates.js";

export type Mailer = {
  /** Envia em segundo plano: não espera terminar (evita que o tempo de resposta revele se o e-mail existe). */
  sendInBackground(to: string, email: RenderedEmail): void;
  /** Testa a conexão com o servidor de e-mail (usado ao ligar a API). */
  verify(): Promise<boolean>;
};

export const MAILER = Symbol("MAILER");

const logger = new Logger("Email");

export function createMailer(env: Env): Mailer {
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });

  return {
    sendInBackground(to, email) {
      void transport
        .sendMail({ from: env.MAIL_FROM, to, subject: email.subject, text: email.text, html: email.html })
        .catch((error: unknown) => {
          // Sem o conteúdo nem o destinatário (o link do e-mail é um segredo).
          const reason = error instanceof Error ? error.message : "erro desconhecido";
          logger.error(`Falha ao enviar e-mail: ${reason}`);
        });
    },
    async verify() {
      try {
        await transport.verify();
        logger.log(`Servidor de e-mail conectado (${env.SMTP_HOST}:${env.SMTP_PORT}).`);
        return true;
      } catch {
        // Sem detalhes: a mensagem do servidor pode citar o usuário.
        logger.error(`Não consegui conectar ao servidor de e-mail (${env.SMTP_HOST}:${env.SMTP_PORT}). Confira as variáveis SMTP_* do .env.`);
        return false;
      }
    },
  };
}
