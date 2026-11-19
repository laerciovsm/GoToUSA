/**
 * Motor da jornada: transforma as respostas do questionário + o catálogo + o progresso
 * na jornada da família (Marco 3, passos 3 e 4, aprovados em 17/11/2026).
 * Função pura: as mesmas entradas geram sempre a mesma jornada.
 */
import { BLOCKS } from "../questionnaire/definition.ts";
import { ageAtDeparture, departureDate } from "../questionnaire/engine.ts";
import type { Person, QuestionnaireData } from "../questionnaire/types.ts";
import { evaluate, type ConditionContext, type Tri } from "./conditions.ts";
import { computeDue, daysBetween, parseIsoDate, WEEKLY_HOURS, type DateRefs } from "./dates.ts";
import { toIsoDate } from "./schema.ts";
import { defaultExecutor, resolveExecutor } from "./executor.ts";
import {
  PHASE_IDS,
  type Catalog,
  type Journey,
  type JourneyProgress,
  type JourneyTask,
  type PhaseId,
  type RealityCheck,
  type TaskDef,
  type VisiblePath,
  type Weight,
} from "./types.ts";

const PHASE_ORDER = new Map(PHASE_IDS.map((id, i) => [id, i]));
const WEIGHT_ORDER: Record<Weight, number> = { high: 0, medium: 1, low: 2 };

/** Pergunta → bloco do questionário (para o aviso "responda o bloco X"). */
const QUESTION_BLOCK = new Map<string, string>(
  BLOCKS.flatMap((b) =>
    b.items.flatMap((item) => ("group" in item ? item.questions : [item]).map((q) => [q.id, b.id] as [string, string])),
  ),
);

/** Inclusão: essencial entra se não for "não"; conforme o caso, só se for "sim". */
const include = (result: Tri, essential: boolean) => (essential ? result !== false : result === true);

/** Adultos que vão: você, o cônjuge e filhos ou dependentes com 18 anos ou mais na data de ida. */
export function adultsGoing(data: QuestionnaireData, now: Date): Person[] {
  return data.people.filter((p) => {
    if (p.kind === "self" || p.kind === "partner") return true;
    return (ageAtDeparture(data, p, now) ?? 0) >= 18;
  });
}

function visiblePaths(catalog: Catalog, data: QuestionnaireData, now: Date, unanswered: Set<string>): VisiblePath[] {
  const result: VisiblePath[] = [];
  for (const path of catalog.paths) {
    if (path.status !== "published") continue;
    const base: ConditionContext = { data, now, lists: catalog.lists, unanswered };
    if (path.byWorker) {
      const reasons: VisiblePath["reasons"] = [];
      for (const person of adultsGoing(data, now)) {
        const ctx = { ...base, person };
        if (evaluate(path.showWhen, ctx) !== true) continue;
        reasons.push({ personId: person.id, reasonIds: path.reasons.filter((r) => evaluate(r.when, ctx) === true).map((r) => r.id) });
      }
      if (reasons.length > 0) {
        result.push({ pathId: path.id, kind: path.kind, group: path.group, personIds: reasons.map((r) => r.personId!), reasons });
      }
    } else if (evaluate(path.showWhen, base) === true) {
      const reasonIds = path.reasons.filter((r) => evaluate(r.when, base) === true).map((r) => r.id);
      result.push({ pathId: path.id, kind: path.kind, group: path.group, personIds: null, reasons: [{ personId: null, reasonIds }] });
    }
  }
  return result;
}

