import type {
  AnswerValue,
  Block,
  Person,
  PersonGroup,
  Question,
  QuestionContext,
  QuestionnaireData,
  Step,
} from "./types";

/**
 * Gera um UUID v4. Usa crypto.getRandomValues, que funciona também fora de HTTPS
 * (crypto.randomUUID só existe em contexto seguro, e o teste no celular pela rede local usa HTTP).
 */
export function uuid(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function createQuestionnaire(now: Date = new Date()): QuestionnaireData {
  const iso = now.toISOString();
  return {
    schemaVersion: 2,
    id: uuid(),
    createdAt: iso,
    updatedAt: iso,
    answers: {},
    people: [{ id: uuid(), kind: "self" }],
    personAnswers: {},
    completedBlocks: [],
  };
}

/** Resposta de uma pergunta (da família ou da pessoa informada). */
export function getAnswer(data: QuestionnaireData, questionId: string, person?: Person): AnswerValue | undefined {
  if (person) return data.personAnswers[person.id]?.[questionId];
  return data.answers[questionId];
}

/** Uma resposta conta como respondida quando não está vazia. */
export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  return Number.isFinite(value.amount);
}

/** Idade completa numa data, a partir de "AAAA-MM". Retorna undefined se a data for inválida. */
export function ageAt(birth: string | undefined, date: Date): number | undefined {
  const match = /^(\d{4})-(\d{2})$/.exec(birth ?? "");
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  let age = date.getFullYear() - year;
  // Sem o dia exato, considera o aniversário no primeiro dia do mês de nascimento.
  if (date.getMonth() + 1 < month) age -= 1;
  return age;
}

/** Idade de uma pessoa da família numa data (undefined se não informada). */
export function personAge(data: QuestionnaireData, person: Person, date: Date): number | undefined {
  if (person.kind === "self") {
    const year = data.answers["you.birthYear"];
    return typeof year === "number" ? date.getFullYear() - year : undefined;
  }
  if (person.kind === "partner") {
    const year = data.answers["partner.birthYear"];
    return typeof year === "number" ? date.getFullYear() - year : undefined;
  }
  if (person.kind === "child") return ageAt(stringAnswer(data, "child.birth", person), date);
  if (person.kind === "dependent") return ageAt(stringAnswer(data, "dependent.birth", person), date);
  return undefined;
}

/**
 * Data de ida como data: o dia 1º do mês escolhido em goal.departure (decisão de 17/11/2026).
 * Retorna undefined quando a pessoa ainda não sabe.
 */
export function departureDate(data: QuestionnaireData): Date | undefined {
  const match = /^(\d{4})-(\d{2})$/.exec(String(data.answers["goal.departure"] ?? ""));
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : undefined;
}

/** Idade na data de ida (a meta); sem data de ida, a idade de hoje. */
export function ageAtDeparture(data: QuestionnaireData, person: Person, now: Date): number | undefined {
  return personAge(data, person, departureDate(data) ?? now);
}

/** Filho ou dependente que terá 18 anos ou mais na data de ida. */
export function isAdultMember(data: QuestionnaireData, person: Person, now: Date): boolean {
  if (person.kind !== "child" && person.kind !== "dependent") return false;
  return (ageAtDeparture(data, person, now) ?? 0) >= 18;
}

/** Adulto (além do casal) que pretende trabalhar nos EUA: entra no perfil profissional. */
export function adultPlansToWork(data: QuestionnaireData, person: Person): boolean {
  const plan = getAnswer(data, "adult.plan", person);
  return plan === "work" || plan === "both";
}

/** Sexo de uma pessoa da família ("male" ou "female"; undefined se não informado). */
export function personSex(data: QuestionnaireData, person: Person): string | undefined {
  if (person.kind === "self") return stringAnswer(data, "you.sex");
  if (person.kind === "partner") return stringAnswer(data, "partner.sex");
  if (person.kind === "child") return stringAnswer(data, "child.sex", person);
  return stringAnswer(data, "dependent.sex", person);
}

/** Situação de trabalho de você ou do cônjuge (undefined para as outras pessoas). */
export function workStatusOf(data: QuestionnaireData, person: Person): string | undefined {
  if (person.kind === "self") return stringAnswer(data, "you.workStatus");
  if (person.kind === "partner") return stringAnswer(data, "partner.workStatus");
  return undefined;
}

