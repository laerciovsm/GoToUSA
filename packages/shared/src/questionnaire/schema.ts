import { z } from "zod";
import { MED_UNITS } from "./data.ts";
import type { Medication, QuestionnaireData } from "./types.ts";

const money = z.object({ amount: z.number(), currency: z.string().length(3) });

const special = z.enum(["yes", "no", "unsure", ""]);

/** Remédio no formato atual (versão 2): dose, unidade e frequência padronizadas. */
const medication = z.object({
  name: z.string().max(200),
  amount: z.number().nonnegative().nullable(),
  unit: z.string().max(30),
  frequency: z.string().max(30),
  special,
});

/** Remédio na versão 1 (dose e frequência digitadas). Só para migrar dados antigos. */
const medicationV1 = z.object({
  name: z.string().max(200),
  dose: z.string().max(200),
  frequency: z.string().max(200),
  special,
});

const answerValueOf = <M extends z.ZodType>(med: M) =>
  z.union([z.string().max(5000), z.array(z.string().max(200)).max(300), z.number(), money, z.array(med).max(50)]);

const answersOf = <M extends z.ZodType>(med: M) => z.record(z.string().max(100), answerValueOf(med));

const person = z.object({
  id: z.uuid(),
  kind: z.enum(["self", "partner", "child", "dependent"]),
});

const base = {
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  people: z.array(person).min(1).max(50),
  completedBlocks: z.array(z.string().max(50)).max(50),
};

/** Formato salvo do questionário. Toda leitura do navegador (ou de um arquivo importado) passa por aqui. */
export const questionnaireSchema = z.object({
  ...base,
  schemaVersion: z.literal(2),
  answers: answersOf(medication),
  personAnswers: z.record(z.uuid(), answersOf(medication)),
});

const questionnaireSchemaV1 = z.object({
  ...base,
  schemaVersion: z.literal(1),
  answers: answersOf(medicationV1),
  personAnswers: z.record(z.uuid(), answersOf(medicationV1)),
});

/** Converte um remédio da versão 1: aproveita o número e a unidade da dose digitada, se der para reconhecer. */
function migrateMedication(old: z.infer<typeof medicationV1>): Medication {
  const match = /(\d+(?:[.,]\d+)?)\s*([a-zA-Zµ]+)?/.exec(old.dose);
  const amount = match ? Number(match[1]!.replace(",", ".")) : null;
  const rawUnit = (match?.[2] ?? "").toLowerCase().replace("µg", "mcg");
  return {
    name: old.name,
    amount: amount !== null && Number.isFinite(amount) ? amount : null,
    unit: MED_UNITS.includes(rawUnit) ? rawUnit : "",
    frequency: "",
    special: old.special,
  };
}

function migrateAnswers(answers: z.infer<ReturnType<typeof answersOf<typeof medicationV1>>>) {
  return Object.fromEntries(
    Object.entries(answers).map(([id, value]) => [
      id,
      id === "health.medications" && Array.isArray(value)
        ? (value as z.infer<typeof medicationV1>[]).map(migrateMedication)
        : value,
    ]),
  );
}

/**
 * Valida dados desconhecidos e migra versões antigas para a atual.
 * Retorna undefined se não forem um questionário válido.
 */
export function parseQuestionnaire(value: unknown): QuestionnaireData | undefined {
  const current = questionnaireSchema.safeParse(value);
  if (current.success) return current.data as QuestionnaireData;

  const v1 = questionnaireSchemaV1.safeParse(value);
  if (!v1.success) return undefined;
  const migrated = {
    ...v1.data,
    schemaVersion: 2 as const,
    answers: migrateAnswers(v1.data.answers),
    personAnswers: Object.fromEntries(
      Object.entries(v1.data.personAnswers).map(([id, answers]) => [id, migrateAnswers(answers)]),
    ),
  };
  const checked = questionnaireSchema.safeParse(migrated);
  return checked.success ? (checked.data as QuestionnaireData) : undefined;
}
