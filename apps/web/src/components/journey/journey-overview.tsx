"use client";

import { useFormatter, useTranslations } from "next-intl";
import { FAMILY_EXECUTOR, completedPhases, parseIsoDate, setOwnTaskStatus, THEME_IDS, type JourneyTask, type OwnTask, type PhaseId } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyUpdate } from "./journey-gate";
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

const finished = (task: { status: string }) => task.status === "done" || task.status === "na";

/** Fase atual: a primeira com alguma tarefa por fazer (ou a última, se tudo estiver feito). */
export function currentPhase(state: Ready): PhaseId {
  const { phases, tasks } = state.journey;
  const open = phases.find((ph) => tasks.some((t) => t.phase === ph.id && !finished(t)));
  return (open ?? phases[phases.length - 1]!).id;
}

export type JourneyView = "phase" | "theme";

type Props = {
  content: JourneyContent;
  state: Ready;
  update: JourneyUpdate;
  view: JourneyView;
  selectedPhase: string | null;
  person: string | null;
  onSelectPhase: (phase: PhaseId) => void;
  onChangeView: (view: JourneyView) => void;
  onChangePerson: (person: string | null) => void;
  onOpenTask: (key: string) => void;
  onNewTask: () => void;
  onEditOwn: (id: string) => void;
};

const chip = (selected: boolean) =>
  `flex min-h-11 items-center rounded-full border-2 px-4 font-bold ${selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink"}`;

