"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { US_STATES } from "@gotousa/shared";
import { inputClass, normalize, optionClass } from "./controls";

/** Arquivo gerado por scripts/build-us-cities.mjs a partir do U.S. Census Bureau. */
type CityFile = {
  source: string;
  sourceUrl: string;
  vintage: string;
  retrieved: string;
  /** [código do lugar no Census, nome, população estimada], da maior para a menor. */
  cities: [string, string, number][];
};

const TOP_COUNT = 3;
const SEARCH_LIMIT = 8;
const cache = new Map<string, Promise<CityFile>>();

/** Baixa a lista de cidades de um estado só quando é preciso (e uma vez só). */
function loadState(code: string): Promise<CityFile> {
  let promise = cache.get(code);
  if (!promise) {
    promise = fetch(`/data/us-cities/${code}.json`).then((r) => {
      if (!r.ok) throw new Error(`Falha ao carregar as cidades de ${code}`);
      return r.json() as Promise<CityFile>;
    });
    promise.catch(() => cache.delete(code));
    cache.set(code, promise);
  }
  return promise;
}

const stateName = (code: string) => US_STATES.find((s) => s.code === code)?.name ?? code;

/**
 * Cidades por estado: para cada estado escolhido antes, as maiores cidades em destaque,
 * busca por qualquer outra cidade do estado e a opção "ainda não sei a cidade".
 * Valores: "UF-código do lugar" ou "UF-unsure".
 */
export function UsCitiesAnswer(props: {
  labelledBy: string;
  states: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const t = useTranslations("Questionnaire.controls");
  // Com 1 ou 2 estados, tudo aberto; com mais, cada estado abre e fecha.
  const collapsible = props.states.length > 2;
  return (
    <div role="group" aria-labelledby={props.labelledBy} className="flex flex-col gap-3">
      {props.states.map((code) => (
        <StateCities
          key={code}
          code={code}
          collapsible={collapsible}
          value={props.value}
          onChange={props.onChange}
        />
      ))}
      <p className="text-sm text-ink2">{t("citiesSource")}</p>
    </div>
  );
}

function StateCities(props: {
  code: string;
  collapsible: boolean;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const t = useTranslations("Questionnaire.controls");
  const { code } = props;
  const [file, setFile] = useState<CityFile | undefined>();
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    loadState(code).then(
      (data) => active && setFile(data),
      () => active && setFailed(true),
    );
    return () => {
      active = false;
    };
  }, [code]);

  const prefix = `${code}-`;
  const unsureKey = `${code}-unsure`;
  const mine = props.value.filter((v) => v.startsWith(prefix));
  const byPlace = useMemo(() => new Map((file?.cities ?? []).map((c) => [c[0], c])), [file]);
  const top = (file?.cities ?? []).slice(0, TOP_COUNT);
  const topIds = new Set(top.map((c) => c[0]));
  // Cidades escolhidas pela busca (fora das maiores) continuam visíveis e marcadas.
  const pickedOthers = mine
    .map((v) => v.slice(prefix.length))
    .filter((place) => place !== "unsure" && !topIds.has(place))
    .map((place) => byPlace.get(place))
    .filter((c): c is [string, string, number] => c !== undefined);
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2 || !file) return [];
    return file.cities
      .filter((c) => !topIds.has(c[0]) && !mine.includes(`${prefix}${c[0]}`) && normalize(c[1]).includes(q))
      .slice(0, SEARCH_LIMIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, file, props.value]);

  const toggle = (key: string) => {
    if (props.value.includes(key)) return props.onChange(props.value.filter((v) => v !== key));
    // "Ainda não sei" desmarca as cidades do estado, e escolher uma cidade desmarca o "ainda não sei".
    const others = props.value.filter((v) => (key === unsureKey ? !v.startsWith(prefix) : v !== unsureKey));
    props.onChange([...others, key]);
  };

  const cityOption = (city: [string, string, number], highlight: boolean) => {
    const key = `${prefix}${city[0]}`;
    const checked = props.value.includes(key);
    return (
      <label key={key} className={optionClass(checked)}>
        <input type="checkbox" checked={checked} onChange={() => toggle(key)} className="size-5 shrink-0 accent-primary" />
        <span className="flex flex-col">
          <span className={highlight ? "font-semibold" : undefined}>{city[1]}</span>
          <span className="text-sm text-ink2">{t("cityPopulation", { n: city[2] })}</span>
        </span>
      </label>
    );
  };

  const body = (
    <div className="flex flex-col gap-2">
      {failed && <p role="alert" className="text-ink2">{t("citiesLoadError")}</p>}
      {!file && !failed && <p className="text-ink2">{t("citiesLoading")}</p>}
      {file && (
        <>
          <p className="text-sm font-bold uppercase tracking-widest text-ink2">{t("citiesLargest")}</p>
          {top.map((c) => cityOption(c, true))}
          {pickedOthers.map((c) => cityOption(c, false))}
          {file.cities.length > TOP_COUNT && (
            <label className="mt-2 flex flex-col gap-1 text-sm font-semibold text-ink2">
              {t("citiesSearch", { state: stateName(code) })}
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={inputClass}
              />
            </label>
          )}
          {query.trim().length >= 2 && results.length === 0 && <p className="text-ink2">{t("noResults")}</p>}
          {results.map((c) => cityOption(c, false))}
          <label className={`${optionClass(props.value.includes(unsureKey))} mt-2`}>
            <input
              type="checkbox"
              checked={props.value.includes(unsureKey)}
              onChange={() => toggle(unsureKey)}
              className="size-5 shrink-0 accent-primary"
            />
            <span>{t("citiesUnsure")}</span>
          </label>
        </>
      )}
    </div>
  );

  const title = (
    <span className="flex flex-1 items-center justify-between gap-2">
      <span className="text-lg font-semibold">{stateName(code)}</span>
      {mine.length > 0 && <span className="text-sm text-ink2">{t("selectedCount", { count: mine.length })}</span>}
    </span>
  );

  if (!props.collapsible) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-line p-4">
        <h2>{title}</h2>
        {body}
      </section>
    );
  }
  return (
    <details className="group rounded-2xl border border-line p-4" open={mine.length > 0}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90 rtl:-scale-x-100">
          ▸
        </span>
        {title}
      </summary>
      <div className="mt-3">{body}</div>
    </details>
  );
}
