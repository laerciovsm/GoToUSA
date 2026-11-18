import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createQuestionnaire, setAnswer } from "../questionnaire/engine";
import type { QuestionnaireData } from "../questionnaire/types";
import { evaluate } from "./conditions";
import { addMonths, computeDue } from "./dates";
import { FACTS } from "./facts";
import { parseFrontmatter } from "./frontmatter";
import { generateJourney } from "./generate";
import { loadCatalog } from "./load-node";
import { buildFamilyProfile } from "./profile";
import { computeReadiness } from "./readiness";
import { monthsUntil, weekSteps } from "./today";
import { createProgress, parseProgress, toIsoDate } from "./schema";
import type { Catalog, JourneyProgress, PathDef, TaskDef } from "./types";

const NOW = new Date(2026, 10, 17); // 17/11/2026
const CONTENT_DIR = fileURLToPath(new URL("../../../../content", import.meta.url));

/** Cenário inicial (docs/mvp.md): casal + filho de 21 anos com deficiência, mudança por trabalho. */
function founderFamily(departure = "2027-12"): QuestionnaireData {
  let d = createQuestionnaire(NOW);
  const a = (id: string, v: Parameters<typeof setAnswer>[2]) => (d = setAnswer(d, id, v, undefined, NOW));
  a("you.birthYear", 1980);
  a("you.sex", "male");
  a("you.workStatus", "employed");
  a("you.english", "intermediate");
  a("you.nationalities", ["BR"]);
  a("goal.purpose", "work");
  a("goal.duration", "permanent");
  a("goal.departure", departure);
  a("household.partner", "going");
  a("partner.sex", "female");
  a("partner.birthYear", 1982);
  a("partner.workStatus", "homemaker");
  a("household.children", 1);
  a("household.dependents", 0);
  a("rhythm.weeklyTime", "1to3h");
  const child = d.people.find((p) => p.kind === "child")!;
  d = setAnswer(d, "child.birth", "2005-03", child, NOW);
  d = setAnswer(d, "child.specialNeeds", "yes", child, NOW);
  d = setAnswer(d, "adult.plan", "no", child, NOW);
  return d;
}

const task = (over: Partial<TaskDef> & { id: string }): TaskDef => ({
  status: "published",
  phase: "planning",
  stage: "planning.x",
  themes: ["family"],
  type: "action",
  essential: false,
  who: { scope: "family" },
  appliesWhen: null,
  highlightWhen: null,
  deadline: null,
  dependsOn: [],
  weight: "medium",
  time: { minHours: 1, maxHours: 3 },
  cost: null,
  subtasks: [],
  record: null,
  sources: [],
  ...over,
});

const fixture = (tasks: TaskDef[], paths: PathDef[] = []): Catalog => ({
  structure: {
    phases: [
      { id: "discovery", order: 0, appliesWhen: null },
      { id: "planning", order: 1, appliesWhen: null },
      { id: "settling", order: 5, appliesWhen: { not: { q: "goal.duration", is: "lt6m" } } },
    ],
    stages: [
      { id: "discovery.x", phase: "discovery", order: 1, appliesWhen: null },
      { id: "planning.x", phase: "planning", order: 1, appliesWhen: null },
      { id: "settling.x", phase: "settling", order: 1, appliesWhen: null },
    ],
  },
  tasks,
  paths,
  lists: [],
});

const progressAt = (date = NOW): JourneyProgress => createProgress(date);

