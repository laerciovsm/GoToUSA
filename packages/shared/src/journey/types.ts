/**
 * Tipos do motor da jornada (Marco 3), conforme docs/jornada.md e docs/caminhos-visto.md.
 * Três camadas: conteúdo (catálogo, em content/journey), jornada gerada (calculada na hora)
 * e progresso (o que a pessoa fez, salvo no navegador).
 * IDs de fases, etapas, tarefas, subtarefas e caminhos são ESTÁVEIS: nunca mude um ID existente.
 */
import type { PersonKind } from "../questionnaire/types";

export const PHASE_IDS = ["discovery", "planning", "preparation", "move", "arrival", "settling", "future"] as const;
export type PhaseId = (typeof PHASE_IDS)[number];

export const THEME_IDS = [
  "immigration",
  "language",
  "finance",
  "career",
  "education",
  "family",
  "health",
  "housing",
  "documents",
  "culture",
  "practical",
  "assets",
] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export type TaskType = "action" | "learn" | "reflect" | "decide" | "alert";

export const WEIGHTS = ["low", "medium", "high"] as const;
export type Weight = (typeof WEIGHTS)[number];
/** Pontos de cada peso na prontidão. Na tela aparecem só as palavras (baixo, médio, alto). */
export const WEIGHT_POINTS: Record<Weight, number> = { low: 1, medium: 3, high: 5 };

/** Comparação de números (idades, quantidades). */
export type NumberCompare = { gte?: number; lte?: number; gt?: number; lt?: number };

/** Condição escrita como dados (decisão de 17/11/2026: nunca código no conteúdo). */
export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  /** Resposta da família. */
  | ({ q: string; is?: string; in?: string[]; has?: string } & NumberCompare)
  /** Resposta da pessoa da vez (tarefas por pessoa e caminhos por adulto). */
  | ({ p: string; is?: string; in?: string[]; has?: string } & NumberCompare)
  /**
   * Resposta de carreira do adulto da vez: "you.<w>" para você e "career.<w>" para os outros
   * (ex.: { "w": "education", "in": ["master"] }). Em listas (várias escolhas), gte/lte contam os itens marcados.
   */
  | ({ w: string; is?: string; in?: string[]; has?: string } & NumberCompare)
  /** Fato calculado em código testado (ver facts.ts). */
  | ({ fact: string; is?: string | boolean } & NumberCompare)
  | { kind: PersonKind | PersonKind[] }
  | { age: NumberCompare }
  | { ageAtDeparture: NumberCompare }
  | { sex: "male" | "female" }
  /** O caminho de visto está sendo mostrado. */
  | { path: string }
  /** Alguma nacionalidade está numa lista oficial de content/data. */
  | { nationalityIn: string };

/** Prazo da tarefa. null = fim da janela da fase. */
export type Deadline =
  | { from: "departure"; monthsBefore?: number; weeksBefore?: number; daysBefore?: number }
  | { from: "arrival"; monthsAfter?: number; weeksAfter?: number; daysAfter?: number }
  | { from: "start"; monthsAfter?: number; weeksAfter?: number; daysAfter?: number };

export type Who = { scope: "family" } | { scope: "each"; where?: Condition };

/** Seção "Registro" da tarefa (decisão de 17/11/2026). Nunca recebe arquivos nem números de documentos. */
export type RecordSpec = { type: "agreement" } | { type: "documents"; documents: string[] } | { type: "notes" };

export type Source = {
  id: string;
  url: string;
  /** Órgão responsável. */
  agency: string;
  title: string;
  /** Data da verificação (AAAA-MM-DD). */
  verifiedAt: string;
};

export type Cost = {
  amount: number;
  currency: string;
  /** ID da fonte oficial, ou null quando é estimativa (fonte não oficial). */
  source: string | null;
};

export type ContentStatus = "draft" | "published";

export type TaskDef = {
  id: string;
  status: ContentStatus;
  phase: PhaseId;
  stage: string;
  themes: ThemeId[];
  type: TaskType;
  /** Essencial: entra para todos, inclusive sem resposta; só sai se uma resposta mostrar que não se aplica. */
  essential: boolean;
  who: Who;
  appliesWhen: Condition | null;
  highlightWhen: Condition | null;
  deadline: Deadline | null;
  dependsOn: string[];
  weight: Weight;
  time: { minHours: number; maxHours: number };
  cost: Cost | null;
  subtasks: string[];
  record: RecordSpec | null;
  sources: Source[];
};

export type PhaseDef = { id: PhaseId; order: number; appliesWhen: Condition | null };
export type StageDef = { id: string; phase: PhaseId; order: number; appliesWhen: Condition | null };
export type Structure = { phases: PhaseDef[]; stages: StageDef[] };

export type PathKind = "permanent" | "temporary";
export type PathGroup = "work" | "merit" | "transfer" | "investment" | "family" | "study" | "other";

export type PathDef = {
  id: string;
  status: ContentStatus;
  kind: PathKind;
  group: PathGroup;
  /** Avaliado para cada adulto que vai (você, cônjuge, filhos e dependentes maiores de idade). */
  byWorker: boolean;
  showWhen: Condition;
  /** "Por que apareceu": só aparecem os motivos cuja condição vale. */
  reasons: { id: string; when: Condition }[];
  /** Tarefas de "o que você pode fazer agora". */
  tasks: string[];
  sources: Source[];
};

/** Lista oficial (ex.: países de um tratado), sempre com fonte. */
export type OfficialList = { id: string; codes: string[]; source: Source };