export function JourneyOverview(props: Props) {
  const { content, state, view, person, onChangeView, onChangePerson, onNewTask } = props;
  const t = useTranslations("Journey");
  const { personName } = useJourneyText(content, state.data);
  const { journey } = state;

  // Filtro por pessoa: as tarefas para ela, as que ela executa e as da família toda (e as próprias marcadas para ela).
  const tasks = person
    ? journey.tasks.filter((x) => x.personId === person || x.executor === person || x.executor === FAMILY_EXECUTOR)
    : journey.tasks;
  const own = person ? state.progress.ownTasks.filter((o) => o.people.includes(person)) : state.progress.ownTasks;
  const peopleWithTasks = state.data.people.filter(
    (p) =>
      journey.tasks.some((x) => x.personId === p.id || x.executor === p.id) || state.progress.ownTasks.some((o) => o.people.includes(p.id)),
  );

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

      {/* Por fase ou por tema, e filtro por pessoa */}
      <div className="flex flex-col gap-3">
        <div role="tablist" aria-label={t("viewLabel")} className="flex gap-2">
          {(["phase", "theme"] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => onChangeView(v)} className={chip(view === v)}>
              {t(`view.${v}`)}
            </button>
          ))}
        </div>
        {peopleWithTasks.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-ink2">{t("filterLabel")}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={person === null} onClick={() => onChangePerson(null)} className={chip(person === null)}>
                {t("filterAll")}
              </button>
              {peopleWithTasks.map((p) => (
                <button key={p.id} type="button" aria-pressed={person === p.id} onClick={() => onChangePerson(p.id)} className={chip(person === p.id)}>
                  {personName(p.id)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {view === "phase" ? <PhaseView {...props} tasks={tasks} own={own} /> : <ThemeView {...props} tasks={tasks} own={own} />}

      <button type="button" onClick={onNewTask} className="min-h-12 self-start rounded-full border-2 border-primary px-5 font-bold text-primary">
        + {t("newTask")}
      </button>
    </>
  );
}

type ViewProps = Props & { tasks: JourneyTask[]; own: OwnTask[] };

function PhaseView({ content, state, update, selectedPhase, person, onSelectPhase, onOpenTask, onEditOwn, tasks, own }: ViewProps) {
  const t = useTranslations("Journey");
  const { journey } = state;
  const current = currentPhase(state);
  const phase = journey.phases.find((p) => p.id === selectedPhase) ?? journey.phases.find((p) => p.id === current)!;
  const phaseTasks = tasks.filter((x) => x.phase === phase.id);
  const phaseText = content.texts.phases[phase.id];
  const stamped = completedPhases(journey);
  // Tarefas próprias sem fase aparecem na fase atual.
  const phaseOwn = own.filter((o) => o.phase === phase.id || (o.phase === null && phase.id === current));

  return (
    <>
      {/* Carimbos do passaporte: um por fase concluída. */}
      <section aria-label={t("stamps")} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <p className="text-sm font-bold text-ink2">🛂 {t("stampsCount", { n: stamped.length, total: journey.phases.length })}</p>
        <ul className="flex flex-wrap gap-2">
          {journey.phases.map((ph) => {
            const title = content.texts.phases[ph.id]?.title ?? ph.id;
            return (
              <li key={ph.id}>
                {stamped.includes(ph.id) ? (
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
            const done = stamped.includes(ph.id);
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

      {phaseTasks.length === 0 && phaseOwn.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-4 text-ink2">{person ? t("filterEmpty") : t("phaseComingSoon")}</p>
      )}

      <div className="flex flex-col gap-3">
        {phase.stages.map((stageId) => {
          const stageTasks = phaseTasks.filter((x) => x.stage === stageId);
          const stageOwn = phaseOwn.filter((o) => o.stage === stageId);
          const total = stageTasks.length + stageOwn.length;
          if (total === 0) return null;
          const doneCount = stageTasks.filter(finished).length + stageOwn.filter(finished).length;
          return (
            <details key={`${phase.id}-${stageId}`} open={doneCount < total} className="group rounded-2xl border border-line bg-surface">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className="text-ink2 transition-transform group-open:rotate-90 rtl:-scale-x-100">▸</span>
                  {content.texts.stages[stageId]?.title ?? stageId}
                </span>
                <span className="shrink-0 text-sm text-ink2">{t("stageCount", { done: doneCount, total })}</span>
              </summary>
              <ul className="flex flex-col gap-2 px-3 pb-3">
                {stageTasks.map((task) => (
                  <li key={task.key}>
                    <TaskCard content={content} state={state} task={task} onOpen={() => onOpenTask(task.key)} />
                  </li>
                ))}
                {stageOwn.map((o) => (
                  <li key={o.id}>
                    <OwnTaskCard content={content} state={state} task={o} update={update} onEdit={() => onEditOwn(o.id)} />
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
        <OwnList title={t("ownTasks")} items={phaseOwn.filter((o) => o.stage === null || !phase.stages.includes(o.stage))} {...{ content, state, update, onEditOwn }} />
      </div>
    </>
  );
}

function ThemeView({ content, state, update, onOpenTask, onEditOwn, tasks, own }: ViewProps) {
  const t = useTranslations("Journey");
  const tt = useTranslations("Today.theme");
  const { readiness } = state;
  const themes = THEME_IDS.filter((th) => tasks.some((x) => x.themes.includes(th)) || own.some((o) => o.theme === th));

  return (
    <div className="flex flex-col gap-3">
      {themes.length === 0 && own.length === 0 && <p className="rounded-2xl border border-line bg-surface p-4 text-ink2">{t("filterEmpty")}</p>}
      {themes.map((th) => {
        const themeTasks = tasks.filter((x) => x.themes.includes(th));
        const themeOwn = own.filter((o) => o.theme === th);
        const pct = Math.round((readiness.byTheme[th]?.ratio ?? 0) * 100);
        const total = themeTasks.length + themeOwn.length;
        const doneCount = themeTasks.filter(finished).length + themeOwn.filter(finished).length;
        return (
          <details key={th} open={doneCount < total} className="group rounded-2xl border border-line bg-surface">
            <summary className="flex min-h-14 cursor-pointer list-none flex-col gap-2 px-4 py-3">
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className="text-ink2 transition-transform group-open:rotate-90 rtl:-scale-x-100">▸</span>
                  {tt(th)}
                </span>
                <span className="shrink-0 text-sm text-ink2">{t("themeReadiness", { pct })}</span>
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span className="block h-full rounded-full bg-done" style={{ width: `${pct}%` }} />
              </span>
            </summary>
            <ul className="flex flex-col gap-2 px-3 pb-3">
              {themeTasks.map((task) => (
                <li key={task.key}>
                  <TaskCard content={content} state={state} task={task} onOpen={() => onOpenTask(task.key)} />
                </li>
              ))}
              {themeOwn.map((o) => (
                <li key={o.id}>
                  <OwnTaskCard content={content} state={state} task={o} update={update} onEdit={() => onEditOwn(o.id)} />
                </li>
              ))}
            </ul>
          </details>
        );
      })}
      <OwnList title={t("ownNoTheme")} items={own.filter((o) => o.theme === null)} {...{ content, state, update, onEditOwn }} />
    </div>
  );
}

function OwnList({
  title,
  items,
  content,
  state,
  update,
  onEditOwn,
}: {
  title: string;
  items: OwnTask[];
  content: JourneyContent;
  state: Ready;
  update: JourneyUpdate;
  onEditOwn: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3">
      <h2 className="px-1 font-semibold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((o) => (
          <li key={o.id}>
            <OwnTaskCard content={content} state={state} task={o} update={update} onEdit={() => onEditOwn(o.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Tarefa própria: marcar como concluída com um toque e editar. */
function OwnTaskCard({ content, state, task, update, onEdit }: { content: JourneyContent; state: Ready; task: OwnTask; update: JourneyUpdate; onEdit: () => void }) {
  const t = useTranslations("Journey");
  const format = useFormatter();
  const { personName } = useJourneyText(content, state.data);
  const done = task.status === "done";
  const details = [
    t("ownBadge"),
    task.people.map((id) => personName(id)).filter(Boolean).join(", "),
    task.due && !finished(task) ? t("dueUntil", { date: format.dateTime(parseIsoDate(`${task.due}-01`), { month: "short", year: "numeric" }) }) : null,
    t(`weight.${task.weight}`),
  ].filter(Boolean);
  return (
    <div className="flex min-h-14 w-full items-start gap-3 rounded-xl border border-line bg-bg px-3 py-3">
      <button
        type="button"
        aria-pressed={done}
        aria-label={done ? t("undoDone") : t("markDone")}
        onClick={() => update((p) => setOwnTaskStatus(p, task.id, done ? "todo" : "done"), true)}
        className={`grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${done ? "border-done text-done" : "border-line text-ink2"}`}
      >
        {done ? "✓" : task.status === "na" ? "–" : ""}
      </button>
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 flex-col gap-1 text-start">
        <span className={`font-semibold ${finished(task) ? "text-ink2 line-through" : ""}`}>{task.title}</span>
        <span className="text-sm text-ink2">{details.join(" · ")}</span>
      </button>
    </div>
  );
}

function TaskCard({ content, state, task, onOpen }: { content: JourneyContent; state: Ready; task: JourneyTask; onOpen: () => void }) {
  const t = useTranslations("Journey");
  const { taskTitle, dueText, executorName } = useJourneyText(content, state.data);
  const showExecutor = state.data.people.length > 1;
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
          {showExecutor && <span>👤 {t("executorShort", { name: executorName(task.executor) })}</span>}
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
