/**
 * Cálculo de prazos (Marco 3, passo 4, aprovado em 17/11/2026).
 * Três datas de referência: início da jornada (Fase 0), data de ida (Fases 1 a 3, para trás)
 * e data de chegada (Fases 4 a 6, para frente). Tudo em dias do calendário, sem horário.
 */
import type { Deadline, DueRelative, PhaseId } from "./types";

export type DateRefs = {
  start: Date;
  /** Dia 1º do mês de ida, ou undefined em "ainda não sei". */
  departure: Date | undefined;
  /** Chegada real informada, ou a própria data de ida. */
  arrival: Date | undefined;
  /** Prazo da Fase 0 escolhido pela pessoa. */
  discoveryDue: Date | undefined;
};

/** AAAA-MM-DD → data local. */
export function parseIsoDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

/** Soma meses mantendo o dia (ou o último dia do mês, se não existir). */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Dias inteiros entre duas datas (b - a). */
export function daysBetween(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / 86_400_000);
}

/** Prazo padrão de cada fase: o fim da sua janela (sugestão de organização do app, não fato legal). */
export const PHASE_DEFAULT_DEADLINE: Record<PhaseId, Deadline | null> = {
  discovery: { from: "start", monthsAfter: 1 },
  planning: { from: "departure", monthsBefore: 12 },
  preparation: { from: "departure", monthsBefore: 3 },
  move: { from: "departure" },
  arrival: { from: "arrival", daysAfter: 90 },
  settling: { from: "arrival", monthsAfter: 12 },
  future: null,
};

/** Texto relativo do prazo ("12 meses antes da ida"), usado quando não há data. */
export function relativeOf(deadline: Deadline): DueRelative {
  if (deadline.from === "departure") {
    const { monthsBefore, weeksBefore, daysBefore } = deadline;
    if (monthsBefore) return { ref: "departure", amount: monthsBefore, unit: "months", direction: "before" };
    if (weeksBefore) return { ref: "departure", amount: weeksBefore, unit: "weeks", direction: "before" };
    return { ref: "departure", amount: daysBefore ?? 0, unit: "days", direction: "before" };
  }
  const { monthsAfter, weeksAfter, daysAfter } = deadline;
  if (monthsAfter) return { ref: deadline.from, amount: monthsAfter, unit: "months", direction: "after" };
  if (weeksAfter) return { ref: deadline.from, amount: weeksAfter, unit: "weeks", direction: "after" };
  return { ref: deadline.from, amount: daysAfter ?? 0, unit: "days", direction: "after" };
}

/**
 * Prazo de uma tarefa: o próprio, ou o fim da janela da fase.
 * Devolve a data (quando a referência existe) e o texto relativo.
 */
export function computeDue(
  deadline: Deadline | null,
  phase: PhaseId,
  refs: DateRefs,
): { due: Date | undefined; relative: DueRelative | null } {
  // A Fase 0 sem prazo próprio usa o prazo escolhido pela pessoa, quando houver.
  if (!deadline && phase === "discovery" && refs.discoveryDue) {
    return { due: refs.discoveryDue, relative: relativeOf(PHASE_DEFAULT_DEADLINE.discovery!) };
  }
  const effective = deadline ?? PHASE_DEFAULT_DEADLINE[phase];
  if (!effective) return { due: undefined, relative: null };

  const relative = relativeOf(effective);
  const base = effective.from === "start" ? refs.start : effective.from === "departure" ? refs.departure : refs.arrival;
  if (!base) return { due: undefined, relative };

  const sign = relative.direction === "before" ? -1 : 1;
  const due =
    relative.unit === "months"
      ? addMonths(base, sign * relative.amount)
      : addDays(base, sign * relative.amount * (relative.unit === "weeks" ? 7 : 1));
  return { due, relative };
}

/** Horas por semana de cada opção de rhythm.weeklyTime (limite de cima da faixa; "mais de 5" = 8). */
export const WEEKLY_HOURS: Record<string, number> = { lt1h: 1, "1to3h": 3, "3to5h": 5, gt5h: 8 };