describe("condições (três resultados)", () => {
  const data = founderFamily();
  const ctx = { data, now: NOW };
  it("resposta, escolha múltipla, número e 'não sei'", () => {
    expect(evaluate({ q: "goal.purpose", is: "work" }, ctx)).toBe(true);
    expect(evaluate({ q: "goal.purpose", in: ["study"] }, ctx)).toBe(false);
    expect(evaluate({ q: "you.nationalities", has: "BR" }, ctx)).toBe(true);
    expect(evaluate({ q: "household.children", gte: 1 }, ctx)).toBe(true);
    expect(evaluate({ q: "money.debts", is: "yes" }, ctx)).toBeUndefined();
  });
  it("todas, alguma e não com 'não sei'", () => {
    const unknown = { q: "money.debts", is: "yes" } as const;
    expect(evaluate({ all: [{ q: "goal.purpose", is: "work" }, unknown] }, ctx)).toBeUndefined();
    expect(evaluate({ all: [{ q: "goal.purpose", is: "study" }, unknown] }, ctx)).toBe(false);
    expect(evaluate({ any: [{ q: "goal.purpose", is: "work" }, unknown] }, ctx)).toBe(true);
    expect(evaluate({ not: unknown }, ctx)).toBeUndefined();
  });
  it("pessoa da vez: tipo, resposta, idade na ida e sexo", () => {
    const child = data.people.find((p) => p.kind === "child")!;
    const pctx = { ...ctx, person: child };
    expect(evaluate({ kind: "child" }, pctx)).toBe(true);
    expect(evaluate({ p: "child.specialNeeds", is: "yes" }, pctx)).toBe(true);
    expect(evaluate({ ageAtDeparture: { gte: 21 } }, pctx)).toBe(true);
    expect(evaluate({ sex: "female" }, pctx)).toBeUndefined();
  });
});

describe("fatos calculados", () => {
  const data = founderFamily();
  const f = (name: string) => FACTS[name]!({ data, now: NOW });
  it("calcula a partir das respostas", () => {
    expect(f("partnerGoing")).toBe(true);
    expect(f("childrenCount")).toBe(1);
    expect(f("hasAdultChild")).toBe(true);
    expect(f("maxChildAgeAtDeparture")).toBe(22);
    expect(f("hasSpecialNeeds")).toBe(true);
    expect(f("monthsUntilDeparture")).toBe(13);
    expect(f("departureKnown")).toBe(true);
    expect(f("partnerHasCareer")).toBe(false);
  });
  it("devolve 'não sei' sem a resposta", () => {
    expect(FACTS.childrenCount!({ data: createQuestionnaire(NOW), now: NOW })).toBeUndefined();
  });
});

describe("prazos", () => {
  const refs = { start: NOW, departure: new Date(2027, 11, 1), arrival: new Date(2027, 11, 1), discoveryDue: undefined };
  it("para trás da ida, para frente da chegada e do início", () => {
    expect(toIsoDate(computeDue({ from: "departure", monthsBefore: 12 }, "planning", refs).due!)).toBe("2026-12-01");
    expect(toIsoDate(computeDue({ from: "arrival", daysAfter: 30 }, "arrival", refs).due!)).toBe("2027-12-31");
    expect(toIsoDate(computeDue(null, "discovery", refs).due!)).toBe("2026-12-17");
    expect(toIsoDate(computeDue(null, "preparation", refs).due!)).toBe("2027-09-01");
    expect(computeDue(null, "future", refs).due).toBeUndefined();
  });
  it("sem data de ida: sem data, com o texto relativo", () => {
    const r = computeDue(null, "planning", { ...refs, departure: undefined, arrival: undefined });
    expect(r.due).toBeUndefined();
    expect(r.relative).toEqual({ ref: "departure", amount: 12, unit: "months", direction: "before" });
  });
  it("soma de meses respeita o fim do mês", () => {
    expect(toIsoDate(addMonths(new Date(2027, 0, 31), 1))).toBe("2027-02-28");
  });
});

