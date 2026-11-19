/**
 * Arquivo para baixar e importar a jornada (modo gratuito: os dados ficam só no navegador).
 * Leva as respostas do questionário e o progresso da jornada. Nunca leva documentos nem arquivos.
 * Ao importar, tudo passa pela validação (Zod) e pelas migrações de formato, como os dados salvos.
 */
import { z } from "zod";
import { parseProgress } from "./journey/schema.ts";
import type { JourneyProgress } from "./journey/types.ts";
import { parseQuestionnaire } from "./questionnaire/schema.ts";
import type { QuestionnaireData } from "./questionnaire/types.ts";

export const BACKUP_FORMAT = 1;
/** Tamanho máximo aceito na importação (bem acima de uma jornada real). */
export const BACKUP_MAX_BYTES = 2 * 1024 * 1024;

export type JourneyBackup = {
  app: "gotousa";
  format: typeof BACKUP_FORMAT;
  /** ISO */
  exportedAt: string;
  questionnaire: QuestionnaireData;
  progress: JourneyProgress | null;
};

const envelope = z.strictObject({
  app: z.literal("gotousa"),
  format: z.literal(BACKUP_FORMAT),
  exportedAt: z.iso.datetime(),
  questionnaire: z.unknown(),
  progress: z.unknown().nullable(),
});

export function createBackup(questionnaire: QuestionnaireData, progress: JourneyProgress | null, now: Date = new Date()): JourneyBackup {
  return { app: "gotousa", format: BACKUP_FORMAT, exportedAt: now.toISOString(), questionnaire, progress };
}

export type ParsedBackup = { exportedAt: string; questionnaire: QuestionnaireData; progress: JourneyProgress | null };
export type BackupError = "too_big" | "not_json" | "not_gotousa" | "invalid";

/** Lê o texto de um arquivo importado. Nada é executado: só JSON validado. */
export function parseBackup(text: string): { ok: true; backup: ParsedBackup } | { ok: false; error: BackupError } {
  if (new TextEncoder().encode(text).length > BACKUP_MAX_BYTES) return { ok: false, error: "too_big" };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "not_json" };
  }
  const env = envelope.safeParse(raw);
  if (!env.success) return { ok: false, error: "not_gotousa" };
  const questionnaire = parseQuestionnaire(env.data.questionnaire);
  const progress = env.data.progress === null ? null : parseProgress(env.data.progress);
  if (!questionnaire || progress === undefined) return { ok: false, error: "invalid" };
  return { ok: true, backup: { exportedAt: env.data.exportedAt, questionnaire, progress } };
}

/** Nome do arquivo: gotousa-jornada-AAAA-MM-DD.json */
export function backupFileName(now: Date = new Date()): string {
  const d = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return `gotousa-jornada-${d}.json`;
}
