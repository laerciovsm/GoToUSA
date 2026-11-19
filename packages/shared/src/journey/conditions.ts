/**
 * Avaliação das condições do conteúdo, com três resultados:
 * true (vale), false (não vale) e undefined ("não sei": depende de uma resposta que ainda não existe).
 * Tarefas essenciais entram quando o resultado não é false; as "conforme o caso", só quando é true.
 */
import { ageAtDeparture, getAnswer, isAnswered, personAge, personSex } from "../questionnaire/engine.ts";
import type { AnswerValue, Person, QuestionnaireData } from "../questionnaire/types.ts";
import { FACTS, type FactValue } from "./facts.ts";
import type { Condition, NumberCompare, OfficialList } from "./types.ts";

export type Tri = boolean | undefined;

export type ConditionContext = {
  data: QuestionnaireData;
  now: Date;
  /** Pessoa da vez (tarefas por pessoa e caminhos por adulto). */
  person?: Person;
  /** Caminhos de visto que estão sendo mostrados. */
  visiblePaths?: ReadonlySet<string>;
  lists?: readonly OfficialList[];
  /** Perguntas sem resposta encontradas durante a avaliação (para o aviso "responda o bloco X"). */
  unanswered?: Set<string>;
};

function compareNumber(value: number, cmp: NumberCompare): boolean {
  if (cmp.gte !== undefined && !(value >= cmp.gte)) return false;
  if (cmp.lte !== undefined && !(value <= cmp.lte)) return false;
  if (cmp.gt !== undefined && !(value > cmp.gt)) return false;
  if (cmp.lt !== undefined && !(value < cmp.lt)) return false;
  return true;
}

const hasNumberCompare = (c: NumberCompare) =>
  c.gte !== undefined || c.lte !== undefined || c.gt !== undefined || c.lt !== undefined;

/** Compara uma resposta com is / in / has / números. Sem operador, basta estar respondida. */
function compareAnswer(
  value: AnswerValue,
  c: { is?: string; in?: string[]; has?: string } & NumberCompare,
): boolean {
  if (c.is !== undefined && value !== c.is) return false;
  if (c.in !== undefined && !(typeof value === "string" && c.in.includes(value))) return false;
  if (c.has !== undefined && !(Array.isArray(value) && (value as unknown[]).includes(c.has))) return false;
  if (hasNumberCompare(c)) {
    // Número, valor com moeda ou, numa lista de várias escolhas, a quantidade de itens marcados.
    const n =
      typeof value === "number"
        ? value
        : Array.isArray(value)
          ? value.length
          : typeof value === "object"
            ? value.amount
            : NaN;
    if (!Number.isFinite(n) || !compareNumber(n, c)) return false;
  }
  return true;
}

function nationalitiesOf(ctx: ConditionContext): string[] | undefined {
  const fromPerson = (p: Person) => {
    const v = p.kind === "self" ? getAnswer(ctx.data, "you.nationalities") : getAnswer(ctx.data, "career.nationalities", p);
    return Array.isArray(v) ? (v as string[]) : undefined;
  };
  if (ctx.person) return fromPerson(ctx.person);
  // Família: nacionalidades de você e do cônjuge.
  const adults = ctx.data.people.filter((p) => p.kind === "self" || p.kind === "partner");
  const all = adults.map(fromPerson);
  if (all.every((n) => n === undefined)) return undefined;
  return all.flatMap((n) => n ?? []);
}

export function evaluate(condition: Condition | null | undefined, ctx: ConditionContext): Tri {
  if (!condition) return true;

  if ("all" in condition) {
    let unknown = false;
    for (const c of condition.all) {
      const r = evaluate(c, ctx);
      if (r === false) return false;
      if (r === undefined) unknown = true;
    }
    return unknown ? undefined : true;
  }
  if ("any" in condition) {
    let unknown = false;
    for (const c of condition.any) {
      const r = evaluate(c, ctx);
      if (r === true) return true;
      if (r === undefined) unknown = true;
    }
    return unknown ? undefined : false;
  }
  if ("not" in condition) {
    const r = evaluate(condition.not, ctx);
    return r === undefined ? undefined : !r;
  }
  if ("q" in condition) {
    const value = ctx.data.answers[condition.q];
    if (!isAnswered(value)) {
      ctx.unanswered?.add(condition.q);
      return undefined;
    }
    return compareAnswer(value!, condition);
  }
  if ("p" in condition) {
    if (!ctx.person) return undefined;
    const value = getAnswer(ctx.data, condition.p, ctx.person);
    if (!isAnswered(value)) {
      ctx.unanswered?.add(condition.p);
      return undefined;
    }
    return compareAnswer(value!, condition);
  }
  if ("w" in condition) {
    if (!ctx.person) return undefined;
    const self = ctx.person.kind === "self";
    const qid = self ? `you.${condition.w}` : `career.${condition.w}`;
    const value = self ? getAnswer(ctx.data, qid) : getAnswer(ctx.data, qid, ctx.person);
    if (!isAnswered(value)) {
      ctx.unanswered?.add(qid);
      return undefined;
    }
    return compareAnswer(value!, condition);
  }
  if ("fact" in condition) {
    const fn = FACTS[condition.fact];
    if (!fn) throw new Error(`Fato calculado desconhecido: ${condition.fact}`);
    const value: FactValue = fn({ data: ctx.data, now: ctx.now });
    if (value === undefined) return undefined;
    if (condition.is !== undefined) return value === condition.is;
    if (hasNumberCompare(condition)) return typeof value === "number" && compareNumber(value, condition);
    return Boolean(value);
  }
  if ("kind" in condition) {
    if (!ctx.person) return undefined;
    const kinds = Array.isArray(condition.kind) ? condition.kind : [condition.kind];
    return kinds.includes(ctx.person.kind);
  }
  if ("age" in condition) {
    if (!ctx.person) return undefined;
    const age = personAge(ctx.data, ctx.person, ctx.now);
    return age === undefined ? undefined : compareNumber(age, condition.age);
  }
  if ("ageAtDeparture" in condition) {
    if (!ctx.person) return undefined;
    const age = ageAtDeparture(ctx.data, ctx.person, ctx.now);
    return age === undefined ? undefined : compareNumber(age, condition.ageAtDeparture);
  }
  if ("sex" in condition) {
    if (!ctx.person) return undefined;
    const sex = personSex(ctx.data, ctx.person);
    return sex === undefined ? undefined : sex === condition.sex;
  }
  if ("path" in condition) {
    return ctx.visiblePaths?.has(condition.path) ?? false;
  }
  if ("nationalityIn" in condition) {
    const list = ctx.lists?.find((l) => l.id === condition.nationalityIn);
    if (!list) throw new Error(`Lista oficial desconhecida: ${condition.nationalityIn}`);
    const nationalities = nationalitiesOf(ctx);
    if (nationalities === undefined) return undefined;
    return nationalities.some((n) => list.codes.includes(n));
  }
  return undefined;
}

/** Percorre todas as condições folha (para os testes de validação do conteúdo). */
export function walkConditions(condition: Condition | null | undefined, visit: (leaf: Condition) => void): void {
  if (!condition) return;
  if ("all" in condition) condition.all.forEach((c) => walkConditions(c, visit));
  else if ("any" in condition) condition.any.forEach((c) => walkConditions(c, visit));
  else if ("not" in condition) walkConditions(condition.not, visit);
  else visit(condition);
}