describe("geração: essencial × conforme o caso, por pessoa, fases", () => {
  const catalog = fixture([
    task({ id: "essential-always", essential: true }),
    task({ id: "essential-unless", essential: true, appliesWhen: { not: { q: "money.debts", is: "no" } } }),
    task({ id: "case-debts", appliesWhen: { q: "money.debts", is: "yes" } }),
    task({ id: "per-child", who: { scope: "each", where: { kind: "child" } } }),
    task({ id: "settling-task", phase: "settling", stage: "settling.x" }),
  ]);

  it("essencial entra sem resposta; conforme o caso não entra", () => {
    const j = generateJourney(catalog, founderFamily(), progressAt(), NOW);
    const ids = j.tasks.map((t) => t.taskId);
    expect(ids).toContain("essential-always");
    expect(ids).toContain("essential-unless");
    expect(ids).not.toContain("case-debts");
    expect(j.missingBlocks).toContain("money");
  });

  it("essencial sai quando a resposta mostra que não se aplica", () => {
    const data = setAnswer(founderFamily(), "money.debts", "no", undefined, NOW);
    expect(generateJourney(catalog, data, progressAt(), NOW).tasks.map((t) => t.taskId)).not.toContain("essential-unless");
  });

  it("tarefa por pessoa usa a chave idDaTarefa@idDaPessoa", () => {
    const data = founderFamily();
    const child = data.people.find((p) => p.kind === "child")!;
    const keys = generateJourney(catalog, data, progressAt(), NOW).tasks.map((t) => t.key);
    expect(keys).toContain(`per-child@${child.id}`);
  });

  it("fase de estabelecimento some para estadias de até 6 meses", () => {
    const data = setAnswer(founderFamily(), "goal.duration", "lt6m", undefined, NOW);
    const j = generateJourney(catalog, data, progressAt(), NOW);
    expect(j.phases.map((p) => p.id)).not.toContain("settling");
    expect(j.tasks.map((t) => t.taskId)).not.toContain("settling-task");
  });

  it("a mesma resposta gera sempre a mesma jornada", () => {
    const data = founderFamily();
    expect(generateJourney(catalog, data, progressAt(), NOW)).toEqual(generateJourney(catalog, data, progressAt(), NOW));
  });
});

describe("geração: dependências, prioridade, progresso e próximo passo", () => {
  const catalog = fixture([
    task({ id: "first", phase: "discovery", stage: "discovery.x", essential: true }),
    task({ id: "second", phase: "discovery", stage: "discovery.x", essential: true, dependsOn: ["first"] }),
    task({ id: "needs-missing", phase: "discovery", stage: "discovery.x", essential: true, dependsOn: ["case-only"] }),
    task({ id: "case-only", appliesWhen: { q: "money.debts", is: "yes" } }),
    task({ id: "light", weight: "low", essential: true }),
  ]);

  it("aguarda a dependência; o que não se aplica não trava", () => {
    const j = generateJourney(catalog, founderFamily(), progressAt(), NOW);
    const byId = (id: string) => j.tasks.find((t) => t.taskId === id)!;
    expect(byId("second").state).toBe("waiting");
    expect(byId("second").waitingFor).toEqual(["first"]);
    expect(byId("needs-missing").state).toBe("open");
  });

  it("'não se aplica' libera a dependente; o progresso fica pela chave", () => {
    const progress = progressAt();
    progress.tasks.first = { status: "na", subtasks: [], doneAt: null, plan: "", note: "", record: null };
    const j = generateJourney(catalog, founderFamily(), progress, NOW);
    expect(j.tasks.find((t) => t.taskId === "second")!.state).toBe("open");
    expect(j.tasks.find((t) => t.taskId === "first")!.status).toBe("na");
  });

  it("prazo que passou vira prioridade, nunca 'atrasada'", () => {
    const started = new Date(2026, 8, 1); // começou em 01/09/2026: a Fase 0 venceu em 01/10/2026
    const j = generateJourney(catalog, founderFamily(), progressAt(started), NOW);
    expect(j.tasks.find((t) => t.taskId === "first")!.priority).toBe(true);
  });

  it("próximo passo: primeira tarefa disponível da fase mais adiantada; fase difícil sugere peso baixo", () => {
    const data = founderFamily();
    expect(generateJourney(catalog, data, progressAt(), NOW).nextStep).toBe("first");
    const hard = setAnswer(data, "moment.life", "hard", undefined, NOW);
    const progress = progressAt();
    ["first", "second", "needs-missing"].forEach((k) => {
      progress.tasks[k] = { status: "done", subtasks: [], doneAt: null, plan: "", note: "", record: null };
    });
    expect(generateJourney(catalog, hard, progress, NOW).nextStep).toBe("light");
  });
});

