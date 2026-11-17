"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { PhaseId } from "@gotousa/shared";
import { Link, useRouter } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import { JourneyGate } from "./journey-gate";
import { JourneyOverview, type JourneyView } from "./journey-overview";
import { OwnTaskForm } from "./own-task-form";
import { TaskDetail } from "./task-detail";

/**
 * Tela da jornada (Marco 5): por fase ou por tema, filtro por pessoa, detalhe da tarefa (?task=chave)
 * e tarefa própria (?new=1 para criar, ?own=id para editar). Tudo na URL, para o "voltar" do celular funcionar.
 */
export function JourneyApp({ content }: { content: JourneyContent }) {
  const t = useTranslations("Journey");
  const router = useRouter();
  const params = useSearchParams();
  const taskKey = params.get("task");
  const phaseParam = params.get("phase");
  const view: JourneyView = params.get("view") === "theme" ? "theme" : "phase";
  const person = params.get("person");
  const ownId = params.get("own");
  const isNew = params.get("new") === "1";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [taskKey, ownId, isNew]);

  /** Monta a URL da lista mantendo visão, fase e pessoa. */
  const listUrl = (changes: { view?: JourneyView; phase?: string | null; person?: string | null } = {}) => {
    const q = new URLSearchParams();
    const v = changes.view ?? view;
    const ph = changes.phase === undefined ? phaseParam : changes.phase;
    const pe = changes.person === undefined ? person : changes.person;
    if (v === "theme") q.set("view", "theme");
    if (ph) q.set("phase", ph);
    if (pe) q.set("person", pe);
    const s = q.toString();
    return s ? `/journey?${s}` : "/journey";
  };
  const goTask = (key: string) => router.push(`/journey?task=${encodeURIComponent(key)}`);

  return (
    <JourneyGate content={content}>
      {(state, update) => {
        if (isNew || ownId) {
          const editing = ownId ? state.progress.ownTasks.find((o) => o.id === ownId) : undefined;
          return (
            <OwnTaskForm
              key={ownId ?? "new"}
              content={content}
              state={state}
              update={update}
              editing={editing}
              defaultPhase={(phaseParam as PhaseId | null) ?? null}
              onDone={() => router.push(listUrl())}
            />
          );
        }
        if (!taskKey) {
          return (
            <JourneyOverview
              content={content}
              state={state}
              update={update}
              view={view}
              selectedPhase={phaseParam}
              person={person}
              onSelectPhase={(phase) => router.replace(listUrl({ phase }), { scroll: false })}
              onChangeView={(v) => router.replace(listUrl({ view: v }), { scroll: false })}
              onChangePerson={(p) => router.replace(listUrl({ person: p }), { scroll: false })}
              onOpenTask={goTask}
              onNewTask={() => router.push(`${listUrl()}${listUrl().includes("?") ? "&" : "?"}new=1`)}
              onEditOwn={(id) => router.push(`${listUrl()}${listUrl().includes("?") ? "&" : "?"}own=${id}`)}
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
