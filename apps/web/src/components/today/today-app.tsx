"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { monthsUntil, parseIsoDate, pendingCheckin, THEME_IDS, weekSteps, type JourneyTask } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import { JourneyGate, type JourneyUpdate, type ReadyJourney } from "@/components/journey/journey-gate";
import { CheckinCard, PausedOrEnded } from "./checkin";
import { useJourneyText } from "@/components/journey/use-journey-text";

/** Tela "Hoje" (Marco 5, parte 3): a meta, o próximo passo e o que precisa de atenção. */
export function TodayApp({ content }: { content: JourneyContent }) {
  return <JourneyGate content={content}>{(state, update) => <Today content={content} state={state} update={update} />}</JourneyGate>;
}

const card = "flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5";
const primaryButton = "flex min-h-12 items-center self-start rounded-full bg-action px-6 font-bold text-on-action";
const secondaryButton = "flex min-h-12 items-center rounded-full border-2 border-primary px-5 font-bold text-primary";

function Today({ content, state, update }: { content: JourneyContent; state: ReadyJourney; update: JourneyUpdate }) {
  const t = useTranslations("Today");
  const tj = useTranslations("Journey");
  const tb = useTranslations("QBlocks");
  const format = useFormatter();
  const { taskTitle, hoursText } = useJourneyText(content, state.data);
  const [showWeek, setShowWeek] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const { journey, readiness, data, now, progress } = state;
  const stopped = progress.pausedAt !== null || progress.endedAt !== null;
  const checkinPhase = pendingCheckin(journey, progress);
  const themes = THEME_IDS.filter((th) => (readiness.byTheme[th]?.total ?? 0) > 0);

  const next = journey.tasks.find((x) => x.key === journey.nextStep);
  const week = weekSteps(journey, data).filter((x) => x.key !== journey.nextStep);
  const priorities = journey.tasks.filter((x) => x.priority && x.status !== "done" && x.status !== "na");
  const reality = journey.reality;
  const why = typeof data.answers["why.reasonText"] === "string" ? data.answers["why.reasonText"].trim() : "";
  const setDeparture = journey.tasks.find((x) => x.taskId === "set-departure-date");
  const percent = Math.round(readiness.total.ratio * 100);

  const meta = (task: JourneyTask) =>
    [task.themes[0] && t(`theme.${task.themes[0]}`), tj(`weight.${task.weight}`), hoursText(task.taskId)].filter(Boolean).join(" · ");

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>

      {/* Meta e contagem */}
      {journey.departure && reality.kind !== "departure_passed" ? (
        <section className="flex flex-col gap-1 rounded-2xl bg-primary p-5 text-on-primary">
          <p className="text-sm font-bold uppercase tracking-widest opacity-90">{t("goalLabel")}</p>
          <p className="font-display text-2xl font-semibold">
            {format.dateTime(parseIsoDate(journey.departure), { month: "long", year: "numeric" })}
          </p>
          <p>{t("monthsLeft", { n: Math.max(monthsUntil(journey.departure, now), 0) })}</p>
        </section>
      ) : reality.kind === "departure_passed" ? (
        <section className={card}>
          <h2 className="text-xl font-semibold">{t("passedTitle")}</h2>
          <p className="text-ink2">{t("passedBody")}</p>
          <Link href="/questionnaire?block=goal" className={primaryButton}>{t("newGoal")}</Link>
        </section>
      ) : (
        <section className={card}>
          <h2 className="text-xl font-semibold">{t("noGoalTitle")}</h2>
          <p className="text-ink2">{t("noGoalBody")}</p>
          <Link href={setDeparture ? `/journey?task=${setDeparture.key}` : "/questionnaire?block=goal"} className={primaryButton}>
            {t("noGoalAction")}
          </Link>
        </section>
      )}

      {/* Check-in de fim de fase, e jornada pausada ou encerrada */}
      {checkinPhase && !stopped && <CheckinCard content={content} phase={checkinPhase} update={update} />}
      {stopped && <PausedOrEnded state={state} update={update} />}

      {/* Próximo passo */}
      {stopped ? null : next ? (
        <section className={`${card} border-2 border-action`}>
          <p className="text-sm font-bold uppercase tracking-widest text-action">{t("nextStep")}</p>
          <h2 className="text-xl font-semibold">{taskTitle(next.key)}</h2>
          <p className="text-sm text-ink2">{meta(next)}</p>
          <Link href={`/journey?task=${encodeURIComponent(next.key)}`} className={primaryButton}>
            {next.status === "doing" ? t("continue") : t("start")}
          </Link>
          {week.length > 0 && (
            <>
              <button type="button" onClick={() => setShowWeek((v) => !v)} aria-expanded={showWeek} className="min-h-11 self-start font-bold text-primary underline underline-offset-4">
                {showWeek ? t("hideWeek") : t("showWeek", { n: week.length })}
              </button>
              {showWeek && (
                <ul className="flex flex-col gap-2">
                  {week.map((task) => (
                    <li key={task.key}>
                      <Link href={`/journey?task=${encodeURIComponent(task.key)}`} className="flex min-h-12 flex-col justify-center rounded-xl border border-line bg-bg px-4 py-2">
                        <span className="font-semibold">{taskTitle(task.key)}</span>
                        <span className="text-sm text-ink2">{meta(task)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      ) : (
        <section className={card}>
          <h2 className="text-xl font-semibold">{t("allDoneTitle")}</h2>
          <p className="text-ink2">{t("allDoneBody")}</p>
          <Link href="/journey" className={primaryButton}>{t("seeJourney")}</Link>
        </section>
      )}

      {/* Conferência de realidade apertada: positivo, mas claro sobre o fato. */}
      {!stopped && reality.kind === "tight" && (
        <section className={`${card} bg-celebrate-soft`}>
          <h2 className="text-lg font-semibold">⏱️ {t("tightTitle")}</h2>
          <p>
            {t("tightBody", {
              date: format.dateTime(parseIsoDate(journey.departure!), { month: "long", year: "numeric" }),
              needed: reality.neededHoursPerWeek,
              available: reality.availableHoursPerWeek,
            })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/questionnaire?block=goal" className={secondaryButton}>{t("reviewGoal")}</Link>
            <Link href="/questionnaire?block=rhythm" className={secondaryButton}>{t("moreTime")}</Link>
          </div>
        </section>
      )}

      {/* Prioridades (prazo sugerido já passou) */}
      {!stopped && priorities.length > 0 && (
        <section className={card}>
          <h2 className="text-lg font-semibold">★ {t("prioritiesTitle", { n: priorities.length })}</h2>
          <p className="text-sm text-ink2">{t("prioritiesBody")}</p>
          <ul className="flex flex-col gap-1">
            {priorities.map((task) => (
              <li key={task.key}>
                <Link href={`/journey?task=${encodeURIComponent(task.key)}`} className="flex min-h-11 items-center font-bold text-primary underline underline-offset-4">
                  {taskTitle(task.key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prontidão (versão compacta; a mala completa vem na parte 5) */}
      <section className={card}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">🧳 {t("readiness")}</h2>
          <span className="font-display text-2xl font-semibold text-done">{percent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={t("readiness")}>
          <div className="h-full rounded-full bg-done" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm text-ink2">{t("readinessHint")}</p>
        {themes.length > 0 && (
          <button type="button" onClick={() => setShowThemes((v) => !v)} aria-expanded={showThemes} className="min-h-11 self-start font-bold text-primary underline underline-offset-4">
            {showThemes ? t("hideThemes") : t("showThemes")}
          </button>
        )}
        {showThemes && (
          <ul className="flex flex-col gap-3">
            {themes.map((th) => {
              const score = readiness.byTheme[th]!;
              const pct = Math.round(score.ratio * 100);
              return (
                <li key={th} className="flex flex-col gap-1">
                  <span className="flex justify-between gap-2 text-sm">
                    <span className="font-semibold">{t(`theme.${th}`)}</span>
                    <span className="text-ink2">{pct}%</span>
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
                    <span className="block h-full rounded-full bg-done" style={{ width: `${pct}%` }} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Blocos do questionário que podem acrescentar tarefas e caminhos */}
      {journey.missingBlocks.length > 0 && (
        <section className={`${card} bg-primary-soft`}>
          <h2 className="text-lg font-semibold">{t("missingTitle")}</h2>
          <p className="text-sm text-ink2">{t("missingBody")}</p>
          <div className="flex flex-wrap gap-2">
            {journey.missingBlocks.map((b) => (
              <Link key={b} href={`/questionnaire?block=${b}`} className="flex min-h-11 items-center rounded-full border-2 border-primary px-4 font-bold text-primary">
                {tb(`${b}.title`)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* O seu porquê, como lembrete */}
      {why && (
        <section className={card}>
          <h2 className="text-lg font-semibold">{t("whyTitle")}</h2>
          <blockquote className="border-s-4 border-celebrate ps-4 text-ink2 italic">{why}</blockquote>
        </section>
      )}
    </>
  );
}
