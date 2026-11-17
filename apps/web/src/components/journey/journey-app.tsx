"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import {
  getDisclaimerServerSnapshot,
  getDisclaimerSnapshot,
  parseDisclaimer,
  subscribeDisclaimer,
} from "@/lib/disclaimer-store";
import { useJourney } from "./use-journey";
import { JourneyOverview } from "./journey-overview";
import { TaskDetail } from "./task-detail";

/** Tela da jornada (Marco 5, partes 1 e 2): visão por fase e detalhe da tarefa (?task=chave). */
export function JourneyApp({ content }: { content: JourneyContent }) {
  const t = useTranslations("Journey");
  const router = useRouter();
  const params = useSearchParams();
  const taskKey = params.get("task");
  const phaseParam = params.get("phase");
  const { state, update, saveFailed } = useJourney(content);
  const disclaimer = parseDisclaimer(
    useSyncExternalStore(subscribeDisclaimer, getDisclaimerSnapshot, getDisclaimerServerSnapshot),
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [taskKey]);

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

  const goTask = (key: string) => router.push(`/journey?task=${encodeURIComponent(key)}`);
  const task = taskKey ? state.journey.tasks.find((x) => x.key === taskKey) : undefined;

  return (
    <Shell>
      {saveFailed && <p role="alert" className="rounded-2xl border border-error p-4">{t("saveError")}</p>}
      {taskKey ? (
        task ? (
          <TaskDetail
            content={content}
            state={state}
            task={task}
            update={update}
            onOpenTask={goTask}
            onBack={() => router.push(`/journey?phase=${task.phase}`)}
          />
        ) : (
          <section className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
            <p>{t("taskNotFound")}</p>
            <Link href="/journey" className="min-h-12 rounded-full bg-action px-6 py-3 font-bold text-on-action">
              {t("backToJourney")}
            </Link>
          </section>
        )
      ) : (
        <JourneyOverview
          content={content}
          state={state}
          selectedPhase={phaseParam}
          onSelectPhase={(phase) => router.replace(`/journey?phase=${phase}`, { scroll: false })}
          onOpenTask={goTask}
        />
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-6 pb-28">{children}</main>;
}
