"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { buildFamilyProfile, getAnswer, type PathGroup, type PathKind, type VisiblePath } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { ReadyJourney } from "@/components/journey/journey-gate";
import { useJourneyText } from "@/components/journey/use-journey-text";
import { useOptionLabel } from "./use-option-label";

const KINDS: PathKind[] = ["permanent", "temporary"];
const GROUPS: PathGroup[] = ["work", "merit", "transfer", "investment", "family", "study", "other"];

type Props = { content: JourneyContent; state: ReadyJourney; onOpenPath: (id: string) => void };

export function FamilyProfileView({ content, state, onOpenPath }: Props) {
  const t = useTranslations("Family");
  const tb = useTranslations("QBlocks");
  const option = useOptionLabel();
  const { personName, taskTitle } = useJourneyText(content, state.data);
  const { data, journey, now } = state;
  const profile = buildFamilyProfile(data, journey, now);
  const atGoal = journey.departure !== null;

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const care = profile.people.filter((p) => p.needsSupport || p.continuousMedication);
  const prefs = profile.preferences;
  const prefItems = [
    prefs.climate && option("pref.climate", prefs.climate),
    prefs.placeSize && option("pref.placeSize", prefs.placeSize),
    prefs.pace && option("pref.pace", prefs.pace),
    ...prefs.familyPriorities.map((p) => option("pref.familyPriorities", p)),
  ].filter((x): x is string => !!x);

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-ink2">{t("intro")}</p>
      </section>

      <Section title={t("people")} block="household">
        <ul className="flex flex-col gap-1">
          {profile.people.map((p) => (
            <li key={p.personId} className="flex flex-wrap justify-between gap-2">
              <span className="font-semibold">{personName(p.personId)}</span>
              {p.ageAtDeparture !== undefined && (
                <span className="text-ink2">{t(atGoal ? "ageAtGoal" : "ageToday", { age: p.ageAtDeparture })}</span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("career")} block="career">
        {profile.workers.length === 0 ? (
          <p className="text-ink2">{t("careerEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.workers.map((id) => {
              const person = data.people.find((p) => p.id === id)!;
              const education = str(person.kind === "self" ? getAnswer(data, "you.education") : getAnswer(data, "career.education", person));
              const level = str(getAnswer(data, "career.level", person));
              const details = [education && option("you.education", education), level && option("career.level", level)].filter(Boolean);
              return (
                <li key={id} className="flex flex-col">
                  <span className="font-semibold">{personName(id)}</span>
                  <span className="text-ink2">{details.length > 0 ? details.join(" · ") : t("notAnswered")}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title={t("care")} block="health">
        {care.length === 0 ? (
          <p className="text-ink2">{t("careEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {care.map((p) => (
              <li key={p.personId}>
                <span className="font-semibold">{personName(p.personId)}</span>
                <span className="text-ink2">
                  {" · "}
                  {[p.needsSupport && t("needsSupport"), p.continuousMedication && t("medication")].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("money")} block="money">
        {profile.income.earnersUS.length === 0 ? (
          <p className="text-ink2">{t("notAnswered")}</p>
        ) : (
          <p>
            <span className="text-ink2">{t("earnersUS")} </span>
            <span className="font-semibold">{profile.income.earnersUS.map((e) => option("money.earnersUS", e)).join(", ")}</span>
          </p>
        )}
        {profile.income.singleIncome && (
          <p className="rounded-xl bg-celebrate-soft p-3 text-sm">💡 {t("singleIncome")}</p>
        )}
      </Section>

      <Section title={t("preferences")} block="pref">
        <p className={prefItems.length ? "" : "text-ink2"}>{prefItems.length ? prefItems.join(" · ") : t("notAnswered")}</p>
      </Section>

      {profile.attention.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-lg font-semibold">{t("attention")}</h2>
          <ul className="flex flex-col gap-1">
            {profile.attention.map((key) => (
              <li key={key}>
                <Link href={`/journey?task=${encodeURIComponent(key)}`} className="font-bold text-primary underline underline-offset-4">
                  {taskTitle(key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="paths-title" className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="paths-title" className="text-2xl font-semibold">{t("paths")}</h2>
          <p className="text-ink2">{t("pathsIntro")}</p>
        </div>

        {profile.paths.length === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <p className="text-ink2">{t("noPaths")}</p>
            <Link href="/journey?task=explore-paths" className="min-h-12 content-center rounded-full bg-action px-6 font-bold text-on-action">
              {t("noPathsAction")}
            </Link>
          </div>
        )}

        {KINDS.map((kind) => {
          const ofKind = profile.paths.filter((p) => p.kind === kind);
          if (ofKind.length === 0) return null;
          return (
            <div key={kind} className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{t(`kind.${kind}`)}</h3>
              <ul className="flex flex-col gap-2">
                {GROUPS.flatMap((g) => ofKind.filter((p) => p.group === g)).map((p) => (
                  <li key={p.pathId}>
                    <PathCard content={content} path={p} names={(p.personIds ?? []).map((id) => personName(id) ?? "")} onOpen={() => onOpenPath(p.pathId)} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {journey.missingBlocks.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-primary-soft p-4">
            <p className="font-semibold">{t("missingBlocks")}</p>
            <div className="flex flex-wrap gap-2">
              {journey.missingBlocks.map((b) => (
                <Link key={b} href={`/questionnaire?block=${b}`} className="flex min-h-11 items-center rounded-full border-2 border-primary px-4 font-bold text-primary">
                  {tb(`${b}.title`)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Section({ title, block, children }: { title: string; block: string; children: ReactNode }) {
  const t = useTranslations("Family");
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href={`/questionnaire?block=${block}`} className="flex min-h-11 shrink-0 items-center text-sm font-bold text-primary underline underline-offset-4">
          {t("changeAnswer")}
        </Link>
      </div>
      {children}
    </section>
  );
}

function PathCard({ content, path, names, onOpen }: { content: JourneyContent; path: VisiblePath; names: string[]; onOpen: () => void }) {
  const t = useTranslations("Family");
  const text = content.texts.paths[path.pathId];
  return (
    <button type="button" onClick={onOpen} className="flex min-h-14 w-full flex-col gap-1 rounded-2xl border border-line bg-surface p-4 text-start">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">{t(`group.${path.group}`)}</span>
      <span className="font-semibold">{text?.title ?? path.pathId}</span>
      <span className="text-sm text-ink2">{text?.summary}</span>
      {names.length > 0 && <span className="text-sm font-bold text-ink">{t("showsFor", { names: names.join(", ") })}</span>}
    </button>
  );
}
