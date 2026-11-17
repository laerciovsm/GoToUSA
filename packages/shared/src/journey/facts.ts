/**
 * Fatos calculados: contas que as condições do conteúdo consultam pelo nome (decisão de 17/11/2026).
 * Cada fato devolve undefined quando a resposta necessária ainda não existe ("não sei").
 * Ao criar um fato novo, acrescente o teste em journey.test.ts.
 */
import {
  ageAtDeparture,
  autonomyAskedInHousehold,
  departureDate,
  getAnswer,
  hasCareer,
  isAnswered,
  partnerIsGoing,
} from "../questionnaire/engine";
import type { QuestionnaireData } from "../questionnaire/types";

export type FactContext = { data: QuestionnaireData; now: Date };
export type FactValue = number | boolean | string | undefined;

const answered = (data: QuestionnaireData, id: string) => isAnswered(data.answers[id]);
const count = (data: QuestionnaireData, id: string) => {
  const v = data.answers[id];
  return typeof v === "number" ? Math.max(0, Math.floor(v)) : undefined;
};
const self = (data: QuestionnaireData) => data.people.find((p) => p.kind === "self");
const partner = (data: QuestionnaireData) => data.people.find((p) => p.kind === "partner");
const children = (data: QuestionnaireData) => data.people.filter((p) => p.kind === "child");

export const FACTS: Record<string, (ctx: FactContext) => FactValue> = {
  /** O cônjuge vai ou ainda não sabe. */
  partnerGoing: ({ data }) => (answered(data, "household.partner") ? partnerIsGoing(data) : undefined),
  /** Tem cônjuge (indo ou não). */
  hasPartner: ({ data }) =>
    answered(data, "household.partner") ? data.answers["household.partner"] !== "none" : undefined,
  childrenCount: ({ data }) => count(data, "household.children"),
  dependentsCount: ({ data }) => count(data, "household.dependents"),
  /** Algum filho com 18 anos ou mais na data de ida (a meta). */
  hasAdultChild: ({ data, now }) => {
    const ages = children(data).map((c) => ageAtDeparture(data, c, now));
    if (ages.some((a) => a === undefined)) return ages.some((a) => (a ?? 0) >= 18) ? true : undefined;
    return ages.some((a) => (a as number) >= 18);
  },
  /** Idade do filho mais velho na data de ida. */
  maxChildAgeAtDeparture: ({ data, now }) => {
    const ages = children(data).map((c) => ageAtDeparture(data, c, now));
    if (ages.length === 0 || ages.some((a) => a === undefined)) return undefined;
    return Math.max(...(ages as number[]));
  },
  /** Tem oferta de emprego ou é transferência pela empresa. */
  hasJobOffer: ({ data }) => {
    if (!answered(data, "goal.purpose") && !answered(data, "goal.has")) return undefined;
    const has = getAnswer(data, "goal.has");
    return (Array.isArray(has) && (has as unknown[]).includes("job_offer")) || data.answers["goal.purpose"] === "transfer";
  },
  /** Alguém da família tem deficiência ou precisa de cuidados. */
  hasSpecialNeeds: ({ data }) => data.people.some((p) => autonomyAskedInHousehold(data, p)),
  /** Meses inteiros até a data de ida (pode ser negativo), ou undefined em "ainda não sei". */
  monthsUntilDeparture: ({ data, now }) => {
    const dep = departureDate(data);
    if (!dep) return undefined;
    return (dep.getFullYear() - now.getFullYear()) * 12 + (dep.getMonth() - now.getMonth());
  },
  /** A data de ida já foi definida. */
  departureKnown: ({ data }) => departureDate(data) !== undefined,
  /** Você não é do lar. */
  selfHasCareer: ({ data }) => {
    const s = self(data);
    return s && answered(data, "you.workStatus") ? hasCareer(data, s) : undefined;
  },
  /** O cônjuge não é do lar. */
  partnerHasCareer: ({ data }) => {
    const p = partner(data);
    return p && answered(data, "partner.workStatus") ? hasCareer(data, p) : undefined;
  },
};