/** Catálogo completo (camada 1), sem os textos. */
export type Catalog = {
  structure: Structure;
  tasks: TaskDef[];
  paths: PathDef[];
  lists: OfficialList[];
};

/** Textos de uma tarefa num idioma (do arquivo <idioma>.md). */
export type TaskText = {
  title: string;
  why: string;
  subtasks: Record<string, string>;
  documents: Record<string, string>;
  /** Passo a passo, em Markdown simples. Fatos citam a fonte com [[fonte:id]]. */
  body: string;
};

export type PathText = { title: string; summary: string; reasons: Record<string, string>; body: string };

export type CatalogTexts = {
  phases: Record<string, { title: string; summary: string }>;
  stages: Record<string, { title: string; summary: string }>;
  tasks: Record<string, TaskText>;
  paths: Record<string, PathText>;
};

// ---------------------------------------------------------------------------
// Progresso (camada 3)
// ---------------------------------------------------------------------------

export type TaskStatus = "todo" | "doing" | "done" | "na";

export type AgreementRecord = {
  type: "agreement";
  /** AAAA-MM-DD */
  date: string;
  /** IDs das pessoas da família que participaram. */
  people: string[];
  decided: string;
  nextSteps: string;
  agreed: "yes" | "partly" | "not_yet" | "";
};

export type DocumentState = "have" | "requested" | "missing" | "";
export type DocumentsRecord = {
  type: "documents";
  /** Chave: "idDoDocumento@idDaPessoa" (ou só o ID do documento em tarefas da família). */
  items: Record<string, { state: DocumentState; validUntil: string; note: string }>;
};

export type NotesRecord = { type: "notes"; text: string };

export type TaskRecord = AgreementRecord | DocumentsRecord | NotesRecord;

export type TaskProgress = {
  status: TaskStatus;
  /** IDs das subtarefas marcadas. */
  subtasks: string[];
  /** Data de conclusão (ISO). */
  doneAt: string | null;
  /** Plano "quando e onde" (premissa 3). */
  plan: string;
  /** Anotação livre, só da pessoa. */
  note: string;
  record: TaskRecord | null;
};

/** Tarefa criada pela própria pessoa. */
export type OwnTask = {
  id: string;
  title: string;
  phase: PhaseId | null;
  stage: string | null;
  theme: ThemeId | null;
  people: string[];
  weight: Weight;
  /** AAAA-MM, opcional. */
  due: string | null;
  status: TaskStatus;
  createdAt: string;
};

export type JourneyProgress = {
  schemaVersion: 1;
  /** Início da jornada (AAAA-MM-DD): base da Fase 0. */
  startedAt: string;
  /** Prazo da Fase 0 escolhido pela pessoa (AAAA-MM-DD), ou null para o padrão de 1 mês. */
  discoveryDue: string | null;
  /** Data real de chegada (AAAA-MM-DD), quando a pessoa informar. */
  arrivalDate: string | null;
  /** Progresso por chave estável ("idDaTarefa" ou "idDaTarefa@idDaPessoa"). Nada é apagado no recálculo. */
  tasks: Record<string, TaskProgress>;
  ownTasks: OwnTask[];
};

// ---------------------------------------------------------------------------
// Jornada gerada (camada 2)
// ---------------------------------------------------------------------------

export type DueRelative = {
  ref: "departure" | "arrival" | "start";
  amount: number;
  unit: "months" | "weeks" | "days";
  direction: "before" | "after";
};

export type JourneyTask = {
  key: string;
  taskId: string;
  personId: string | null;
  phase: PhaseId;
  stage: string;
  themes: ThemeId[];
  type: TaskType;
  weight: Weight;
  essential: boolean;
  highlighted: boolean;
  /** Prazo calculado (AAAA-MM-DD), ou null sem data de referência. */
  due: string | null;
  /** Prazo em texto relativo ("12 meses antes da ida"), para quando não há data. */
  dueRelative: DueRelative | null;
  /** "waiting" enquanto alguma dependência não foi concluída nem marcada "não se aplica". */
  state: "waiting" | "open";
  waitingFor: string[];
  status: TaskStatus;
  /** Prazo já passou e a tarefa não foi concluída: aparece como "prioridade", nunca "atrasada". */
  priority: boolean;
  /** Média do tempo estimado, em horas. */
  hours: number;
};

export type VisiblePath = {
  pathId: string;
  kind: PathKind;
  group: PathGroup;
  /** Por quem o caminho aparece (caminhos por adulto), ou null (caminho da família). */
  personIds: string[] | null;
  /** Motivos que apareceram, por pessoa (personId null nos caminhos da família). */
  reasons: { personId: string | null; reasonIds: string[] }[];
};

export type RealityCheck =
  | { kind: "no_departure" }
  | { kind: "departure_passed" }
  | { kind: "no_weekly_time" }
  | { kind: "ok" | "tight"; neededHoursPerWeek: number; availableHoursPerWeek: number; weeksLeft: number };

export type Journey = {
  phases: { id: PhaseId; stages: string[] }[];
  tasks: JourneyTask[];
  paths: VisiblePath[];
  /** Blocos do questionário que, respondidos, podem acrescentar tarefas ou caminhos. */
  missingBlocks: string[];
  /** Meta (AAAA-MM-DD do dia 1º do mês de ida), ou null em "ainda não sei". */
  departure: string | null;
  arrival: string | null;
  start: string;
  reality: RealityCheck;
  /** Chave da tarefa sugerida na tela "Hoje". */
  nextStep: string | null;
};
