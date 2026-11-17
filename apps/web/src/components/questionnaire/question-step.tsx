"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  COUNTRY_CODES,
  LANGUAGE_CODES,
  US_STATES,
  canAdvance,
  getAnswer,
  isAnswered,
  textSexValues,
  visibleOptions,
  type AnswerValue,
  type Medication,
  type Money,
  type QuestionnaireData,
  type Step,
} from "@gotousa/shared";
import {
  MedicationsAnswer,
  MonthYearAnswer,
  MoneyAnswer,
  MultiChoice,
  NumberAnswer,
  SearchableChoice,
  SingleChoice,
  TextAnswer,
  type ChoiceItem,
} from "./controls";
import { UsCitiesAnswer } from "./us-cities-answer";
import { usePersonLabel } from "./use-person-label";

type Props = {
  step: Step;
  index: number;
  total: number;
  blockTitle: string;
  data: QuestionnaireData;
  defaultCurrency: string;
  onAnswer: (value: AnswerValue | undefined) => void;
  onBack: () => void;
  onNext: () => void;
};

const asString = (v: AnswerValue | undefined) => (typeof v === "string" ? v : undefined);
const asStrings = (v: AnswerValue | undefined) =>
  Array.isArray(v) && v.every((x) => typeof x === "string") ? (v as string[]) : [];

/** Lista de códigos com nomes no idioma da pessoa, em ordem alfabética. */
function useDisplayItems(codes: readonly string[], type: "region" | "language"): ChoiceItem[] {
  const locale = useLocale();
  return useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type, fallback: "code" });
    const collator = new Intl.Collator(locale);
    return codes
      .map((code) => ({ value: code, label: names.of(code) ?? code }))
      .sort((a, b) => collator.compare(a.label, b.label));
  }, [codes, locale, type]);
}

