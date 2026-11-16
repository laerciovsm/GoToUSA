/**
 * Tipos do questionário. Os IDs de blocos, perguntas e opções são ESTÁVEIS:
 * nunca mude um ID existente, porque ele identifica respostas já salvas.
 * Os textos ficam nos arquivos de tradução (apps/web/messages/<idioma>/questionnaire.json),
 * na chave igual ao ID da pergunta (ex.: "you.english" → Q.you.english.label).
 */

/** Pessoas da família que vão na mudança. */
export type PersonKind = "self" | "partner" | "child" | "dependent";

export type Person = {
  /** UUID, gerado uma vez e nunca alterado. */
  id: string;
  kind: PersonKind;
};

/** Mês e ano no formato "AAAA-MM", ou "unsure" quando a pessoa ainda não sabe. */
export type MonthYear = string;

export type Money = { amount: number; currency: string };

export type Medication = {
  name: string;
  dose: string;
  frequency: string;
  /** Precisa de receita especial no país de origem? */
  special: "yes" | "no" | "unsure" | "";
};

export type AnswerValue = string | string[] | number | Money | Medication[];

/** Respostas indexadas pelo ID da pergunta. */
export type Answers = Record<string, AnswerValue>;

export type QuestionType =
  /** Escolhe uma opção. */
  | "single"
  /** Escolhe várias opções. */
  | "multi"
  | "text"
  | "number"
  | "monthYear"
  /** Um país (código ISO 3166-1). */
  | "country"
  /** Vários países. */
  | "countries"
  /** Vários idiomas (códigos BCP 47). */
  | "languages"
  /** Vários estados dos EUA (códigos postais, ex.: "WA"). */
  | "usStates"
  | "money"
  | "medications"
  /** Escolhe pessoas da família (uma ou várias). */
  | "people";

/** Contexto usado nas condições e nos textos. */
export type QuestionContext = {
  record: QuestionnaireData;
  /** Pessoa da vez, em perguntas repetidas por pessoa. */
  person?: Person;
  /** Data de referência (hoje), para calcular idades. */
  now: Date;
};

export type Question = {
  id: string;
  type: QuestionType;
  /** Opções (IDs estáveis), para "single" e "multi". */
  options?: readonly string[];
  /** Usa os textos das opções de outra pergunta (ex.: inglês do cônjuge usa os de you.english). */
  optionsFrom?: string;
  /** Opções que desmarcam as outras (ex.: "Nenhuma"). */
  exclusive?: readonly string[];
  /** Máximo de opções em "multi". */
  max?: number;
  /** Limites de "number". */
  min?: number;
  maxValue?: number;
  /** "monthYear": aceita "Ainda não sei". */
  allowUnsure?: boolean;
  /** "monthYear": datas no passado (nascimento) ou no futuro (data de ida). */
  range?: "past" | "future";
  /** "text": resposta longa (várias linhas). */
  long?: boolean;
  /** "money": moeda fixa (ex.: "USD"). Sem isso, a pessoa escolhe a moeda. */
  currency?: string;
  /** "people": permite escolher várias pessoas. */
  multiple?: boolean;
  /** "people": opções extras além das pessoas (ex.: "external" para cuidador contratado). */
  extraOptions?: readonly string[];
  /** "people": não lista a própria pessoa da vez. */
  excludeSelf?: boolean;
  /** "country": sugere como resposta inicial o primeiro valor desta outra pergunta. */
  prefillFrom?: string;
  /** A pessoa pode pular a pergunta. */
  optional?: boolean;
  /** Condição para a pergunta aparecer. */
  when?: (ctx: QuestionContext) => boolean;
};

/** Grupo de perguntas repetido para cada pessoa de um conjunto. */
export type PersonGroup = {
  group: "children" | "dependents" | "members";
  questions: readonly Question[];
};

export type BlockItem = Question | PersonGroup;

export type BlockStage = "essential" | "complete";

export type Block = {
  /** ID estável do bloco. */
  id: string;
  /** Número exibido (0 a 10). */
  number: number;
  stage: BlockStage;
  /** Tempo estimado em minutos. */
  minutes: number;
  items: readonly BlockItem[];
};

/** Dados do questionário salvos no navegador (e, no futuro, na conta). */
export type QuestionnaireData = {
  /** Versão do formato, para migrar dados antigos sem perda. */
  schemaVersion: 1;
  /** UUID do questionário. */
  id: string;
  createdAt: string;
  updatedAt: string;
  /** Respostas que valem para a família toda. */
  answers: Answers;
  /** Pessoas que vão na mudança. "self" sempre existe e é a primeira. */
  people: Person[];
  /** Respostas por pessoa: personAnswers[idDaPessoa][idDaPergunta]. */
  personAnswers: Record<string, Answers>;
  /** Blocos que a pessoa terminou pelo menos uma vez. */
  completedBlocks: string[];
};

/** Um passo do questionário: uma pergunta (e a pessoa, se for repetida por pessoa). */
export type Step = {
  key: string;
  blockId: string;
  question: Question;
  person?: Person;
};