describe("conferência de realidade", () => {
  const catalog = fixture([task({ id: "big", essential: true, time: { minHours: 100, maxHours: 100 } })]);
  it("aperta quando o tempo não cabe e avisa quando não há data", () => {
    const tight = generateJourney(catalog, founderFamily("2027-01"), progressAt(), NOW).reality;
    expect(tight.kind).toBe("tight");
    const loose = generateJourney(catalog, founderFamily("2029-12"), progressAt(), NOW).reality;
    expect(loose.kind).toBe("ok");
    const unsure = setAnswer(founderFamily(), "goal.departure", "unsure", undefined, NOW);
    expect(generateJourney(catalog, unsure, progressAt(), NOW).reality.kind).toBe("no_departure");
    expect(generateJourney(catalog, founderFamily("2026-01"), progressAt(), NOW).reality.kind).toBe("departure_passed");
  });
});

describe("caminhos por adulto", () => {
  const path: PathDef = {
    id: "work-path",
    status: "published",
    kind: "temporary",
    group: "work",
    byWorker: true,
    showWhen: { any: [{ kind: "self" }, { p: "adult.plan", in: ["work", "both"] }] },
    reasons: [{ id: "self", when: { kind: "self" } }],
    tasks: [],
    sources: [{ id: "x", url: "https://www.uscis.gov/", agency: "USCIS", title: "USCIS", verifiedAt: "2026-11-16" }],
  };
  const catalog = fixture([task({ id: "path-task", appliesWhen: { path: "work-path" } })], [path]);

  it("avalia cada adulto que vai e libera as tarefas do caminho", () => {
    let data = founderFamily();
    const self = data.people.find((p) => p.kind === "self")!;
    const child = data.people.find((p) => p.kind === "child")!;
    let j = generateJourney(catalog, data, progressAt(), NOW);
    expect(j.paths[0]!.personIds).toEqual([self.id]);
    expect(j.tasks.map((t) => t.taskId)).toContain("path-task");
    data = setAnswer(data, "adult.plan", "work", child, NOW);
    j = generateJourney(catalog, data, progressAt(), NOW);
    expect(j.paths[0]!.personIds).toEqual([self.id, child.id]);
  });
});

describe("prontidão e perfil", () => {
  const catalog = fixture([
    task({ id: "a", essential: true, weight: "high", themes: ["finance"], subtasks: ["s1", "s2"] }),
    task({ id: "b", essential: true, weight: "low", themes: ["family"] }),
    task({ id: "c", essential: true, weight: "medium", themes: ["family"] }),
  ]);
  it("pesos, crédito parcial, 'não se aplica' e tarefas próprias", () => {
    const data = founderFamily();
    const progress = progressAt();
    progress.tasks.a = { status: "doing", subtasks: ["s1"], doneAt: null, plan: "", note: "", record: null };
    progress.tasks.b = { status: "done", subtasks: [], doneAt: null, plan: "", note: "", record: null };
    progress.tasks.c = { status: "na", subtasks: [], doneAt: null, plan: "", note: "", record: null };
    progress.ownTasks.push({
      id: "11111111-1111-4111-8111-111111111111",
      title: "Minha tarefa",
      phase: "planning",
      stage: "planning.x",
      theme: "family",
      people: [],
      weight: "low",
      due: null,
      status: "done",
      createdAt: NOW.toISOString(),
    });
    const r = computeReadiness(generateJourney(catalog, data, progress, NOW), catalog, progress);
    // a: 5 × 1/2 = 2,5 · b: 1 · c: fora · própria: 1 → 4,5 de 7
    expect(r.total.done).toBeCloseTo(4.5);
    expect(r.total.total).toBe(7);
    expect(r.byTheme.family).toEqual({ done: 2, total: 2, ratio: 1 });
    expect(r.byStage["planning.x"]!.total).toBe(7);
  });

  it("perfil: idades na ida, apoio, renda única e sem dados sensíveis", () => {
    let data = founderFamily();
    data = setAnswer(data, "money.earnersUS", ["me"], undefined, NOW);
    const profile = buildFamilyProfile(data, generateJourney(catalog, data, progressAt(), NOW), NOW);
    const child = profile.people.find((p) => p.kind === "child")!;
    expect(child.ageAtDeparture).toBe(22);
    expect(child.needsSupport).toBe(true);
    expect(profile.income.singleIncome).toBe(true);
    expect(JSON.stringify(profile)).not.toContain("medications");
  });
});

