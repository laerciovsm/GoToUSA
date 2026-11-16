import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const candidate = explicitLocale ?? (await rootLocale());
  const locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;

  // Textos da interface + textos do questionário (perguntas e opções), num arquivo separado por tamanho.
  const [ui, questionnaire] = await Promise.all([
    import(`../../messages/${locale}.json`),
    import(`../../messages/questionnaire/${locale}.json`),
  ]);

  return {
    locale,
    messages: { ...ui.default, ...questionnaire.default },
  };
});
