"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import { JourneyGate } from "./journey-gate";
import { JourneyOverview } from "./journey-overview";
import { TaskDetail } from "./task-detail";

/** Tela da jornada (Marco 5, partes 1 e 2): visão por fase e detalhe da tarefa (?task=chave). */
export function JourneyApp({ content }: { content: JourneyContent }) {
  const t = useTranslations("Journey");
  const router = useRouter();
  const params = useSearchParams();
  const taskKey = params.get("task");
  const phaseParam = params.get("phase");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [taskKey]);

  const goTask = (key: string) => router.push(`/journey?task=${encodeURIComponent(key)}`);

  return (
    <JourneyGate content={content}>
      {(state, update) => {
        if (!taskKey) {
          return (
            <JourneyOverview
              content={content}
              state={state}
              selectedPhase={phaseParam}
              onSelectPhase={(phase) => router.replace(`/journey?phase=${phase}`, { scroll: false })}
              onOpenTask={goTask}
            />
          );
        }
        const task = state.journey.tasks.find((x) => x.key === taskKey);
        if (!task) {
          return (
            <section className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6">
              <p>{t("taskNotFound")}</p>
              <Link href="/journey" className="min-h-12 rounded-full bg-action px-6 py-3 font-bold text-on-action">
                {t("backToJourney")}
              </Link>
            </section>
          );
        }
        return (
          <TaskDetail
            content={content}
            state={state}
            task={task}
            update={update}
            onOpenTask={goTask}
            onBack={() => router.push(`/journey?phase=${task.phase}`)}
          />
        );
      }}
    </JourneyGate>
  );
}