describe("progresso salvo e textos", () => {
  it("valida o progresso (ida e volta) e recusa formato desconhecido", () => {
    const p = progressAt();
    expect(parseProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
    expect(parseProgress({ ...p, schemaVersion: 3 })).toBeUndefined();
  });
  it("lê o cabeçalho dos textos", () => {
    const { data, body } = parseFrontmatter("---\ntitle: Olá: mundo\nsubtasks:\n  a-1: Primeira\n---\n\nTexto");
    expect(data).toEqual({ title: "Olá: mundo", subtasks: { "a-1": "Primeira" } });
    expect(body).toBe("Texto");
  });
});

describe("cenário inicial com o conteúdo real", () => {
  it("gera a jornada do fundador com as tarefas de exemplo", () => {
    const catalog = loadCatalog(CONTENT_DIR);
    const data = founderFamily();
    const child = data.people.find((p) => p.kind === "child")!;
    const self = data.people.find((p) => p.kind === "self")!;
    const j = generateJourney(catalog, data, progressAt(), NOW);
    const keys = j.tasks.map((t) => t.key);
    expect(keys).toContain("family-talk");
    expect(keys).toContain("explore-paths");
    expect(keys).toContain("moving-budget");
    expect(keys).toContain("english-plan");
    expect(keys).toContain(`care-plan@${child.id}`);
    expect(keys).toContain(`passport-check@${self.id}`);
    expect(keys).not.toContain("set-departure-date"); // a data de ida já foi definida
    expect(j.departure).toBe("2027-12-01");
    expect(j.nextStep).toBe("family-talk");
    expect(j.tasks.find((t) => t.key === `care-plan@${child.id}`)!.state).toBe("waiting");
  });

  it("representação legal só para filho ou dependente adulto que não é independente", () => {
    const catalog = loadCatalog(CONTENT_DIR);
    const keysFor = (birth: string, autonomy?: string) => {
      let data = founderFamily();
      const child = data.people.find((p) => p.kind === "child")!;
      data = setAnswer(data, "child.birth", birth, child, NOW);
      if (autonomy) data = setAnswer(data, "health.autonomy", autonomy, child, NOW);
      return { keys: generateJourney(catalog, data, progressAt(), NOW).tasks.map((t) => t.key), key: `legal-representation@${child.id}` };
    };
    const adultFull = keysFor("2005-03", "full");
    expect(adultFull.keys).toContain(adultFull.key);
    const adultIndependent = keysFor("2005-03", "independent");
    expect(adultIndependent.keys).not.toContain(adultIndependent.key);
    const unanswered = keysFor("2005-03");
    expect(unanswered.keys).not.toContain(unanswered.key);
    const turns18BeforeDeparture = keysFor("2009-06", "help"); // 17 hoje, 18 na ida (12/2027)
    expect(turns18BeforeDeparture.keys).toContain(turns18BeforeDeparture.key);
    const minor = keysFor("2015-01", "full");
    expect(minor.keys).not.toContain(minor.key);
  });
});

describe("caminhos de visto com o conteúdo real", () => {
  const catalog = loadCatalog(CONTENT_DIR);
  const shown = (data: QuestionnaireData) => generateJourney(catalog, data, progressAt(), NOW).paths;
  const byId = (data: QuestionnaireData, id: string) => shown(data).find((p) => p.pathId === id);

  it("sem respostas de carreira, nenhum caminho por trabalho aparece e o bloco de carreira é sugerido", () => {
    const j = generateJourney(catalog, founderFamily(), progressAt(), NOW);
    expect(j.paths.map((p) => p.pathId)).not.toContain("eb2-professional");
    expect(j.missingBlocks).toContain("career");
  });

  it("mestrado de quem é o titular mostra o EB-2 por essa pessoa, com o motivo", () => {
    let d = setAnswer(founderFamily(), "you.education", "master", undefined, NOW);
    const self = d.people.find((p) => p.kind === "self")!;
    d = setAnswer(d, "career.achievements", ["publications"], self, NOW);
    const eb2 = byId(d, "eb2-professional")!;
    expect(eb2.personIds).toEqual([self.id]);
    expect(eb2.reasons[0]!.reasonIds).toContain("degree");
    expect(byId(d, "eb2-niw")).toBeDefined();
    expect(byId(d, "eb1-extraordinary")).toBeUndefined(); // só 1 conquista marcada
  });

  it("graduação com 5 anos de experiência também leva ao EB-2 (a resposta de você vem de you.*)", () => {
    let d = setAnswer(founderFamily(), "you.education", "bachelor", undefined, NOW);
    d = setAnswer(d, "you.experienceYears", 6, undefined, NOW);
    expect(byId(d, "eb2-professional")!.reasons[0]!.reasonIds).toContain("bachelor5");
  });

  it("3 conquistas mostram EB-1 e O-1 (conta os itens marcados)", () => {
    const d0 = founderFamily();
    const self = d0.people.find((p) => p.kind === "self")!;
    const d = setAnswer(d0, "career.achievements", ["awards", "media", "judge"], self, NOW);
    expect(byId(d, "eb1-extraordinary")).toBeDefined();
    expect(byId(d, "o1-extraordinary")).toBeDefined();
  });

  it("investimento mostra EB-5 e E-2 para a família", () => {
    let d = setAnswer(founderFamily(), "goal.purpose", "business", undefined, NOW);
    d = setAnswer(d, "goal.has", ["capital"], undefined, NOW);
    expect(byId(d, "eb5-investor")!.personIds).toBeNull();
    expect(byId(d, "e2-treaty-investor")).toBeDefined();
  });

  it("nacionalidade mexicana mostra o TN; brasileira não", () => {
    expect(byId(founderFamily(), "tn-usmca")).toBeUndefined();
    const d = setAnswer(founderFamily(), "you.nationalities", ["BR", "MX"], undefined, NOW);
    expect(byId(d, "tn-usmca")).toBeDefined();
  });

  it("filho adulto que pretende estudar ganha o caminho de estudante por ele", () => {
    const d0 = founderFamily();
    const child = d0.people.find((p) => p.kind === "child")!;
    const d = setAnswer(d0, "adult.plan", "study", child, NOW);
    expect(byId(d, "student-f1-m1")!.personIds).toEqual([child.id]);
  });

  it("a tarefa de conversar com advogado entra para todos, depois de conhecer os caminhos", () => {
    const j = generateJourney(catalog, founderFamily(), progressAt(), NOW);
    const t = j.tasks.find((x) => x.key === "talk-to-attorney")!;
    expect(t.state).toBe("waiting");
    expect(t.waitingFor).toEqual(["explore-paths"]);
  });
});

describe("tela Hoje", () => {
  const catalog = loadCatalog(CONTENT_DIR);

  it("passos da semana começam pelo próximo passo e respeitam as horas escolhidas", () => {
    const data = founderFamily(); // 1 a 3 horas por semana
    const j = generateJourney(catalog, data, progressAt(), NOW);
    const steps = weekSteps(j, data);
    expect(steps[0]!.key).toBe(j.nextStep);
    expect(steps.reduce((s, t) => s + t.hours, 0) <= 3 || steps.length === 1).toBe(true);
    expect(steps.every((t) => t.state === "open")).toBe(true);
  });

  it("mais tempo por semana mostra mais passos (no máximo 5)", () => {
    const little = founderFamily();
    const lots = setAnswer(founderFamily(), "rhythm.weeklyTime", "gt5h", undefined, NOW);
    const a = weekSteps(generateJourney(catalog, little, progressAt(), NOW), little).length;
    const b = weekSteps(generateJourney(catalog, lots, progressAt(), NOW), lots).length;
    expect(b).toBeGreaterThanOrEqual(a);
    expect(b).toBeLessThanOrEqual(5);
  });

  it("meses até a meta", () => {
    expect(monthsUntil("2027-12-01", NOW)).toBe(13);
    expect(monthsUntil("2026-11-01", NOW)).toBe(0);
    expect(monthsUntil("2026-09-01", NOW)).toBe(-2);
  });
});
