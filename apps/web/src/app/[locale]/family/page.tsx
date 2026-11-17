import { Suspense } from "react";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { journeyContent } from "@/lib/journey/content";
import { FamilyApp } from "@/components/family/family-app";
import { AppNav } from "@/components/app-nav";

/**
 * Família (Marco 5, parte 4): perfil da família e caminhos de visto. O conteúdo do idioma é lido e validado no build; respostas e progresso
 * ficam só no navegador (IndexedDB).
 */
export default async function FamilyPage() {
  const locale = await rootLocale();
  const t = await getTranslations("Journey");
  const content = journeyContent(locale);

  return (
    <>
      <Suspense fallback={<main className="mx-auto w-full max-w-4xl px-4 py-6 text-ink2">{t("loading")}</main>}>
        <FamilyApp content={content} />
      </Suspense>
      <AppNav />
    </>
  );
}
