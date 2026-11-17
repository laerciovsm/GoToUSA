"use client";

import { useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { COMMON_CURRENCIES, MED_FREQUENCIES, MED_UNITS, type Medication, type Money } from "@gotousa/shared";

export const optionClass = (selected: boolean, disabled = false) =>
  [
    "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-start",
    selected ? "border-primary bg-primary-soft" : "border-line bg-surface",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].join(" ");

export const inputClass =
  "min-h-12 w-full rounded-2xl border-2 border-line bg-surface px-4 py-3 text-ink placeholder:text-ink2/70 focus:border-primary";

export type ChoiceItem = { value: string; label: string };

/** Escolha de uma opção (botões grandes, um embaixo do outro). */
export function SingleChoice(props: {
  labelledBy: string;
  items: ChoiceItem[];
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const name = useId();
  return (
    <fieldset aria-labelledby={props.labelledBy} className="flex flex-col gap-2">
      {props.items.map((item) => (
        <label key={item.value} className={optionClass(props.value === item.value)}>
          <input
            type="radio"
            name={name}
            value={item.value}
            checked={props.value === item.value}
            onChange={() => props.onChange(item.value)}
            className="size-5 shrink-0 accent-primary"
          />
          <span>{item.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

/** Escolha de várias opções. Opções "exclusivas" (ex.: Nenhuma) desmarcam as outras. */
export function MultiChoice(props: {
  labelledBy: string;
  items: ChoiceItem[];
  value: string[];
  onChange: (value: string[]) => void;
  exclusive?: readonly string[];
  max?: number;
}) {
  const t = useTranslations("Questionnaire.controls");
  const exclusive = props.exclusive ?? [];

  const toggle = (option: string) => {
    if (props.value.includes(option)) {
      props.onChange(props.value.filter((v) => v !== option));
    } else if (exclusive.includes(option)) {
      props.onChange([option]);
    } else {
      props.onChange([...props.value.filter((v) => !exclusive.includes(v)), option]);
    }
  };

  const full = props.max !== undefined && props.value.length >= props.max;

  return (
    <fieldset aria-labelledby={props.labelledBy} className="flex flex-col gap-2">
      {props.max !== undefined && <p className="text-sm text-ink2">{t("maxReached", { max: props.max })}</p>}
      {props.items.map((item) => {
        const checked = props.value.includes(item.value);
        const disabled = !checked && full;
        return (
          <label key={item.value} className={optionClass(checked, disabled)}>
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(item.value)}
              className="size-5 shrink-0 accent-primary"
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function TextAnswer(props: {
  labelledBy: string;
  value: string;
  onChange: (value: string) => void;
  long?: boolean;
  placeholder?: string;
}) {
  if (props.long) {
    return (
      <textarea
        aria-labelledby={props.labelledBy}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        rows={5}
        maxLength={5000}
        className={inputClass}
      />
    );
  }
  return (
    <input
      type="text"
      aria-labelledby={props.labelledBy}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      maxLength={200}
      className={inputClass}
    />
  );
}

/** Número inteiro. Só grava quando o valor é válido e está dentro dos limites. */
export function NumberAnswer(props: {
  labelledBy: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  const t = useTranslations("Questionnaire.controls");
  const errorId = useId();
  const [text, setText] = useState(props.value === undefined ? "" : String(props.value));
  const min = props.min ?? 0;
  const max = props.max ?? 1_000_000;
  const parsed = text.trim() === "" ? undefined : Number(text);
  const invalid = parsed !== undefined && (!Number.isInteger(parsed) || parsed < min || parsed > max);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        inputMode="numeric"
        aria-labelledby={props.labelledBy}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        value={text}
        placeholder={props.placeholder}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d]/g, "");
          setText(next);
          const n = next === "" ? undefined : Number(next);
          props.onChange(n !== undefined && n >= min && n <= max ? n : undefined);
        }}
        className={`${inputClass} max-w-48`}
      />
      {invalid && (
        <p id={errorId} className="text-sm font-semibold text-error">
          {t("numberRange", { min, max })}
        </p>
      )}
    </div>
  );
}

/** Mês e ano ("AAAA-MM"), com a opção "Ainda não sei". */
export function MonthYearAnswer(props: {
  labelledBy: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  range: "past" | "future";
  allowUnsure?: boolean;
}) {
  const t = useTranslations("Questionnaire.controls");
  const locale = useLocale();
  const unsureId = useId();
  const match = /^(\d{4})-(\d{2})$/.exec(props.value ?? "");
  const [year, setYear] = useState(match?.[1] ?? "");
  const [month, setMonth] = useState(match?.[2] ?? "");
  const unsure = props.value === "unsure";

  const months = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
    return Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: format.format(new Date(Date.UTC(2000, i, 1))),
    }));
  }, [locale]);

  const thisYear = new Date().getFullYear();
  const years =
    props.range === "future"
      ? Array.from({ length: 16 }, (_, i) => String(thisYear + i))
      : Array.from({ length: 110 }, (_, i) => String(thisYear - i));

  const commit = (y: string, m: string) => props.onChange(y && m ? `${y}-${m}` : undefined);
  const selectClass = `${inputClass} disabled:opacity-50`;

  return (
    <div className="flex flex-col gap-3" role="group" aria-labelledby={props.labelledBy}>
      <div className="flex flex-wrap gap-3">
        <label className="flex min-w-40 flex-1 flex-col gap-1 text-sm font-semibold text-ink2">
          {t("month")}
          <select
            value={month}
            disabled={unsure}
            onChange={(e) => {
              setMonth(e.target.value);
              commit(year, e.target.value);
            }}
            className={selectClass}
          >
            <option value="">{t("choose")}</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-32 flex-1 flex-col gap-1 text-sm font-semibold text-ink2">
          {t("year")}
          <select
            value={year}
            disabled={unsure}
            onChange={(e) => {
              setYear(e.target.value);
              commit(e.target.value, month);
            }}
            className={selectClass}
          >
            <option value="">{t("choose")}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
      {props.allowUnsure && (
        <label htmlFor={unsureId} className={optionClass(unsure)}>
          <input
            id={unsureId}
            type="checkbox"
            checked={unsure}
            onChange={(e) => (e.target.checked ? props.onChange("unsure") : commit(year, month))}
            className="size-5 shrink-0 accent-primary"
          />
          <span>{t("unsure")}</span>
        </label>
      )}
    </div>
  );
}

export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Lista com busca (países, idiomas, estados). Os escolhidos aparecem no topo, com botão para remover. */
export function SearchableChoice(props: {
  labelledBy: string;
  items: ChoiceItem[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple: boolean;
}) {
  const t = useTranslations("Questionnaire.controls");
  const [query, setQuery] = useState("");
  const name = useId();
  const labels = useMemo(() => new Map(props.items.map((i) => [i.value, i.label])), [props.items]);
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return q ? props.items.filter((i) => normalize(i.label).includes(q) || i.value.toLowerCase() === q) : props.items;
  }, [props.items, query]);

  const toggle = (value: string) => {
    if (!props.multiple) return props.onChange([value]);
    props.onChange(props.value.includes(value) ? props.value.filter((v) => v !== value) : [...props.value, value]);
  };

  return (
    <div className="flex flex-col gap-3">
      {props.value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={t("selectedCount", { count: props.value.length })}>
          {props.value.map((v) => (
            <li key={v}>
              <button
                type="button"
                onClick={() => props.onChange(props.value.filter((x) => x !== v))}
                aria-label={t("remove", { item: labels.get(v) ?? v })}
                className="flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 font-semibold text-on-primary"
              >
                {labels.get(v) ?? v}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search")}
        aria-label={t("search")}
        className={inputClass}
      />
      <fieldset
        aria-labelledby={props.labelledBy}
        className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto rounded-2xl border border-line p-2"
      >
        {filtered.length === 0 && <p className="p-3 text-ink2">{t("noResults")}</p>}
        {filtered.map((item) => {
          const checked = props.value.includes(item.value);
          return (
            <label key={item.value} className={optionClass(checked)}>
              <input
                type={props.multiple ? "checkbox" : "radio"}
                name={name}
                checked={checked}
                onChange={() => toggle(item.value)}
                className="size-5 shrink-0 accent-primary"
              />
              <span>{item.label}</span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

/** Converte texto digitado em valor. Aceita "1.234,56", "1,234.56" e "1234.56". */
function parseAmount(text: string): number | undefined {
  const clean = text.replace(/[^\d.,]/g, "");
  if (!clean) return undefined;
  const lastSep = Math.max(clean.lastIndexOf("."), clean.lastIndexOf(","));
  const decimals = lastSep >= 0 ? clean.length - lastSep - 1 : 0;
  // Separador seguido de 1 ou 2 dígitos é decimal; de 3 dígitos é separador de milhar.
  const normalized =
    lastSep >= 0 && decimals > 0 && decimals <= 2
      ? `${clean.slice(0, lastSep).replace(/[.,]/g, "")}.${clean.slice(lastSep + 1)}`
      : clean.replace(/[.,]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

/** Valor em dinheiro, com moeda fixa ou escolhida pela pessoa. */
export function MoneyAnswer(props: {
  labelledBy: string;
  value: Money | undefined;
  onChange: (value: Money | undefined) => void;
  fixedCurrency?: string;
  defaultCurrency: string;
}) {
  const t = useTranslations("Questionnaire.controls");
  const locale = useLocale();
  const [text, setText] = useState(props.value ? String(props.value.amount) : "");
  const [currency, setCurrency] = useState(props.fixedCurrency ?? props.value?.currency ?? props.defaultCurrency);

  const currencies = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: "currency" });
    const all = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("currency") : [];
    const rest = all.filter((c) => !COMMON_CURRENCIES.includes(c));
    return [...COMMON_CURRENCIES, ...rest].map((code) => ({ code, label: `${code} · ${names.of(code) ?? code}` }));
  }, [locale]);

  const commit = (nextText: string, nextCurrency: string) => {
    const amount = parseAmount(nextText);
    props.onChange(amount === undefined ? undefined : { amount, currency: nextCurrency });
  };

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-labelledby={props.labelledBy}>
      <label className="flex min-w-40 flex-1 flex-col gap-1 text-sm font-semibold text-ink2">
        {t("amount")}
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            commit(e.target.value, currency);
          }}
          className={inputClass}
        />
      </label>
      {props.fixedCurrency ? (
        <p className="flex items-end pb-3 font-bold">{props.fixedCurrency}</p>
      ) : (
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm font-semibold text-ink2">
          {t("currency")}
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              commit(text, e.target.value);
            }}
            className={inputClass}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

const EMPTY_MEDICATION: Medication = { name: "", amount: null, unit: "", frequency: "", special: "" };

/**
 * Lista de remédios. Só o nome é digitado; quantidade, unidade e frequência são escolhidas,
 * para as respostas ficarem padronizadas (ver MED_UNITS e MED_FREQUENCIES).
 */
export function MedicationsAnswer(props: { value: Medication[]; onChange: (value: Medication[]) => void }) {
  const t = useTranslations("Questionnaire.controls");
  const [rows, setRows] = useState<Medication[]>(props.value.length > 0 ? props.value : [EMPTY_MEDICATION]);
  const [amountText, setAmountText] = useState<string[]>(() =>
    (props.value.length > 0 ? props.value : [EMPTY_MEDICATION]).map((m) => (m.amount === null ? "" : String(m.amount))),
  );

  const update = (next: Medication[]) => {
    setRows(next);
    // Só grava os remédios com nome preenchido.
    props.onChange(next.filter((m) => m.name.trim() !== ""));
  };
  const setField = <K extends keyof Medication>(index: number, field: K, value: Medication[K]) =>
    update(rows.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  return (
    <div className="flex flex-col gap-4">
      {rows.map((med, index) => (
        <fieldset key={index} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 font-semibold">{t("medItem", { n: index + 1 })}</legend>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink2">
            {t("medName")}
            <input
              type="text"
              value={med.name}
              maxLength={200}
              onChange={(e) => setField(index, "name", e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="flex w-28 flex-col gap-1 text-sm font-semibold text-ink2">
              {t("medAmount")}
              <input
                type="text"
                inputMode="decimal"
                value={amountText[index] ?? ""}
                maxLength={10}
                onChange={(e) => {
                  const text = e.target.value;
                  setAmountText((prev) => prev.map((v, i) => (i === index ? text : v)));
                  setField(index, "amount", parseAmount(text) ?? null);
                }}
                className={inputClass}
              />
            </label>
            <label className="flex min-w-40 flex-1 flex-col gap-1 text-sm font-semibold text-ink2">
              {t("medUnit")}
              <select value={med.unit} onChange={(e) => setField(index, "unit", e.target.value)} className={inputClass}>
                <option value="">{t("choose")}</option>
                {MED_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {t(`medUnits.${u}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink2">
            {t("medFrequency")}
            <select
              value={med.frequency}
              onChange={(e) => setField(index, "frequency", e.target.value)}
              className={inputClass}
            >
              <option value="">{t("choose")}</option>
              {MED_FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {t(`medFrequencies.${f}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-ink2">
            {t("medSpecial")}
            <select
              value={med.special}
              onChange={(e) => setField(index, "special", e.target.value as Medication["special"])}
              className={inputClass}
            >
              <option value="">{t("choose")}</option>
              <option value="yes">{t("yes")}</option>
              <option value="no">{t("no")}</option>
              <option value="unsure">{t("dontKnow")}</option>
            </select>
          </label>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setAmountText((prev) => prev.filter((_, i) => i !== index));
                update(rows.filter((_, i) => i !== index));
              }}
              className="min-h-11 self-start font-bold text-error underline underline-offset-4"
            >
              {t("medRemove")}
            </button>
          )}
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => {
          setRows([...rows, EMPTY_MEDICATION]);
          setAmountText((prev) => [...prev, ""]);
        }}
        className="min-h-11 self-start rounded-full border-2 border-primary px-5 font-bold text-primary"
      >
        + {t("medAdd")}
      </button>
    </div>
  );
}