function realityCheck(
  tasks: JourneyTask[],
  data: QuestionnaireData,
  departure: Date | undefined,
  today: Date,
): RealityCheck {
  if (!departure) return { kind: "no_departure" };
  const weeksLeft = daysBetween(today, departure) / 7;
  if (weeksLeft <= 0) return { kind: "departure_passed" };
  const available = WEEKLY_HOURS[String(data.answers["rhythm.weeklyTime"] ?? "")];
  if (!available) return { kind: "no_weekly_time" };
  // Só o que precisa estar feito até a ida (Fases 0 a 3) e ainda não foi concluído.
  const beforeDeparture = new Set<PhaseId>(["discovery", "planning", "preparation", "move"]);
  const hours = tasks
    .filter((t) => beforeDeparture.has(t.phase) && t.status !== "done" && t.status !== "na")
    .reduce((sum, t) => sum + t.hours, 0);
  const needed = Math.ceil((hours / weeksLeft) * 2) / 2; // arredonda para cima, de meia em meia hora
  return {
    kind: needed <= available ? "ok" : "tight",
    neededHoursPerWeek: needed,
    availableHoursPerWeek: available,
    weeksLeft: Math.floor(weeksLeft),
  };
}

function pickNextStep(tasks: JourneyTask[], data: QuestionnaireData): string | null {
  const open = tasks.filter((t) => t.state === "open" && (t.status === "todo" || t.status === "doing"));
  if (open.length === 0) return null;
  const firstPhase = Math.min(...open.map((t) => PHASE_ORDER.get(t.phase)!));
  const inPhase = open.filter((t) => PHASE_ORDER.get(t.phase) === firstPhase);
  const urgent = inPhase.filter((t) => t.priority || t.highlighted);
  const pool = urgent.length > 0 ? urgent : inPhase;
  // Numa fase difícil da vida, o próximo passo sugerido é leve (pequenas vitórias).
  if (data.answers["moment.life"] === "hard") {
    const light = pool.find((t) => t.weight === "low") ?? inPhase.find((t) => t.weight === "low");
    if (light) return light.key;
  }
  return pool[0]!.key;
}

