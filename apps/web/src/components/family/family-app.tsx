"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import { JourneyGate } from "@/components/journey/journey-gate";
import { FamilyProfileView } from "./family-profile";
import { PathDetail } from "./path-detail";

/** Tela Família (Marco 5, parte 4): perfil da família e caminhos de visto (?path=id). */
export function FamilyApp({ content }: { content: JourneyContent }) {
  const t = useTranslations("Family");
  const router = useRouter();
  const pathId = useSearchParams().get("path");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathId]);

  return (
    <JourneyGate content={content}>
      {(state) => {
        if (!pathId) return <FamilyProfileView content={content} state={state} onOpenPath={(id) => router.push(`/family?path=${id}`)} />;
        const visible = state.journey.paths.find((p) => p.pathId === pathId);
        if (!visible) {
          return (
            <section className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
              <p>{t("pathNotFound")}</p>
              <Link href="/family" className="min-h-12 rounded-full bg-action px-6 py-3 font-bold text-on-action">
                {t("backToFamily")}
              </Link>
            </section>
          );
        }
        return <PathDetail content={content} state={state} visible={visible} onBack={() => router.push("/family")} />;
      }}
    </JourneyGate>
  );
}
