/** Validação (Zod) do conteúdo da jornada e do progresso salvo. */
import { z } from "zod";
import { PHASE_IDS, THEME_IDS, WEIGHTS } from "./types";
import type { Condition, JourneyProgress, PathDef, Structure, TaskDef } from "./types";

const id = z.string().regex(/^[a-z0-9][a-z0-9.-]*$/, "ID: só letras minúsculas, números, ponto e hífen");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const monthYear = z.string().regex(/^\d{4}-\d{2}$/);
const phase = z.enum(PHASE_IDS);
const numberCompare = {
  gte: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  lt: z.number().optional(),
};
const answerCompare = { is: z.string().optional(), in: z.array(z.string()).optional(), has: z.string().optional(), ...numberCompare };
const personKind = z.enum(["self", "partner", "child", "dependent"]);

export const conditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.union([
    z.strictObject({ all: z.array(conditionSchema).min(1) }),
    z.strictObject({ any: z.array(conditionSchema).min(1) }),
    z.strictObject({ not: conditionSchema }),
    z.strictObject({ q: z.string(), ...answerCompare }),
    z.strictObject({ p: z.string(), ...answerCompare }),
    z.strictObject({ w: z.string(), ...answerCompare }),
    z.strictObject({ fact: z.string(), is: z.union([z.string(), z.boolean()]).optional(), ...numberCompare }),
    z.strictObject({ kind: z.union([personKind, z.array(personKind).min(1)]) }),
    z.strictObject({ age: z.strictObject(numberCompare) }),
    z.strictObject({ ageAtDeparture: z.strictObject(numberCompare) }),
    z.strictObject({ sex: z.enum(["male", "female"]) }),
    z.strictObject({ path: id }),
    z.strictObject({ nationalityIn: id }),
  ]),
) as z.ZodType<Condition>;

const offset = z.number().int().nonnegative().optional();
const deadlineSchema = z.union([
  z.strictObject({ from: z.literal("departure"), monthsBefore: offset, weeksBefore: offset, daysBefore: offset }),
  z.strictObject({ from: z.literal("arrival"), monthsAfter: offset, weeksAfter: offset, daysAfter: offset }),
  z.strictObject({ from: z.literal("start"), monthsAfter: offset, weeksAfter: offset, daysAfter: offset }),
]);

export const sourceSchema = z.strictObject({
  id,
  url: z.url({ protocol: /^https$/ }),
  agency: z.string().min(2),
  title: z.string().min(2),
  verifiedAt: isoDate,
});

export const taskDefSchema: z.ZodType<TaskDef> = z.strictObject({
  id,
  status: z.enum(["draft", "published"]),
  phase,
  stage: id,
  themes: z.array(z.enum(THEME_IDS)).min(1),
  type: z.enum(["action", "learn", "reflect", "decide", "alert"]),
  essential: z.boolean(),
  who: z.union([
    z.strictObject({ scope: z.literal("family") }),
    z.strictObject({ scope: z.literal("each"), where: conditionSchema.optional() }),
  ]),
  appliesWhen: conditionSchema.nullable(),
  highlightWhen: conditionSchema.nullable(),
  deadline: deadlineSchema.nullable(),
  dependsOn: z.array(id),
  weight: z.enum(WEIGHTS),
  time: z.strictObject({ minHours: z.number().positive(), maxHours: z.number().positive() }),
  cost: z.strictObject({ amount: z.number().nonnegative(), currency: z.string().length(3), source: id.nullable() }).nullable(),
  subtasks: z.array(id),
  record: z
    .union([
      z.strictObject({ type: z.literal("agreement") }),
      z.strictObject({ type: z.literal("documents"), documents: z.array(id).min(1) }),
      z.strictObject({ type: z.literal("notes") }),
    ])
    .nullable(),
  sources: z.array(sourceSchema),
}) as z.ZodType<TaskDef>;

export const structureSchema: z.ZodType<Structure> = z.strictObject({
  phases: z.array(z.strictObject({ id: phase, order: z.number().int(), appliesWhen: conditionSchema.nullable() })),
  stages: z.array(z.strictObject({ id, phase, order: z.number().int(), appliesWhen: conditionSchema.nullable() })),
}) as z.ZodType<Structure>;

export const pathDefSchema: z.ZodType<PathDef> = z.strictObject({
  id,
  status: z.enum(["draft", "published"]),
  kind: z.enum(["permanent", "temporary"]),
  group: z.enum(["work", "merit", "transfer", "investment", "family", "study", "other"]),
  byWorker: z.boolean(),
  showWhen: conditionSchema,
  reasons: z.array(z.strictObject({ id, when: conditionSchema })),
  tasks: z.array(id),
  sources: z.array(sourceSchema),
}) as z.ZodType<PathDef>;

export const officialListSchema = z.strictObject({
  id,
  codes: z.array(z.string().regex(/^[A-Z]{2}$/)).min(1),
  source: sourceSchema,
});

// ---------------------------------------------------------------------------
// Progresso
// ---------------------------------------------------------------------------

const text = (max: number) => z.string().max(max);
const taskStatus = z.enum(["todo", "doing", "done", "na"]);
const recordSchema = z.union([
  z.strictObject({
    type: z.literal("agreement"),
    date: z.union([isoDate, z.literal("")]),
    people: z.array(z.uuid()).max(50),
    decided: text(5000),
    nextSteps: text(5000),
    agreed: z.enum(["yes", "partly", "not_yet", ""]),
  }),
  z.strictObject({
    type: z.literal("documents"),
    items: z.record(
      z.string().max(200),
      z.strictObject({
        state: z.enum(["have", "requested", "missing", ""]),
        validUntil: z.union([monthYear, z.literal("")]),
        note: text(500),
      }),
    ),
  }),
  z.strictObject({ type: z.literal("notes"), text: text(10000) }),
]);

export const progressSchema = z.strictObject({
  schemaVersion: z.literal(1),
  startedAt: isoDate,
  discoveryDue: isoDate.nullable(),
  arrivalDate: isoDate.nullable(),
  tasks: z.record(
    z.string().max(200),
    z.strictObject({
      status: taskStatus,
      subtasks: z.array(z.string().max(100)).max(100),
      doneAt: z.iso.datetime().nullable(),
      plan: text(500),
      note: text(5000),
      record: recordSchema.nullable(),
    }),
  ),
  ownTasks: z
    .array(
      z.strictObject({
        id: z.uuid(),
        title: z.string().min(1).max(200),
        phase: phase.nullable(),
        stage: z.string().max(100).nullable(),
        theme: z.enum(THEME_IDS).nullable(),
        people: z.array(z.uuid()).max(50),
        weight: z.enum(WEIGHTS),
        due: monthYear.nullable(),
        status: taskStatus,
        createdAt: z.iso.datetime(),
      }),
    )
    .max(500),
});

/** Valida o progresso salvo. Retorna undefined se não for válido. */
export function parseProgress(value: unknown): JourneyProgress | undefined {
  const result = progressSchema.safeParse(value);
  return result.success ? (result.data as JourneyProgress) : undefined;
}

/** Progresso novo: a jornada começa hoje. */
export function createProgress(now: Date = new Date()): JourneyProgress {
  return { schemaVersion: 1, startedAt: toIsoDate(now), discoveryDue: null, arrivalDate: null, tasks: {}, ownTasks: [] };
}

/** Data local em AAAA-MM-DD (sem horário, para não mudar de dia por causa do fuso). */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
