import { z } from "zod";
import type { QuestionnaireData } from "./types";

const money = z.object({ amount: z.number(), currency: z.string().length(3) });

const medication = z.object({
  name: z.string().max(200),
  dose: z.string().max(200),
  frequency: z.string().max(200),
  special: z.enum(["yes", "no", "unsure", ""]),
});

const answerValue = z.union([
  z.string().max(5000),
  z.array(z.string().max(200)).max(300),
  z.number(),
  money,
  z.array(medication).max(50),
]);

const answers = z.record(z.string().max(100), answerValue);

const person = z.object({
  id: z.uuid(),
  kind: z.enum(["self", "partner", "child", "dependent"]),
});

/** Formato salvo do questionário. Toda leitura do navegador (ou de um arquivo importado) passa por aqui. */
export const questionnaireSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  answers,
  people: z.array(person).min(1).max(50),
  personAnswers: z.record(z.uuid(), answers),
  completedBlocks: z.array(z.string().max(50)).max(50),
});

/** Valida dados desconhecidos. Retorna undefined se não forem um questionário válido. */
export function parseQuestionnaire(value: unknown): QuestionnaireData | undefined {
  const result = questionnaireSchema.safeParse(value);
  return result.success ? (result.data as QuestionnaireData) : undefined;
}
