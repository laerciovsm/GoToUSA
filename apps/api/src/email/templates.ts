import { DEFAULT_LOCALE, isLocale, textDirection, type Locale } from "@gotousa/shared";
import enUS from "./messages/en-US.js";
import es from "./messages/es.js";
import ptBR from "./messages/pt-BR.js";

export type EmailMessages = typeof ptBR;
export type EmailKind = "verify" | "reset";

export const EMAIL_MESSAGES: Record<Locale, EmailMessages> = { "pt-BR": ptBR, "en-US": enUS, es };

/** Validade dos links, em horas (padrão do Better Auth: 3600 s para os dois). */
export const LINK_VALIDITY_HOURS = 1;

export type RenderedEmail = { subject: string; text: string; html: string };

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Monta o e-mail no idioma da pessoa (idioma desconhecido → idioma reserva). Texto simples + HTML mínimo, sem imagens. */
export function renderEmail(kind: EmailKind, locale: unknown, data: { name: string; url: string }): RenderedEmail {
  const lang: Locale = typeof locale === "string" && isLocale(locale) ? locale : DEFAULT_LOCALE;
  const m = EMAIL_MESSAGES[lang];
  const section = m[kind];
  const values = { name: data.name, url: data.url, hours: String(LINK_VALIDITY_HOURS) };
  const greeting = fill(section.greeting, values);
  const expiry = fill(section.expiry, values);

  const text = [greeting, "", section.intro, "", data.url, "", expiry, section.ignore, "", "—", m.footer].join("\n");

  const dir = textDirection(lang);
  const url = escapeHtml(data.url);
  const html = `<!doctype html><html lang="${lang}" dir="${dir}"><body style="font-family:sans-serif;font-size:16px;line-height:1.5">
<p>${escapeHtml(greeting)}</p>
<p>${escapeHtml(section.intro)}</p>
<p><a href="${url}">${escapeHtml(section.action)}</a></p>
<p style="word-break:break-all">${url}</p>
<p>${escapeHtml(expiry)}<br>${escapeHtml(section.ignore)}</p>
<p style="color:#555">${escapeHtml(m.footer)}</p>
</body></html>`;

  return { subject: section.subject, text, html };
}
