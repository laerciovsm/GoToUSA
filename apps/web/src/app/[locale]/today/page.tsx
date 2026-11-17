import { Suspense } from "react";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { journeyContent } from "@/lib/journey/content";
import { TodayApp } from "@/components/today/today-app";
import { AppNav } from "@/components/app-nav";

/**
 * Hoje (Marco 5, parte 3): a tela inicial depois do essencial do questionário. O conteúdo do idioma é lido e validado no build; respostas e progresso
 * ficam só no navegador (IndexedDB).
 */
export default async function TodayPage() {
  const locale = await rootLocale();
  const t = await getTranslations("Journey");
  const content = journeyContent(locale);

  return (
    <>
      <Suspense fallback={<main className="mx-auto w-full max-w-4xl px-4 py-6 text-ink2">{t("loading")}</main>}>
        <TodayApp content={content} />
      </Suspense>
      <AppNav />
    </>
  );
}
