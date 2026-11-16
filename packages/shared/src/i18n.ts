/**
 * Idiomas suportados pelo GoToUSA.
 * Para adicionar um idioma: inclua o código aqui e crie o arquivo de mensagens
 * correspondente em apps/web/messages/<código>.json.
 */
export const LOCALES = ["en-US", "pt-BR", "es"] as const;

export type Locale = (typeof LOCALES)[number];

/** Idioma reserva (fallback) quando não há tradução ou o idioma do navegador não é suportado. */
export const DEFAULT_LOCALE: Locale = "en-US";

/** Idiomas escritos da direita para a esquerda (pelo código base do idioma). */
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi", "dv", "ug"]);

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Direção do texto para o atributo `dir` do HTML. */
export function textDirection(locale: string): "rtl" | "ltr" {
  const base = locale.split("-")[0]?.toLowerCase() ?? "";
  return RTL_LANGUAGES.has(base) ? "rtl" : "ltr";
}
