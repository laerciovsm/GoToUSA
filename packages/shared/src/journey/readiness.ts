/**
 * Prontidão para a mudança (docs/jornada.md, "Prontidão (cálculo)").
 * Pontos das concluídas ÷ pontos das que se aplicam. "Não se aplica" sai da conta.
 * Em andamento com subtarefas conta pela fração marcada. Tarefas próprias contam no total
 * e na etapa e no tema escolhidos (decisão de 17/11/2026).
 * Nunca é apresentada como chance de visto.
 */
import { WEIGHT_POINTS, type Catalog, type Journey, type JourneyProgress } from "./types";

export type Score = { done: number; total: number; ratio: number };
export type Readiness = {
  total: Score;
  byTheme: Record<string, Score>;
  byStage: Record<string, Score>;
  byPhase: Record<string, Score>;
};

const add = (map: Record<string, Score>, key: string, done: number, total: number) => {
  const s = (map[key] ??= { done: 0, total: 0, ratio: 0 });
  s.done += done;
  s.total += total;
};

const finish = (s: Score) => {
  s.ratio = s.total > 0 ? s.done / s.total : 0;
  return s;
};

export function computeReadiness(journey: Journey, catalog: Catalog, progress: JourneyProgress): Readiness {
  const total: Score = { done: 0, total: 0, ratio: 0 };
  const byTheme: Record<string, Score> = {};
  const byStage: Record<string, Score> = {};
  const byPhase: Record<string, Score> = {};
  const subtaskCount = new Map(catalog.tasks.map((t) => [t.id, t.subtasks.length]));

  const count = (points: number, fraction: number, themes: string[], stage: string | null, phase: string | null) => {
    const done = points * fraction;
    total.done += done;
    total.total += points;
    themes.forEach((th) => add(byTheme, th, done, points));
    if (stage) add(byStage, stage, done, points);
    if (phase) add(byPhase, phase, done, points);
  };

  for (const task of journey.tasks) {
    if (task.status === "na") continue;
    const points = WEIGHT_POINTS[task.weight];
    let fraction = task.status === "done" ? 1 : 0;
    if (task.status === "doing") {
      const totalSubtasks = subtaskCount.get(task.taskId) ?? 0;
      const marked = progress.tasks[task.key]?.subtasks.length ?? 0;
      fraction = totalSubtasks > 0 ? Math.min(marked / totalSubtasks, 1) : 0;
    }
    count(points, fraction, task.themes, task.stage, task.phase);
  }

  for (const own of progress.ownTasks) {
    if (own.status === "na") continue;
    count(WEIGHT_POINTS[own.weight], own.status === "done" ? 1 : 0, own.theme ? [own.theme] : [], own.stage, own.phase);
  }

  finish(total);
  [byTheme, byStage, byPhase].forEach((m) => Object.values(m).forEach(finish));
  return { total, byTheme, byStage, byPhase };
}
