/**
 * Alterações no progresso da jornada (camada 3). Funções puras: sempre devolvem um progresso novo,
 * sem mudar o anterior, para a tela salvar e recalcular a jornada.
 * Nada é apagado no recálculo: o progresso de uma tarefa que deixou de se aplicar continua guardado.
 */
import type { CheckinAnswer, JourneyProgress, PhaseId, RecordSpec, TaskProgress, TaskRecord, TaskStatus } from "./types";

export function emptyTaskProgress(): TaskProgress {
  return { status: "todo", subtasks: [], doneAt: null, plan: "", note: "", record: null };
}

/** Progresso de uma tarefa (vazio se a pessoa ainda não mexeu nela). */
export function taskProgress(progress: JourneyProgress, key: string): TaskProgress {
  return progress.tasks[key] ?? emptyTaskProgress();
}

/** Chave da tarefa → ID da tarefa e da pessoa ("care-plan@<id>" → care-plan, <id>). */
export function splitTaskKey(key: string): { taskId: string; personId: string | null } {
  const at = key.indexOf("@");
  return at < 0 ? { taskId: key, personId: null } : { taskId: key.slice(0, at), personId: key.slice(at + 1) };
}

function withTask(progress: JourneyProgress, key: string, change: (task: TaskProgress) => TaskProgress): JourneyProgress {
  return { ...progress, tasks: { ...progress.tasks, [key]: change(taskProgress(progress, key)) } };
}

/** Muda a situação. Tudo pode ser desfeito: voltar para "a fazer" ou "em andamento" limpa a data de conclusão. */
export function setTaskStatus(progress: JourneyProgress, key: string, status: TaskStatus, now: Date = new Date()): JourneyProgress {
  return withTask(progress, key, (task) => ({ ...task, status, doneAt: status === "done" ? now.toISOString() : null }));
}

/**
 * Marca ou desmarca uma subtarefa. Marcar a primeira subtarefa de uma tarefa "a fazer" já a coloca
 * "em andamento" (cada subtarefa é uma pequena vitória e move a prontidão). Concluir é sempre decisão da pessoa.
 */
export function toggleSubtask(progress: JourneyProgress, key: string, subtaskId: string): JourneyProgress {
  return withTask(progress, key, (task) => {
    const marked = task.subtasks.includes(subtaskId);
    const subtasks = marked ? task.subtasks.filter((s) => s !== subtaskId) : [...task.subtasks, subtaskId];
    const status = !marked && task.status === "todo" ? "doing" : task.status;
    return { ...task, subtasks, status };
  });
}

/** Atualiza o plano "quando e onde", a anotação pessoal ou o registro. */
export function updateTask(
  progress: JourneyProgress,
  key: string,
  fields: Partial<Pick<TaskProgress, "plan" | "note" | "record">>,
): JourneyProgress {
  return withTask(progress, key, (task) => ({ ...task, ...fields }));
}

/** Registro vazio, conforme o tipo definido na tarefa. */
export function emptyRecord(spec: RecordSpec): TaskRecord {
  if (spec.type === "agreement") return { type: "agreement", date: "", people: [], decided: "", nextSteps: "", agreed: "" };
  if (spec.type === "documents") return { type: "documents", items: {} };
  return { type: "notes", text: "" };
}

/**
 * Guarda o check-in de uma fase concluída. "Pausar" e "Encerrar" ficam registrados na jornada
 * (tudo continua salvo); "Continuar" e "Ajustar o plano" retomam a jornada se ela estava pausada.
 */
export function recordCheckin(progress: JourneyProgress, phase: PhaseId, answer: CheckinAnswer, now: Date = new Date()): JourneyProgress {
  const at = now.toISOString();
  return {
    ...progress,
    checkins: { ...progress.checkins, [phase]: { answer, at } },
    pausedAt: answer === "pause" ? at : null,
    endedAt: answer === "end" ? at : null,
  };
}

/** Retoma a jornada pausada ou encerrada. */
export function resumeJourney(progress: JourneyProgress): JourneyProgress {
  return { ...progress, pausedAt: null, endedAt: null };
}

/** Chave de um documento no registro: "passport@<idDaPessoa>". */
export function documentKey(documentId: string, personId: string): string {
  return `${documentId}@${personId}`;
}