export function QuestionStep({ step, index, total, blockTitle, data, defaultCurrency, onAnswer, onBack, onNext }: Props) {
  const t = useTranslations("Questionnaire");
  const q = useTranslations("Q");
  const personLabel = usePersonLabel(data);
  const headingId = useId();
  const whyId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showWhy, setShowWhy] = useState(false);

  const countries = useDisplayItems(COUNTRY_CODES, "region");
  const languages = useDisplayItems(LANGUAGE_CODES, "language");

  const { question, person } = step;
  const value = getAnswer(data, question.id, person);
  const optionKey = question.optionsFrom ?? question.id;
  const now = new Date();
  // Sexo de quem a pergunta fala, para os textos com gênero (ex.: "dele"/"dela").
  const sexValues = textSexValues(data, step, now);
  const optionItems = visibleOptions(question, { record: data, person, now }).map((o) => ({
    value: o,
    label: q(`${optionKey}.options.${o}`, sexValues),
  }));
  const placeholder = q.has(`${question.id}.placeholder`) ? q(`${question.id}.placeholder`) : undefined;
  const hint = q.has(`${question.id}.hint`) ? q(`${question.id}.hint`, sexValues) : undefined;

  // Leva o foco para o título a cada nova pergunta (leitores de tela e teclado).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step.key]);

  const answered = isAnswered(value);
  const isLast = index === total - 1;
  const nextLabel = !answered && question.optional ? t("skip") : isLast ? t("finishBlock") : t("next");

  function renderControl() {
    switch (question.type) {
      case "single":
        return <SingleChoice labelledBy={headingId} items={optionItems} value={asString(value)} onChange={onAnswer} />;
      case "multi":
        return (
          <MultiChoice
            labelledBy={headingId}
            items={optionItems}
            value={asStrings(value)}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
            exclusive={question.exclusive}
            max={question.max}
          />
        );
      case "text":
        return (
          <TextAnswer
            labelledBy={headingId}
            value={asString(value) ?? ""}
            onChange={(v) => onAnswer(v === "" ? undefined : v)}
            long={question.long}
            placeholder={placeholder}
          />
        );
      case "number":
        return (
          <NumberAnswer
            labelledBy={headingId}
            value={typeof value === "number" ? value : undefined}
            onChange={onAnswer}
            min={question.min}
            max={question.maxValue}
            placeholder={placeholder}
          />
        );
      case "monthYear":
        return (
          <MonthYearAnswer
            labelledBy={headingId}
            value={asString(value)}
            onChange={onAnswer}
            range={question.range ?? "past"}
            allowUnsure={question.allowUnsure}
          />
        );
      case "country":
      case "countries":
        return (
          <SearchableChoice
            labelledBy={headingId}
            items={countries}
            value={question.type === "country" ? (asString(value) ? [asString(value)!] : []) : asStrings(value)}
            onChange={(v) => onAnswer(question.type === "country" ? v[0] : v.length > 0 ? v : undefined)}
            multiple={question.type === "countries"}
          />
        );
      case "languages":
        return (
          <SearchableChoice
            labelledBy={headingId}
            items={languages}
            value={asStrings(value)}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
            multiple
          />
        );
      case "usStates":
        return (
          <SearchableChoice
            labelledBy={headingId}
            items={US_STATES.map((s) => ({ value: s.code, label: s.name }))}
            value={asStrings(value)}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
            multiple
          />
        );
      case "usCities": {
        // Só os estados escolhidos (e válidos) e só as cidades desses estados.
        const states = asStrings(question.statesFrom ? getAnswer(data, question.statesFrom) : undefined).filter((code) =>
          US_STATES.some((s) => s.code === code),
        );
        return (
          <UsCitiesAnswer
            labelledBy={headingId}
            states={states}
            value={asStrings(value).filter((v) => states.includes(v.split("-")[0]!))}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
          />
        );
      }
      case "money":
        return (
          <MoneyAnswer
            labelledBy={headingId}
            value={typeof value === "object" && !Array.isArray(value) ? (value as Money) : undefined}
            onChange={onAnswer}
            fixedCurrency={question.currency}
            defaultCurrency={defaultCurrency}
          />
        );
      case "medications":
        return (
          <MedicationsAnswer
            value={Array.isArray(value) ? (value as Medication[]) : []}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
          />
        );
      case "people": {
        const people = data.people.filter((p) => !(question.excludeSelf && p.id === person?.id));
        const items: ChoiceItem[] = [
          ...people.map((p) => ({ value: p.id, label: personLabel(p) })),
          ...(question.extraOptions ?? []).map((o) => ({ value: o, label: q(`${question.id}.options.${o}`) })),
        ];
        return question.multiple ? (
          <MultiChoice
            labelledBy={headingId}
            items={items}
            value={asStrings(value)}
            onChange={(v) => onAnswer(v.length > 0 ? v : undefined)}
          />
        ) : (
          <SingleChoice labelledBy={headingId} items={items} value={asString(value)} onChange={onAnswer} />
        );
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-primary">
            {blockTitle} · {t("stepOf", { current: index + 1, total })}
          </p>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index + 1}
            aria-label={t("stepOf", { current: index + 1, total })}
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>

        {person && (
          <p className="self-start rounded-full bg-celebrate-soft px-3 py-1 text-sm font-bold text-ink">
            {t("aboutPerson", { person: personLabel(person) })}
          </p>
        )}

        <h1 id={headingId} ref={headingRef} tabIndex={-1} className="text-2xl font-semibold leading-snug outline-none">
          {q(`${question.id}.label`, sexValues)}
        </h1>

        <div>
          <button
            type="button"
            aria-expanded={showWhy}
            aria-controls={whyId}
            onClick={() => setShowWhy((s) => !s)}
            className="min-h-11 font-bold text-primary underline underline-offset-4"
          >
            {t("whyAsk")}
          </button>
          <p id={whyId} hidden={!showWhy} className="mt-1 rounded-2xl bg-primary-soft p-4 text-ink2">
            {q(`${question.id}.why`, sexValues)}
          </p>
        </div>

        {hint && <p className="text-ink2">{hint}</p>}

        {renderControl()}
      </div>

      <nav className="sticky bottom-0 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 rounded-full border-2 border-line px-5 font-bold text-ink"
          >
            {t("previous")}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance(step, data)}
            className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel}
          </button>
        </div>
      </nav>
    </div>
  );
}
