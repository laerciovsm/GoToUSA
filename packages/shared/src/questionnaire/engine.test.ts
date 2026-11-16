import { describe, expect, it } from "vitest";
import { BLOCKS, getBlock } from "./definition";
import {
  ageAt,
  blockProgress,
  canAdvance,
  createQuestionnaire,
  setAnswer,
  uuid,
  visibleSteps,
} from "./engine";
import { parseQuestionnaire } from "./schema";

const NOW = new Date("2026-11-16T12:00:00Z");
const household = getBlock("household")!;
const health = getBlock("health")!;

function stepIds(blockId: string, data: ReturnType<typeof createQuestionnaire>) {
  return visibleSteps(getBlock(blockId)!, data, NOW).map((s) => `${s.question.id}${s.person ? `@${s.person.kind}` : ""}`);
}

describe("uuid", () => {
  it("gera UUID v4 válido e único", () => {
    const a = uuid();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(uuid()).not.toBe(a);
  });
});

describe("ageAt", () => {
  it("calcula a idade pelo mês e ano", () => {
    expect(ageAt("2005-03", NOW)).toBe(21);
    expect(ageAt("2005-12", NOW)).toBe(20);
    expect(ageAt("2005-12", new Date("2027-12-01T12:00:00Z"))).toBe(22);
    expect(ageAt("inválido", NOW)).toBeUndefined();
  });
});

describe("definição", () => {
  it("não repete IDs de bloco", () => {
    const ids = BLOCKS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("cenário inicial: casal + filho adulto com deficiência", () => {
  let data = createQuestionnaire(NOW);
  data = setAnswer(data, "household.partner", "going", undefined, NOW);
  data = setAnswer(data, "household.children", 1, undefined, NOW);
  const child = data.people.find((p) => p.kind === "child")!;
  data = setAnswer(data, "child.birth", "2005-03", child, NOW);
  data = setAnswer(data, "child.specialNeeds", "yes", child, NOW);

  it("cria as pessoas: você, cônjuge e filho", () => {
    expect(data.people.map((p) => p.kind)).toEqual(["self", "partner", "child"]);
  });

  it("pergunta autonomia e cuidador do filho na parte essencial (Bloco 3)", () => {
    expect(stepIds("household", data)).toContain("health.autonomy@child");
    const withAutonomy = setAnswer(data, "health.autonomy", "full", child, NOW);
    expect(stepIds("household", withAutonomy)).toContain("health.caregiver@child");
  });

  it("não repete a autonomia do filho no Bloco 4, mas pergunta a dos outros", () => {
    const ids = stepIds("health", data);
    expect(ids).not.toContain("health.autonomy@child");
    expect(ids).toContain("health.autonomy@self");
    expect(ids).toContain("health.autonomy@partner");
  });

  it("mostra as perguntas do cônjuge", () => {
    expect(stepIds("household", data)).toEqual(expect.arrayContaining(["partner.english", "household.partnerUnion"]));
  });

  it("não pergunta gravidez para menores de 18 anos", () => {
    let young = setAnswer(data, "household.children", 2, undefined, NOW);
    const second = young.people.filter((p) => p.kind === "child")[1]!;
    young = setAnswer(young, "child.birth", "2015-01", second, NOW);
    const pregnancy = visibleSteps(health, young, NOW).filter((s) => s.question.id === "health.pregnancy");
    expect(pregnancy.map((s) => s.person?.id)).not.toContain(second.id);
    expect(pregnancy.map((s) => s.person?.id)).toContain(child.id);
  });

  it("mantém o UUID das pessoas e apaga as respostas de quem foi removido", () => {
    const more = setAnswer(data, "household.children", 2, undefined, NOW);
    expect(more.people.find((p) => p.kind === "child")!.id).toBe(child.id);
    const none = setAnswer(more, "household.children", 0, undefined, NOW);
    expect(none.people.some((p) => p.kind === "child")).toBe(false);
    expect(none.personAnswers[child.id]).toBeUndefined();
  });

  it("remove o cônjuge quando ele não vai", () => {
    const alone = setAnswer(data, "household.partner", "not_going", undefined, NOW);
    expect(alone.people.some((p) => p.kind === "partner")).toBe(false);
    expect(stepIds("household", alone)).not.toContain("partner.english");
  });

  it("perfil profissional: pergunta a carreira de você e do cônjuge, e o básico só do cônjuge", () => {
    const ids = stepIds("career", data);
    expect(ids).toEqual(expect.arrayContaining(["career.sector@self", "career.sector@partner", "career.principal"]));
    expect(ids).toContain("career.education@partner");
    expect(ids).not.toContain("career.education@self");
    expect(ids.some((id) => id.endsWith("@child"))).toBe(false);
    const alone = setAnswer(data, "household.partner", "none", undefined, NOW);
    expect(stepIds("career", alone)).not.toContain("career.principal");
  });

  it("calcula o progresso do bloco", () => {
    const progress = blockProgress(household, data, NOW);
    expect(progress.answered).toBe(4);
    expect(progress.total).toBeGreaterThan(progress.answered);
  });

  it("valida o formato salvo (ida e volta)", () => {
    const roundTrip = parseQuestionnaire(JSON.parse(JSON.stringify(data)));
    expect(roundTrip).toEqual(data);
    expect(parseQuestionnaire({ ...data, schemaVersion: 2 })).toBeUndefined();
  });
});

describe("canAdvance", () => {
  it("exige resposta nas perguntas obrigatórias e libera as opcionais", () => {
    const data = createQuestionnaire(NOW);
    const steps = visibleSteps(getBlock("you")!, data, NOW);
    const nationality = steps.find((s) => s.question.id === "you.nationalities")!;
    const languages = steps.find((s) => s.question.id === "you.languages")!;
    expect(canAdvance(nationality, data)).toBe(false);
    expect(canAdvance(languages, data)).toBe(true);
    expect(canAdvance(nationality, setAnswer(data, "you.nationalities", ["BR"], undefined, NOW))).toBe(true);
  });
});
