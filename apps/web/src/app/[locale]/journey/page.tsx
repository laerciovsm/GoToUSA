import { Suspense } from "react";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { journeyContent } from "@/lib/journey/content";
import { JourneyApp } from "@/components/journey/journey-app";
import { AppNav } from "@/components/app-nav";

/**
 * Jornada (Marco 5). O conteúdo do idioma é lido e validado no build; respostas e progresso
 * ficam só no navegador (IndexedDB).
 */
export default async function JourneyPage() {
  const locale = await rootLocale();
  const t = await getTranslations("Journey");
  const content = journeyContent(locale);

  return (
    <>
      <Suspense fallback={<main className="mx-auto w-full max-w-4xl px-4 py-6 text-ink2">{t("loading")}</main>}>
        <JourneyApp content={content} />
      </Suspense>
      <AppNav />
    </>
  );
}