/** Quem é do lar não tem carreira em andamento: as perguntas profissionais não se aplicam. */
export function hasCareer(data: QuestionnaireData, person: Person): boolean {
  return workStatusOf(data, person) !== "homemaker";
}

/** Algum filho que vai na mudança tem 18 anos ou mais? */
export function hasAdultChild(data: QuestionnaireData, date: Date): boolean {
  return data.people.some((p) => p.kind === "child" && (personAge(data, p, date) ?? 0) >= 18);
}

function stringAnswer(data: QuestionnaireData, id: string, person?: Person): string | undefined {
  const value = getAnswer(data, id, person);
  return typeof value === "string" ? value : undefined;
}

/** Atalhos usados nas condições das perguntas. */
export const ctxAnswer = (ctx: QuestionContext, id: string) => getAnswer(ctx.record, id);
export const ctxPersonAnswer = (ctx: QuestionContext, id: string) =>
  ctx.person ? getAnswer(ctx.record, id, ctx.person) : undefined;

export function includes(value: AnswerValue | undefined, option: string): boolean {
  return Array.isArray(value) && (value as unknown[]).includes(option);
}

/**
 * A autonomia e o cuidador de uma pessoa são perguntados no Bloco 3 (parte essencial)
 * quando ela tem deficiência ou depende de cuidados. Nos outros casos, no Bloco 4.
 */
export function autonomyAskedInHousehold(data: QuestionnaireData, person: Person): boolean {
  if (person.kind === "child") return getAnswer(data, "child.specialNeeds", person) === "yes";
  if (person.kind === "dependent") {
    const dependency = getAnswer(data, "dependent.dependency", person);
    return dependency === "full" || dependency === "care" || dependency === "partial";
  }
  return false;
}

export function partnerIsGoing(data: QuestionnaireData): boolean {
  const partner = data.answers["household.partner"];
  return partner === "going" || partner === "undecided";
}

function countAnswer(data: QuestionnaireData, id: string): number {
  const value = data.answers[id];
  return typeof value === "number" && value > 0 ? Math.floor(value) : 0;
}

/**
 * Mantém a lista de pessoas de acordo com as respostas do Bloco 3
 * (cônjuge que vai, quantidade de filhos e de outros dependentes).
 * Pessoas que já existem mantêm o mesmo UUID; as removidas perdem as respostas.
 */
export function syncPeople(data: QuestionnaireData): QuestionnaireData {
  const byKind = (kind: Person["kind"]) => data.people.filter((p) => p.kind === kind);
  const resize = (list: Person[], size: number, kind: Person["kind"]) => {
    const kept = list.slice(0, size);
    while (kept.length < size) kept.push({ id: uuid(), kind });
    return kept;
  };

  const self = byKind("self")[0] ?? { id: uuid(), kind: "self" as const };
  const people: Person[] = [
    self,
    ...resize(byKind("partner"), partnerIsGoing(data) ? 1 : 0, "partner"),
    ...resize(byKind("child"), countAnswer(data, "household.children"), "child"),
    ...resize(byKind("dependent"), countAnswer(data, "household.dependents"), "dependent"),
  ];

  const ids = new Set(people.map((p) => p.id));
  const personAnswers = Object.fromEntries(Object.entries(data.personAnswers).filter(([id]) => ids.has(id)));
  return { ...data, people, personAnswers };
}

/** Grava uma resposta e devolve uma cópia nova dos dados (nunca altera o original). */
export function setAnswer(
  data: QuestionnaireData,
  questionId: string,
  value: AnswerValue | undefined,
  person?: Person,
  now: Date = new Date(),
): QuestionnaireData {
  let next: QuestionnaireData;
  if (person) {
    const current = { ...(data.personAnswers[person.id] ?? {}) };
    if (value === undefined) delete current[questionId];
    else current[questionId] = value;
    next = { ...data, personAnswers: { ...data.personAnswers, [person.id]: current } };
  } else {
    const answers = { ...data.answers };
    if (value === undefined) delete answers[questionId];
    else answers[questionId] = value;
    next = { ...data, answers };
  }
  next = syncPeople(next);
  return { ...next, updatedAt: now.toISOString() };
}

export function markBlockCompleted(data: QuestionnaireData, blockId: string): QuestionnaireData {
  if (data.completedBlocks.includes(blockId)) return data;
  return { ...data, completedBlocks: [...data.completedBlocks, blockId] };
}

function isGroup(item: Question | PersonGroup): item is PersonGroup {
  return "group" in item;
}

