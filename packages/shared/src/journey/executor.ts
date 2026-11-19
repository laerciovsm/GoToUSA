/**
 * Quem executa cada tarefa (decisão de 19/11/2026, docs/acesso-compartilhado.md).
 * Sempre por papel (você, cônjuge, filho, dependente, família), nunca por nome.
 * Hoje o responsável pela jornada é "você" no questionário; com as contas, será o dono da jornada.
 */
import { getAnswer, personAge } from "../questionnaire/engine.ts";
import type { Person, QuestionnaireData } from "../questionnaire/types.ts";
import type { Executor, JourneyProgress } from "./types.ts";

export const FAMILY_EXECUTOR = "family";

/** O responsável pela jornada (hoje, a pessoa "você"). */
export function journeyOwnerId(data: QuestionnaireData): string | null {
  return data.people.find((p) => p.kind === "self")?.id ?? null;
}

/**
 * Pode executar tarefas: você e o cônjuge; filhos e dependentes com 18 anos ou mais hoje que não dependem
 * de ajuda nas atividades diárias e não têm representante legal (curatela). Sem idade conhecida, não.
 */
export function canExecute(data: QuestionnaireData, person: Person, now: Date): boolean {
  if (person.kind === "self" || person.kind === "partner") return true;
  const age = personAge(data, person, now);
  if (age === undefined || age < 18) return false;
  const autonomy = getAnswer(data, "health.autonomy", person);
  if (autonomy === "help" || autonomy === "full") return false;
  const guardian = getAnswer(data, "health.legalGuardian", person);
  return guardian !== "yes" && guardian !== "in_progress";
}

/** Executor padrão de uma tarefa, pelo papel definido no conteúdo. */
export function defaultExecutor(
  executor: Executor,
  data: QuestionnaireData,
  person: Person | undefined,
  now: Date,
): string {
  if (executor === "family") return FAMILY_EXECUTOR;
  const owner = journeyOwnerId(data) ?? FAMILY_EXECUTOR;
  if (executor === "owner" || !person) return owner;
  return canExecute(data, person, now) ? person.id : owner;
}

/** Quem pode ser escolhido como executor: os adultos capazes da família e "a família toda". */
export function executorOptions(data: QuestionnaireData, now: Date): string[] {
  return [...data.people.filter((p) => canExecute(data, p, now)).map((p) => p.id), FAMILY_EXECUTOR];
}

/** Executor da tarefa: a escolha da pessoa (se ainda for válida) ou o padrão. */
export function resolveExecutor(
  progress: JourneyProgress,
  key: string,
  fallback: string,
  data: QuestionnaireData,
  now: Date,
): string {
  const chosen = progress.executors[key];
  return chosen && executorOptions(data, now).includes(chosen) ? chosen : fallback;
}

/** Troca quem executa. Escolher o padrão de novo apaga a escolha (volta a seguir o conteúdo). */
export function setTaskExecutor(progress: JourneyProgress, key: string, executor: string, fallback: string): JourneyProgress {
  const executors = { ...progress.executors };
  if (executor === fallback) delete executors[key];
  else executors[key] = executor;
  return { ...progress, executors };
}
