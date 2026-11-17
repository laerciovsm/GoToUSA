/**
 * Cálculos da tela "Hoje" (docs/telas.md, seção 1). Funções puras e testadas.
 */
import type { QuestionnaireData } from "../questionnaire/types";
import { parseIsoDate, WEEKLY_HOURS } from "./dates";
import { PHASE_IDS, type Journey, type JourneyTask } from "./types";

const PHASE_ORDER = new Map(PHASE_IDS.map((id, i) => [id, i]));
/** Sem tempo semanal informado, considera de 1 a 3 horas (a opção mais comum). */
const DEFAULT_WEEKLY_HOURS = 3;
const MAX_WEEK_STEPS = 5;

/**
 * Passos desta semana: o próximo passo primeiro e depois prioridades, destaques e a ordem da jornada,
 * até somar as horas por semana que a pessoa escolheu (rhythm.weeklyTime). Sempre pelo menos 1 e no máximo 5.
 */
export function weekSteps(journey: Journey, data: QuestionnaireData): JourneyTask[] {
  const open = journey.tasks.filter((t) => t.state === "open" && (t.status === "todo" || t.status === "doing"));
  const rank = (t: JourneyTask) => [
    t.key === journey.nextStep ? 0 : 1,
    t.priority ? 0 : 1,
    t.highlighted ? 0 : 1,
    PHASE_ORDER.get(t.phase) ?? 99,
  ];
  const sorted = open
    .map((t, i) => ({ t, i, r: rank(t) }))
    .sort((a, b) => {
      for (let k = 0; k < a.r.length; k++) if (a.r[k] !== b.r[k]) return a.r[k]! - b.r[k]!;
      return a.i - b.i;
    })
    .map((x) => x.t);
  const budget = WEEKLY_HOURS[String(data.answers["rhythm.weeklyTime"] ?? "")] ?? DEFAULT_WEEKLY_HOURS;
  const result: JourneyTask[] = [];
  let used = 0;
  for (const task of sorted) {
    if (result.length >= MAX_WEEK_STEPS) break;
    if (result.length > 0 && used + task.hours > budget) continue;
    result.push(task);
    used += task.hours;
  }
  return result;
}

/** Meses inteiros que faltam até a meta (dia 1º do mês de ida). 0 no próprio mês; negativo se já passou. */
export function monthsUntil(departure: string, now: Date): number {
  const d = parseIsoDate(departure);
  return (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
}