/** Pessoas de um grupo repetido. "members" é todo mundo que vai. */
export function peopleOf(data: QuestionnaireData, group: PersonGroup["group"]): Person[] {
  if (group === "children") return data.people.filter((p) => p.kind === "child");
  if (group === "dependents") return data.people.filter((p) => p.kind === "dependent");
  // "workers": você, o cônjuge e os filhos e dependentes adultos que pretendem trabalhar nos EUA.
  if (group === "workers") {
    return data.people.filter((p) => p.kind === "self" || p.kind === "partner" || adultPlansToWork(data, p));
  }
  return data.people;
}

/** Valor usado nos textos com gênero (ICU `select`): "male", "female" ou "other" quando não se sabe. */
export type TextSex = "male" | "female" | "other";

const toTextSex = (sex: string | undefined): TextSex => (sex === "male" || sex === "female" ? sex : "other");

/**
 * Variáveis de gênero passadas a todos os textos de um passo:
 * - `sex`: de quem a pergunta fala (a pessoa da vez; o cônjuge nas perguntas "partner.*"; senão, você);
 * - `partnerSex`: do cônjuge;
 * - `adultChildSex`: dos filhos adultos ("other" se não houver ou se forem de sexos diferentes).
 */
export function textSexValues(
  data: QuestionnaireData,
  step: Pick<Step, "question" | "person">,
  now: Date = new Date(),
): { sex: TextSex; partnerSex: TextSex; adultChildSex: TextSex; personKind: Person["kind"] | "other" } {
  const self = data.people.find((p) => p.kind === "self");
  const partner = data.people.find((p) => p.kind === "partner");
  const subject = step.person ?? (step.question.id.startsWith("partner.") ? partner : self);
  const adultSexes = new Set(
    data.people
      .filter((p) => p.kind === "child" && (personAge(data, p, now) ?? 0) >= 18)
      .map((p) => toTextSex(personSex(data, p))),
  );
  return {
    sex: toTextSex(subject ? personSex(data, subject) : undefined),
    partnerSex: toTextSex(partner ? personSex(data, partner) : undefined),
    adultChildSex: adultSexes.size === 1 ? [...adultSexes][0]! : "other",
    // De quem a pergunta fala, para textos como "do seu cônjuge" × "desta pessoa".
    personKind: step.person?.kind ?? "other",
  };
}

/** Opções visíveis de uma pergunta, aplicando as condições de cada opção. */
export function visibleOptions(question: Question, ctx: QuestionContext): string[] {
  return (question.options ?? []).filter((o) => question.optionWhen?.[o]?.(ctx) ?? true);
}

export function stepKey(blockId: string, questionId: string, person?: Person): string {
  return person ? `${blockId}/${questionId}/${person.id}` : `${blockId}/${questionId}`;
}

/** Passos visíveis de um bloco, já aplicando as condições e repetindo as perguntas por pessoa. */
export function visibleSteps(block: Block, data: QuestionnaireData, now: Date = new Date()): Step[] {
  const steps: Step[] = [];
  const add = (question: Question, person?: Person) => {
    const ctx: QuestionContext = { record: data, person, now };
    if (question.when && !question.when(ctx)) return;
    steps.push({ key: stepKey(block.id, question.id, person), blockId: block.id, question, person });
  };

  for (const item of block.items) {
    if (isGroup(item)) {
      for (const person of peopleOf(data, item.group)) {
        for (const question of item.questions) add(question, person);
      }
    } else {
      add(item);
    }
  }
  return steps;
}

/** Um bloco se aplica quando tem pelo menos uma pergunta visível para esta família. */
export function blockApplies(block: Block, data: QuestionnaireData, now: Date = new Date()): boolean {
  return visibleSteps(block, data, now).length > 0;
}

export type BlockProgress = { answered: number; total: number; completed: boolean };

export function blockProgress(block: Block, data: QuestionnaireData, now: Date = new Date()): BlockProgress {
  const steps = visibleSteps(block, data, now);
  const answered = steps.filter((s) => isAnswered(getAnswer(data, s.question.id, s.person))).length;
  return { answered, total: steps.length, completed: data.completedBlocks.includes(block.id) };
}

/** Uma pergunta obrigatória sem resposta impede avançar. */
export function canAdvance(step: Step, data: QuestionnaireData): boolean {
  return step.question.optional === true || isAnswered(getAnswer(data, step.question.id, step.person));
}
