"use client";

import { useFormatter, useTranslations } from "next-intl";
import { recordCheckin, resumeJourney, type CheckinAnswer, type PhaseId } from "@gotousa/shared";
import { useRouter } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyUpdate, ReadyJourney } from "@/components/journey/journey-gate";
import { PHASE_ICONS } from "@/components/journey/journey-overview";

const button = "min-h-12 rounded-full border-2 px-5 font-bold";

/**
 * Check-in ao fim de uma fase (docs/telas.md, seção 6): carimbo + "ainda faz sentido para você?".
 * Desistir pelos motivos certos também é sucesso: "Encerrar" é uma decisão consciente, sem culpa.
 */
export function CheckinCard({ content, phase, update }: { content: JourneyContent; phase: PhaseId; update: JourneyUpdate }) {
  const t = useTranslations("Today");
  const router = useRouter();
  const answer = (a: CheckinAnswer) => {
    update((p) => recordCheckin(p, phase, a), true);
    if (a === "adjust") router.push("/questionnaire");
  };
  return (
    <section aria-live="polite" className="flex flex-col items-start gap-3 rounded-2xl border-2 border-celebrate bg-celebrate-soft p-5">
      <Stamp phase={phase} label={content.texts.phases[phase]?.title ?? phase} />
      <h2 className="text-xl font-semibold">{t("checkinTitle", { phase: content.texts.phases[phase]?.title ?? phase })}</h2>
      <p className="font-semibold">{t("checkinQuestion")}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => answer("continue")} className={`${button} border-action bg-action text-on-action`}>{t("checkinContinue")}</button>
        <button type="button" onClick={() => answer("adjust")} className={`${button} border-primary text-primary`}>{t("checkinAdjust")}</button>
        <button type="button" onClick={() => answer("pause")} className={`${button} border-line text-ink`}>{t("checkinPause")}</button>
        <button type="button" onClick={() => answer("end")} className={`${button} border-line text-ink`}>{t("checkinEnd")}</button>
      </div>
      <p className="text-sm text-ink2">{t("checkinHint")}</p>
    </section>
  );
}

/** Jornada pausada ou encerrada: mostra a decisão com respeito e permite retomar. */
export function PausedOrEnded({ state, update }: { state: ReadyJourney; update: JourneyUpdate }) {
  const t = useTranslations("Today");
  const format = useFormatter();
  const { progress, journey, readiness } = state;
  const ended = progress.endedAt !== null;
  const at = progress.endedAt ?? progress.pausedAt!;
  const date = format.dateTime(new Date(at), { dateStyle: "medium" });
  const done = journey.tasks.filter((x) => x.status === "done").length;
  return (
    <section className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-xl font-semibold">{ended ? t("endedTitle") : t("pausedTitle")}</h2>
      <p className="text-ink2">{ended ? t("endedBody", { date }) : t("pausedBody", { date })}</p>
      {ended && (
        <p className="rounded-xl bg-primary-soft p-3">
          {t("endedSummary", { done, percent: Math.round(readiness.total.ratio * 100) })}
        </p>
      )}
      <button type="button" onClick={() => update(resumeJourney, true)} className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action">
        {t("resume")}
      </button>
    </section>
  );
}

/** Carimbo de uma fase concluída (visual simples: ícone num círculo inclinado). */
export function Stamp({ phase, label, size = "lg" }: { phase: PhaseId; label: string; size?: "sm" | "lg" }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`grid shrink-0 -rotate-12 place-items-center rounded-full border-4 border-double border-done bg-surface ${
        size === "lg" ? "size-16 text-3xl" : "size-11 text-lg"
      }`}
    >
      <span aria-hidden="true">{PHASE_ICONS[phase]}</span>
    </span>
  );
}
