"use client";

import { useId, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  completedPhases,
  emptyRecord,
  setTaskStatus,
  taskProgress,
  toggleSubtask,
  updateTask,
  type JourneyProgress,
  type JourneyTask,
  type TaskRecord,
} from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyState } from "./use-journey";
import { useJourneyText } from "./use-journey-text";
import { SimpleMarkdown } from "./simple-markdown";
import { TaskRecordSection } from "./task-record";
import { OfficialSources } from "./official-sources";

type Ready = Extract<JourneyState, { status: "ready" }>;
type Props = {
  content: JourneyContent;
  state: Ready;
  task: JourneyTask;
  update: (change: (p: JourneyProgress) => JourneyProgress, immediate?: boolean) => void;
  onOpenTask: (key: string) => void;
  onBack: () => void;
};

const primaryButton = "min-h-12 rounded-full bg-action px-6 font-bold text-on-action";
const secondaryButton = "min-h-12 rounded-full border-2 border-primary px-5 font-bold text-primary";
const textButton = "min-h-11 px-2 font-bold text-ink2 underline underline-offset-4";
const fieldClass = "w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-ink focus:border-primary focus:outline-none";

export function TaskDetail({ content, state, task, update, onOpenTask, onBack }: Props) {
  const t = useTranslations("Journey");
  const tq = useTranslations("Q");
  const format = useFormatter();
  const { taskTitle, dueText, hoursText, personName } = useJourneyText(content, state.data);
  const planId = useId();
  const noteId = useId();
  const [celebration, setCelebration] = useState<string | null>(null);

  const def = content.catalog.tasks.find((d) => d.id === task.taskId)!;
  const text = content.texts.tasks[task.taskId]!;
  const saved = taskProgress(state.progress, task.key);
  const waiting = task.state === "waiting" && task.status !== "done" && task.status !== "na";
  const stageTitle = content.texts.stages[task.stage]?.title;
  const phaseTitle = content.texts.phases[task.phase]?.title;
  const due = dueText(task);
  const person = personName(task.personId);

  /** Sugestão de recompensa escolhida pela própria pessoa (rhythm.rewards e pref.feelGood). */
  const rewardSuggestion = () => {
    const rewards = (state.data.answers["rhythm.rewards"] as string[] | undefined) ?? [];
    const other = state.data.answers["rhythm.rewardsOther"];
    const options = rewards
      .map((r) => (r === "other" ? (typeof other === "string" && other.trim() ? other.trim() : null) : tq(`rhythm.rewards.options.${r}`)))
      .filter((r): r is string => !!r);
    if (options.length === 0) {
      const feelGood = ((state.data.answers["pref.feelGood"] as string[] | undefined) ?? []).filter((f) => f !== "other");
      options.push(...feelGood.map((f) => tq(`pref.feelGood.options.${f}`)));
    }
    return options.length > 0 ? options[Math.floor(Math.random() * options.length)]! : "";
  };

  const setStatus = (status: JourneyTask["status"]) => {
    update((p) => setTaskStatus(p, task.key, status), true);
    setCelebration(status === "done" ? rewardSuggestion() : null);
    if (status === "done") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const record: TaskRecord | null = def.record ? (saved.record?.type === def.record.type ? saved.record : emptyRecord(def.record)) : null;
  const nextStep = state.journey.nextStep && state.journey.nextStep !== task.key ? state.journey.nextStep : null;

  return (
    <article className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="min-h-11 self-start font-bold text-primary">
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {t("backToJourney")}
      </button>

      {celebration !== null && task.status === "done" && (
        <section aria-live="polite" className="flex flex-col items-start gap-3 rounded-2xl border border-celebrate bg-celebrate-soft p-5">
          <span aria-hidden="true" className="flex size-14 -rotate-6 items-center justify-center rounded-full border-4 border-done text-2xl font-bold text-done">
            ✓
          </span>
          <h2 className="text-xl font-semibold">{t("celebrateTitle")}</h2>
          <p className="text-ink2">{celebration ? t("celebrateReward", { reward: celebration }) : t("celebrateBody")}</p>
          {completedPhases(state.journey).includes(task.phase) && !state.progress.checkins[task.phase] && (
            <div className="flex flex-col items-start gap-2 rounded-xl bg-surface p-3">
              <p className="font-semibold">🛂 {t("phaseStamped", { phase: phaseTitle ?? task.phase })}</p>
              <Link href="/today" className={primaryButton + " flex items-center"}>{t("doCheckin")}</Link>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {nextStep && (
              <button type="button" onClick={() => onOpenTask(nextStep)} className={primaryButton}>
                {t("nextStep", { task: taskTitle(nextStep) })}
              </button>
            )}
            <button type="button" onClick={onBack} className={secondaryButton}>{t("backToJourney")}</button>
          </div>
        </section>
      )}

      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-ink2">
          {phaseTitle} · {stageTitle}
        </p>
        <h1 className="text-2xl font-semibold">{text.title}</h1>
        {person && <p className="font-semibold text-primary">{t("forPerson", { person })}</p>}
        <p className="flex flex-wrap gap-x-2 text-sm text-ink2">
          <span>{t(`weight.${task.weight}`)}</span>
          {hoursText(task.taskId) && <span>· {hoursText(task.taskId)}</span>}
          {due && <span>· {due}</span>}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {task.priority && task.status !== "done" && task.status !== "na" && (
            <span className="rounded-full bg-celebrate-soft px-3 py-1 font-bold text-ink">★ {t("badge.priority")}</span>
          )}
          {task.highlighted && <span className="rounded-full bg-primary-soft px-3 py-1 font-bold text-primary">✦ {t("badge.highlight")}</span>}
        </div>
        {task.priority && task.status !== "done" && task.status !== "na" && <p className="text-sm text-ink2">{t("priorityHint")}</p>}
      </header>

      {waiting && (
        <section className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-4">
          <p className="font-semibold">⏳ {t("waitingTitle")}</p>
          <ul className="flex flex-col gap-1">
            {task.waitingFor.map((key) => (
              <li key={key}>
                <button type="button" onClick={() => onOpenTask(key)} className="min-h-11 text-start font-bold text-primary underline underline-offset-4">
                  {taskTitle(key)}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t("why")}</h2>
        <p className="text-ink2">{text.why}</p>
      </section>

      {def.subtasks.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t("subtasks")}</h2>
          <ul className="flex flex-col gap-2">
            {def.subtasks.map((id) => {
              const checked = saved.subtasks.includes(id);
              const inputId = `${task.key}-${id}`;
              return (
                <li key={id}>
                  <label
                    htmlFor={inputId}
                    className={`flex min-h-12 items-center gap-3 rounded-xl border-2 px-3 py-2 ${checked ? "border-done" : "border-line"} ${
                      waiting ? "opacity-60" : "cursor-pointer"
                    } bg-surface`}
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={checked}
                      disabled={waiting || task.status === "na"}
                      onChange={() => update((p) => toggleSubtask(p, task.key, id), true)}
                      className="size-5 shrink-0 accent-done"
                    />
                    <span className={checked ? "text-ink2 line-through" : ""}>{text.subtasks[id]}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {text.body && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t("stepByStep")}</h2>
          <SimpleMarkdown text={text.body} sources={def.sources} />
        </section>
      )}

      <OfficialSources sources={def.sources} />

      <section className="flex flex-col gap-2">
        <label htmlFor={planId} className="text-lg font-semibold">{t("plan")}</label>
        <p className="text-sm text-ink2">{t("planHint")}</p>
        <input
          id={planId}
          type="text"
          maxLength={500}
          value={saved.plan}
          placeholder={t("planPlaceholder")}
          onChange={(e) => update((p) => updateTask(p, task.key, { plan: e.target.value }))}
          className={fieldClass}
        />
      </section>

      {def.record && record && (
        <TaskRecordSection
          content={content}
          state={state}
          task={task}
          spec={def.record}
          record={record}
          documentsText={text.documents}
          onChange={(next) => update((p) => updateTask(p, task.key, { record: next }))}
        />
      )}

      <section className="flex flex-col gap-2">
        <label htmlFor={noteId} className="text-lg font-semibold">{t("note")}</label>
        <textarea
          id={noteId}
          rows={3}
          maxLength={5000}
          value={saved.note}
          onChange={(e) => update((p) => updateTask(p, task.key, { note: e.target.value }))}
          className={fieldClass}
        />
        <p className="text-sm text-ink2">🔒 {t("noSensitive")}</p>
      </section>

      <section className="flex flex-col items-start gap-3 border-t border-line pt-5">
        {task.status === "done" && (
          <>
            <p className="font-bold text-done">
              ✓ {saved.doneAt ? t("doneOn", { date: format.dateTime(new Date(saved.doneAt), { dateStyle: "medium" }) }) : t("status.done")}
            </p>
            <button type="button" onClick={() => setStatus(saved.subtasks.length > 0 ? "doing" : "todo")} className={textButton}>
              {t("undoDone")}
            </button>
          </>
        )}
        {task.status === "na" && (
          <>
            <p className="font-bold text-ink2">– {t("status.na")}</p>
            <button type="button" onClick={() => setStatus(saved.subtasks.length > 0 ? "doing" : "todo")} className={textButton}>
              {t("undoNa")}
            </button>
          </>
        )}
        {(task.status === "todo" || task.status === "doing") && (
          <>
            {task.status === "doing" && <p className="font-bold text-action">◐ {t("status.doing")}</p>}
            {waiting ? (
              <p className="text-sm text-ink2">{t("waitingButtons")}</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setStatus("done")} className={primaryButton}>✓ {t("markDone")}</button>
                {task.status === "todo" && (
                  <button type="button" onClick={() => setStatus("doing")} className={secondaryButton}>{t("markDoing")}</button>
                )}
              </div>
            )}
            <button type="button" onClick={() => setStatus("na")} className={textButton}>{t("markNa")}</button>
          </>
        )}
      </section>
    </article>
  );
}
