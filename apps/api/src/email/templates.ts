import { DEFAULT_LOCALE, isLocale, textDirection, type Locale } from "@gotousa/shared";
import enUS from "./messages/en-US.js";
import es from "./messages/es.js";
import ptBR from "./messages/pt-BR.js";

export type EmailMessages = typeof ptBR;
export type EmailKind = "verify" | "reset";

export const EMAIL_MESSAGES: Record<Locale, EmailMessages> = { "pt-BR": ptBR, "en-US": enUS, es };

/** Validade dos links, em horas (padrão do Better Auth: 3600 s para os dois). */
export const LINK_VALIDITY_HOURS = 1;

/** Validade do convite, em dias (invitationExpiresIn em auth.ts). */
export const INVITE_VALIDITY_DAYS = 7;

export type RenderedEmail = { subject: string; text: string; html: string };

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Texto digitado por pessoas (nomes) dentro do e-mail: uma linha só e tamanho limitado. */
function oneLine(value: string, max = 80): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function pickLocale(locale: unknown): Locale {
  return typeof locale === "string" && isLocale(locale) ? locale : DEFAULT_LOCALE;
}

type Parts = { lang: Locale; subject: string; greeting: string; intro: string; action: string; url: string; expiry: string; ignore: string };

/** Texto simples + HTML mínimo, sem imagens, com o link por extenso. */
function layout(p: Parts): RenderedEmail {
  const footer = EMAIL_MESSAGES[p.lang].footer;
  const text = [p.greeting, "", p.intro, "", p.url, "", p.expiry, p.ignore, "", "—", footer].join("\n");
  const url = escapeHtml(p.url);
  const html = `<!doctype html><html lang="${p.lang}" dir="${textDirection(p.lang)}"><body style="font-family:sans-serif;font-size:16px;line-height:1.5">
<p>${escapeHtml(p.greeting)}</p>
<p>${escapeHtml(p.intro)}</p>
<p><a href="${url}">${escapeHtml(p.action)}</a></p>
<p style="word-break:break-all">${url}</p>
<p>${escapeHtml(p.expiry)}<br>${escapeHtml(p.ignore)}</p>
<p style="color:#555">${escapeHtml(footer)}</p>
</body></html>`;
  return { subject: p.subject, text, html };
}

/** E-mail de conta no idioma da pessoa (idioma desconhecido → idioma reserva). */
export function renderEmail(kind: EmailKind, locale: unknown, data: { name: string; url: string }): RenderedEmail {
  const lang = pickLocale(locale);
  const section = EMAIL_MESSAGES[lang][kind];
  const values = { name: oneLine(data.name), hours: String(LINK_VALIDITY_HOURS) };
  return layout({
    lang,
    subject: section.subject,
    greeting: fill(section.greeting, values),
    intro: section.intro,
    action: section.action,
    url: data.url,
    expiry: fill(section.expiry, values),
    ignore: section.ignore,
  });
}

/** E-mail de convite para uma jornada, no idioma escolhido por quem convidou. */
export function renderInviteEmail(
  locale: unknown,
  data: { inviteeName?: string | null; inviterName: string; journeyName: string; url: string },
): RenderedEmail {
  const lang = pickLocale(locale);
  const m = EMAIL_MESSAGES[lang].invite;
  const name = data.inviteeName ? oneLine(data.inviteeName) : "";
  const values = {
    name,
    inviter: oneLine(data.inviterName),
    journey: oneLine(data.journeyName),
    days: String(INVITE_VALIDITY_DAYS),
  };
  return layout({
    lang,
    subject: fill(m.subject, values),
    greeting: name ? fill(m.greeting, values) : m.greetingNoName,
    intro: fill(m.intro, values),
    action: m.action,
    url: data.url,
    expiry: fill(m.expiry, values),
    ignore: m.ignore,
  });
}