export function generateJourney(
  catalog: Catalog,
  data: QuestionnaireData,
  progress: JourneyProgress,
  now: Date = new Date(),
): Journey {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const departure = departureDate(data);
  const refs: DateRefs = {
    start: parseIsoDate(progress.startedAt),
    departure,
    arrival: progress.arrivalDate ? parseIsoDate(progress.arrivalDate) : departure,
    discoveryDue: progress.discoveryDue ? parseIsoDate(progress.discoveryDue) : undefined,
  };
  const unanswered = new Set<string>();
  const familyCtx: ConditionContext = { data, now, lists: catalog.lists };

  // 1. Caminhos de visto (as tarefas podem depender deles).
  const paths = visiblePaths(catalog, data, now, unanswered);
  const pathIds = new Set(paths.map((p) => p.pathId));

  // 2. Fases e etapas que se aplicam.
  const phases = [...catalog.structure.phases]
    .sort((a, b) => a.order - b.order)
    .filter((ph) => evaluate(ph.appliesWhen, familyCtx) !== false);
  const phaseIds = new Set(phases.map((p) => p.id));
  // Etapas na ordem das fases e, dentro de cada fase, na ordem da etapa.
  const phaseRank = new Map(phases.map((ph, i) => [ph.id, i]));
  const stages = [...catalog.structure.stages]
    .sort((a, b) => (phaseRank.get(a.phase) ?? 99) - (phaseRank.get(b.phase) ?? 99) || a.order - b.order)
    .filter((st) => phaseIds.has(st.phase) && evaluate(st.appliesWhen, familyCtx) !== false);
  const stageOrder = new Map(stages.map((s, i) => [s.id, i]));
  const taskOrder = new Map(catalog.tasks.map((t, i) => [t.id, i]));
  const personOrder = new Map(data.people.map((p, i) => [p.id, i]));

  // 3. Tarefas que se aplicam (por família ou por pessoa).
  const defs = new Map<string, TaskDef>();
  const tasks: JourneyTask[] = [];
  for (const def of catalog.tasks) {
    if (def.status !== "published" || !stageOrder.has(def.stage)) continue;
    defs.set(def.id, def);
    const essentialUnanswered = def.essential ? undefined : unanswered;
    const ctxBase: ConditionContext = { data, now, lists: catalog.lists, visiblePaths: pathIds, unanswered: essentialUnanswered };
    const people: (Person | undefined)[] =
      def.who.scope === "family"
        ? [undefined]
        : data.people.filter((person) => {
            const where = def.who.scope === "each" ? def.who.where : undefined;
            return include(evaluate(where, { ...ctxBase, person }), def.essential);
          });
    for (const person of people) {
      const ctx = { ...ctxBase, person };
      if (!include(evaluate(def.appliesWhen, ctx), def.essential)) continue;
      const key = person ? `${def.id}@${person.id}` : def.id;
      const saved = progress.tasks[key];
      const { due, relative } = computeDue(def.deadline, def.phase, refs);
      const status = saved?.status ?? "todo";
      const executorDefault = defaultExecutor(def.executor, data, person, now);
      tasks.push({
        key,
        taskId: def.id,
        personId: person?.id ?? null,
        phase: def.phase,
        stage: def.stage,
        themes: def.themes,
        type: def.type,
        weight: def.weight,
        essential: def.essential,
        // Sem regra de destaque, a tarefa não é destacada (uma condição vazia valeria "sim").
        highlighted: def.highlightWhen !== null && evaluate(def.highlightWhen, { ...ctx, unanswered: undefined }) === true,
        due: due ? toIsoDate(due) : null,
        dueRelative: relative,
        state: "open",
        waitingFor: [],
        status,
        priority: !!due && due < today && status !== "done" && status !== "na",
        hours: (def.time.minHours + def.time.maxHours) / 2,
        executor: resolveExecutor(progress, key, executorDefault, data, now),
        executorDefault,
      });
    }
  }

  // 4. Dependências: o que não se aplica (ou foi marcado "não se aplica") não trava nada.
  const byKey = new Map(tasks.map((t) => [t.key, t]));
  for (const task of tasks) {
    const def = defs.get(task.taskId)!;
    for (const depId of def.dependsOn) {
      const depDef = defs.get(depId);
      if (!depDef) continue; // não se aplica a esta família
      const depKeys =
        depDef.who.scope === "each" && task.personId
          ? [`${depId}@${task.personId}`]
          : depDef.who.scope === "each"
            ? tasks.filter((t) => t.taskId === depId).map((t) => t.key)
            : [depId];
      for (const depKey of depKeys) {
        const dep = byKey.get(depKey);
        if (dep && dep.status !== "done" && dep.status !== "na") task.waitingFor.push(depKey);
      }
    }
    if (task.waitingFor.length > 0) task.state = "waiting";
  }

  // 5. Ordem: fase → etapa → prazo → destaque → peso (e a ordem do catálogo e das pessoas, para estabilidade).
  tasks.sort(
    (a, b) =>
      PHASE_ORDER.get(a.phase)! - PHASE_ORDER.get(b.phase)! ||
      stageOrder.get(a.stage)! - stageOrder.get(b.stage)! ||
      (a.due ?? "9999").localeCompare(b.due ?? "9999") ||
      Number(b.highlighted) - Number(a.highlighted) ||
      WEIGHT_ORDER[a.weight] - WEIGHT_ORDER[b.weight] ||
      taskOrder.get(a.taskId)! - taskOrder.get(b.taskId)! ||
      (personOrder.get(a.personId ?? "") ?? -1) - (personOrder.get(b.personId ?? "") ?? -1),
  );

  // 6. Blocos que, respondidos, podem acrescentar tarefas ou caminhos.
  const missingBlocks = [...new Set([...unanswered].map((q) => QUESTION_BLOCK.get(q)).filter((b): b is string => !!b))]
    .filter((b) => !data.completedBlocks.includes(b))
    .sort();

  return {
    phases: phases.map((ph) => ({ id: ph.id, stages: stages.filter((s) => s.phase === ph.id).map((s) => s.id) })),
    tasks,
    paths,
    missingBlocks,
    departure: departure ? toIsoDate(departure) : null,
    arrival: refs.arrival ? toIsoDate(refs.arrival) : null,
    start: progress.startedAt,
    reality: realityCheck(tasks, data, departure, today),
    nextStep: pickNextStep(tasks, data),
  };
}

