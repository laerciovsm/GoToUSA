"use client";

import { useTranslations } from "next-intl";
import { completedPhases, type JourneyTask, type PhaseId } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyState } from "./use-journey";
import { useJourneyText } from "./use-journey-text";

type Ready = Extract<JourneyState, { status: "ready" }>;

export const PHASE_ICONS: Record<PhaseId, string> = {
  discovery: "🧭",
  planning: "🗺️",
  preparation: "📋",
  move: "✈️",
  arrival: "🛬",
  settling: "🏡",
  future: "🌱",
};

const finished = (task: JourneyTask) => task.status === "done" || task.status === "na";

/** Fase atual: a primeira com alguma tarefa por fazer (ou a última, se tudo estiver feito). */
export function currentPhase(state: Ready): PhaseId {
  const { phases, tasks } = state.journey;
  const open = phases.find((ph) => tasks.some((t) => t.phase === ph.id && !finished(t)));
  return (open ?? phases[phases.length - 1]!).id;
}

type Props = {
  content: JourneyContent;
  state: Ready;
  selectedPhase: string | null;
  onSelectPhase: (phase: PhaseId) => void;
  onOpenTask: (key: string) => void;
};

export function JourneyOverview({ content, state, selectedPhase, onSelectPhase, onOpenTask }: Props) {
  const t = useTranslations("Journey");
  const { journey } = state;
  const current = currentPhase(state);
  const phase = journey.phases.find((p) => p.id === selectedPhase) ?? journey.phases.find((p) => p.id === current)!;
  const phaseTasks = journey.tasks.filter((x) => x.phase === phase.id);
  const phaseText = content.texts.phases[phase.id];

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-ink2">{t("intro")}</p>
      </section>

      {/* Atalho para os caminhos de visto (ficam na aba Família). */}
      <Link href="/family" className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-primary bg-primary-soft p-4">
        <span className="flex flex-col gap-0.5">
          <span className="font-semibold">🛂 {t("pathsCardTitle")}</span>
          <span className="text-sm text-ink2">
            {journey.paths.length > 0 ? t("pathsCardCount", { n: journey.paths.length }) : t("pathsCardNone")}
          </span>
        </span>
        <span aria-hidden="true" className="text-xl text-primary rtl:-scale-x-100">→</span>
      </Link>

      {/* Carimbos do passaporte: um por fase concluída. */}
      <section aria-label={t("stamps")} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <p className="text-sm font-bold text-ink2">
          🛂 {t("stampsCount", { n: completedPhases(journey).length, total: journey.phases.length })}
        </p>
        <ul className="flex flex-wrap gap-2">
          {journey.phases.map((ph) => {
            const stamped = completedPhases(journey).includes(ph.id);
            const title = content.texts.phases[ph.id]?.title ?? ph.id;
            return (
              <li key={ph.id}>
                {stamped ? (
                  <span role="img" aria-label={t("stampDone", { phase: title })} className="grid size-11 -rotate-12 place-items-center rounded-full border-4 border-double border-done bg-surface text-lg">
                    <span aria-hidden="true">{PHASE_ICONS[ph.id]}</span>
                  </span>
                ) : (
                  <span role="img" aria-label={t("stampEmpty", { phase: title })} className="grid size-11 place-items-center rounded-full border-2 border-dashed border-line text-lg opacity-40">
                    <span aria-hidden="true">{PHASE_ICONS[ph.id]}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Trilha simples: as fases como paradas (todas aparecem desde o início, para ver o todo). */}
      <nav aria-label={t("trailLabel")} className="rounded-2xl border border-line bg-surface p-4">
        <ol className="relative flex items-start justify-between gap-1">
          <span aria-hidden="true" className="absolute inset-x-5 top-5 h-0.5 bg-line" />
          {journey.phases.map((ph, i) => {
            const tasks = journey.tasks.filter((x) => x.phase === ph.id);
            const done = tasks.length > 0 && tasks.every(finished);
            const isCurrent = ph.id === current;
            const isSelected = ph.id === phase.id;
            const status = done ? t("phaseDone") : isCurrent ? t("phaseCurrent") : t("phaseFuture");
            return (
              <li key={ph.id} className="relative flex flex-1 justify-center">
                <button
                  type="button"
                  onClick={() => onSelectPhase(ph.id)}
                  aria-current={isSelected ? "step" : undefined}
                  aria-label={t("phaseStop", { n: i + 1, phase: content.texts.phases[ph.id]?.title ?? ph.id, status })}
                  className={[
                    "relative grid size-11 place-items-center rounded-full border-2 text-lg",
                    done ? "border-done bg-surface" : isCurrent ? "border-action bg-surface" : "border-line bg-bg",
                    isSelected ? "ring-4 ring-primary/30" : "",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{PHASE_ICONS[ph.id]}</span>
                  {done && (
                    <span aria-hidden="true" className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-done text-xs font-bold text-surface">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-ink2">
            {t("phaseNumber", { n: journey.phases.findIndex((p) => p.id === phase.id) + 1, total: journey.phases.length })}
            {phase.id === current && <span className="text-action"> · {t("youAreHere")}</span>}
          </p>
          <h2 className="text-xl font-semibold">{phaseText?.title}</h2>
          <p className="text-ink2">{phaseText?.summary}</p>
        </div>
      </nav>

      {phaseTasks.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-4 text-ink2">{t("phaseComingSoon")}</p>
      )}

      <div className="flex flex-col gap-3">
        {phase.stages.map((stageId) => {
          const tasks = phaseTasks.filter((x) => x.stage === stageId);
          if (tasks.length === 0) return null;
          const doneCount = tasks.filter(finished).length;
          return (
            <details key={`${phase.id}-${stageId}`} open={doneCount < tasks.length} className="group rounded-2xl border border-line bg-surface">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className="text-ink2 transition-transform group-open:rotate-90 rtl:-scale-x-100">▸</span>
                  {content.texts.stages[stageId]?.title ?? stageId}
                </span>
                <span className="shrink-0 text-sm text-ink2">{t("stageCount", { done: doneCount, total: tasks.length })}</span>
              </summary>
              <ul className="flex flex-col gap-2 px-3 pb-3">
                {tasks.map((task) => (
                  <li key={task.key}>
                    <TaskCard content={content} state={state} task={task} onOpen={() => onOpenTask(task.key)} />
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </>
  );
}

function TaskCard({ content, state, task, onOpen }: { content: JourneyContent; state: Ready; task: JourneyTask; onOpen: () => void }) {
  const t = useTranslations("Journey");
  const { taskTitle, dueText } = useJourneyText(content, state.data);
  const waiting = task.state === "waiting" && !finished(task);
  const icon = task.status === "done" ? "✓" : task.status === "na" ? "–" : task.status === "doing" ? "◐" : waiting ? "⏳" : "○";
  const statusText = waiting ? t("status.waiting") : t(`status.${task.status}`);
  const due = finished(task) ? null : dueText(task);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-14 w-full items-start gap-3 rounded-xl border border-line bg-bg px-3 py-3 text-start"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${
          task.status === "done" ? "border-done text-done" : task.status === "doing" ? "border-action text-action" : "border-line text-ink2"
        }`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`font-semibold ${task.status === "na" ? "text-ink2 line-through" : ""}`}>{taskTitle(task.key)}</span>
        <span className="sr-only">{statusText}</span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink2">
          {due && <span>{due}</span>}
          {task.priority && !finished(task) && (
            <span className="rounded-full bg-celebrate-soft px-2 py-0.5 font-bold text-ink">★ {t("badge.priority")}</span>
          )}
          {task.highlighted && !finished(task) && (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">✦ {t("badge.highlight")}</span>
          )}
          {waiting && (
            <span className="text-ink2">⏳ {t("badge.waiting", { task: task.waitingFor.map(taskTitle).join(", ") })}</span>
          )}
          {task.status === "doing" && <span className="font-bold text-action">{t("status.doing")}</span>}
        </span>
      </span>
    </button>
  );
}
