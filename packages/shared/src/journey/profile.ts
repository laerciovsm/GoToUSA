/**
 * Perfil da família (docs/caminhos-visto.md, passo 5 aprovado em 17/11/2026).
 * Calculado na hora a partir das respostas. Guarda só IDs e códigos: a tela traduz.
 * Sem detalhes sensíveis: "medicação contínua" e "precisa de apoio", nunca nomes de remédios ou diagnósticos.
 */
import { ageAtDeparture, autonomyAskedInHousehold, getAnswer, isAnswered, peopleOf, personSex } from "../questionnaire/engine.ts";
import type { PersonKind, QuestionnaireData } from "../questionnaire/types.ts";
import type { Journey, VisiblePath } from "./types.ts";

export type ProfilePerson = {
  personId: string;
  kind: PersonKind;
  /** Idade na data de ida (a meta), ou hoje sem data de ida. */
  ageAtDeparture: number | undefined;
  sex: string | undefined;
  /** Precisa de apoio no dia a dia (deficiência ou cuidados). */
  needsSupport: boolean;
  continuousMedication: boolean;
};

export type FamilyProfile = {
  people: ProfilePerson[];
  /** Quem está no perfil profissional (você, cônjuge e adultos que vão trabalhar). */
  workers: string[];
  income: {
    earnersNow: string[];
    earnersUS: string[];
    /** Fator de risco: só uma pessoa pretende trabalhar nos EUA. */
    singleIncome: boolean;
  };
  preferences: { climate?: string; placeSize?: string; pace?: string; familyPriorities: string[] };
  /** Pontos de atenção = as tarefas de alerta legal que se aplicam (uma fonte só). */
  attention: string[];
  paths: VisiblePath[];
};

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const strs = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

export function buildFamilyProfile(data: QuestionnaireData, journey: Journey, now: Date = new Date()): FamilyProfile {
  const people: ProfilePerson[] = data.people.map((person) => {
    const autonomy = getAnswer(data, "health.autonomy", person);
    return {
      personId: person.id,
      kind: person.kind,
      ageAtDeparture: ageAtDeparture(data, person, now),
      sex: personSex(data, person),
      needsSupport: autonomyAskedInHousehold(data, person) || (autonomy !== undefined && autonomy !== "independent"),
      continuousMedication: isAnswered(getAnswer(data, "health.medications", person)),
    };
  });
  const earnersUS = strs(data.answers["money.earnersUS"]).filter((e) => e !== "unsure");
  return {
    people,
    workers: peopleOf(data, "workers").map((p) => p.id),
    income: {
      earnersNow: strs(data.answers["money.earnersNow"]),
      earnersUS,
      singleIncome: earnersUS.length === 1,
    },
    preferences: {
      climate: str(data.answers["pref.climate"]),
      placeSize: str(data.answers["pref.placeSize"]),
      pace: str(data.answers["pref.pace"]),
      familyPriorities: strs(data.answers["pref.familyPriorities"]).filter((p) => p !== "none"),
    },
    attention: journey.tasks.filter((t) => t.type === "alert" && t.status !== "na").map((t) => t.key),
    paths: journey.paths,
  };
}
