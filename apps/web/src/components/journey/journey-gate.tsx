"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { JourneyProgress } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import {
  getDisclaimerServerSnapshot,
  getDisclaimerSnapshot,
  parseDisclaimer,
  subscribeDisclaimer,
} from "@/lib/disclaimer-store";
import { useJourney, type JourneyState } from "./use-journey";

export type ReadyJourney = Extract<JourneyState, { status: "ready" }>;
export type JourneyUpdate = (change: (p: JourneyProgress) => JourneyProgress, immediate?: boolean) => void;

/**
 * Carrega a jornada e mostra carregando, erro ou o convite para o questionário.
 * Quando tudo está pronto, entrega a jornada para a tela (Jornada, Família...).
 */
export function JourneyGate({
  content,
  children,
}: {
  content: JourneyContent;
  children: (state: ReadyJourney, update: JourneyUpdate) => ReactNode;
}) {
  const t = useTranslations("Journey");
  const { state, update, saveFailed } = useJourney(content);
  const disclaimer = parseDisclaimer(
    useSyncExternalStore(subscribeDisclaimer, getDisclaimerSnapshot, getDisclaimerServerSnapshot),
  );

  if (state.status === "loading") return <Shell><p className="text-ink2">{t("loading")}</p></Shell>;
  if (state.status === "error") {
    return (
      <Shell>
        <p role="alert" className="rounded-2xl border border-error p-4">{state.invalid ? t("invalidData") : t("loadError")}</p>
      </Shell>
    );
  }
  if (!disclaimer || state.status === "needsQuestionnaire") {
    return (
      <Shell>
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-2xl font-semibold">{t("needsQuestionnaireTitle")}</h1>
          <p className="text-ink2">{t("needsQuestionnaireBody")}</p>
          <Link href={disclaimer ? "/questionnaire" : "/"} className="min-h-12 rounded-full bg-action px-6 py-3 font-bold text-on-action">
            {t("toQuestionnaire")}
          </Link>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      {saveFailed && <p role="alert" className="rounded-2xl border border-error p-4">{t("saveError")}</p>}
      {children(state, update)}
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-6 pb-28">{children}</main>;
}
