import { describe, expect, it } from "vitest";
import { BLOCKS, getBlock } from "./definition";
import {
  ageAt,
  blockApplies,
  blockProgress,
  canAdvance,
  createQuestionnaire,
  setAnswer,
  textSexValues,
  uuid,
  visibleOptions,
  visibleSteps,
} from "./engine";
import { parseQuestionnaire } from "./schema";
import type { Question } from "./types";

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
    expect(parseQuestionnaire({ ...data, schemaVersion: 3 })).toBeUndefined();
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

describe("ajustes de lógica (16/11/2026)", () => {
  const career = getBlock("career")!;
  const money = getBlock("money")!;
  let base = createQuestionnaire(NOW);
  base = setAnswer(base, "you.workStatus", "employed", undefined, NOW);
  base = setAnswer(base, "household.partner", "going", undefined, NOW);

  it("cônjuge do lar: sem perguntas de carreira, mas com nacionalidade e escolaridade", () => {
    const data = setAnswer(base, "partner.workStatus", "homemaker", undefined, NOW);
    const ids = stepIds("career", data);
    expect(ids).toContain("career.nationalities@partner");
    expect(ids).toContain("career.education@partner");
    expect(ids).not.toContain("career.sector@partner");
    expect(ids).not.toContain("career.achievements@partner");
    expect(ids).not.toContain("career.principal");
    expect(ids).toContain("career.sector@self");
    expect(stepIds("household", data)).not.toContain("partner.occupation");
  });

  it("você do lar: sem profissão, experiência e registro profissional", () => {
    const data = setAnswer(base, "you.workStatus", "homemaker", undefined, NOW);
    const ids = stepIds("you", data);
    expect(ids).not.toContain("you.occupation");
    expect(ids).not.toContain("you.regulated");
    expect(ids).toContain("you.workStatus");
  });

  it("filial nos EUA só para quem trabalha numa empresa", () => {
    const data = setAnswer(base, "you.workStatus", "unemployed", undefined, NOW);
    expect(stepIds("career", data)).not.toContain("career.multinational@self");
    expect(stepIds("career", base)).toContain("career.multinational@self");
  });

  it("bloco sem perguntas visíveis não se aplica", () => {
    let data = createQuestionnaire(NOW);
    data = setAnswer(data, "household.partner", "none", undefined, NOW);
    data = setAnswer(data, "you.workStatus", "homemaker", undefined, NOW);
    expect(blockApplies(career, data, NOW)).toBe(false);
  });

  it("gravidez: só mulheres de 18 a 55 anos", () => {
    let data = setAnswer(base, "you.sex", "male", undefined, NOW);
    data = setAnswer(data, "you.birthYear", 1985, undefined, NOW);
    data = setAnswer(data, "partner.sex", "female", undefined, NOW);
    data = setAnswer(data, "partner.birthYear", 1987, undefined, NOW);
    data = setAnswer(data, "household.dependents", 1, undefined, NOW);
    const dependent = data.people.find((p) => p.kind === "dependent")!;
    data = setAnswer(data, "dependent.sex", "female", dependent, NOW);
    data = setAnswer(data, "dependent.birth", "1950-01", dependent, NOW);
    const ids = stepIds("health", data);
    expect(ids).not.toContain("health.pregnancy@self");
    expect(ids).toContain("health.pregnancy@partner");
    expect(ids).not.toContain("health.pregnancy@dependent");
  });

  it("inglês do filho só a partir dos 3 anos", () => {
    let data = setAnswer(base, "household.children", 1, undefined, NOW);
    const child = data.people.find((p) => p.kind === "child")!;
    data = setAnswer(data, "child.birth", "2025-06", child, NOW);
    expect(stepIds("household", data)).not.toContain("child.english@child");
    data = setAnswer(data, "child.birth", "2018-06", child, NOW);
    expect(stepIds("household", data)).toContain("child.english@child");
  });

  it("opções de renda mostram só quem existe na família", () => {
    const question = money.items.find((i) => !("group" in i) && i.id === "money.earnersUS") as Question;
    let data = createQuestionnaire(NOW);
    data = setAnswer(data, "household.partner", "none", undefined, NOW);
    expect(visibleOptions(question, { record: data, now: NOW })).toEqual(["me", "unsure"]);
    data = setAnswer(data, "household.partner", "going", undefined, NOW);
    data = setAnswer(data, "household.children", 1, undefined, NOW);
    const child = data.people.find((p) => p.kind === "child")!;
    data = setAnswer(data, "child.birth", "2005-03", child, NOW);
    expect(visibleOptions(question, { record: data, now: NOW })).toEqual(["me", "partner", "adult_child", "unsure"]);
  });
});

describe("escola pela idade e textos com gênero", () => {
  const schoolQuestion = household.items
    .flatMap((i) => ("group" in i ? i.questions : [i]))
    .find((q) => q.id === "child.school")!;

  function withChild(birth: string, sex?: string) {
    let data = setAnswer(createQuestionnaire(NOW), "household.children", 1, undefined, NOW);
    const child = data.people.find((p) => p.kind === "child")!;
    data = setAnswer(data, "child.birth", birth, child, NOW);
    if (sex) data = setAnswer(data, "child.sex", sex, child, NOW);
    return { data, child };
  }

  it("criança de 2 anos não vê faculdade nem ensino médio", () => {
    const { data, child } = withChild("2024-06");
    expect(visibleOptions(schoolQuestion, { record: data, person: child, now: NOW })).toEqual([
      "not_school",
      "preschool",
      "special",
    ]);
  });

  it("filho de 21 anos vê ensino médio, faculdade e já terminou, mas não educação infantil", () => {
    const { data, child } = withChild("2005-03");
    expect(visibleOptions(schoolQuestion, { record: data, person: child, now: NOW })).toEqual([
      "not_school",
      "high",
      "college",
      "finished",
      "special",
    ]);
  });

  it("sexo usado nos textos: da pessoa da vez, do cônjuge nas perguntas partner.* e dos filhos adultos", () => {
    let { data, child } = withChild("2005-03", "female");
    data = setAnswer(data, "you.sex", "male", undefined, NOW);
    data = setAnswer(data, "household.partner", "going", undefined, NOW);
    data = setAnswer(data, "partner.sex", "female", undefined, NOW);
    const q = (id: string) => ({ id, type: "single" as const });
    expect(textSexValues(data, { question: q("why.giveUp") }, NOW)).toEqual({
      sex: "male",
      partnerSex: "female",
      adultChildSex: "female",
    });
    expect(textSexValues(data, { question: q("partner.workStatus") }, NOW).sex).toBe("female");
    expect(textSexValues(data, { question: q("health.specialists"), person: child }, NOW).sex).toBe("female");
    data = setAnswer(data, "household.children", 2, undefined, NOW);
    const son = data.people.filter((p) => p.kind === "child")[1]!;
    data = setAnswer(data, "child.birth", "2003-01", son, NOW);
    data = setAnswer(data, "child.sex", "male", son, NOW);
    expect(textSexValues(data, { question: q("money.earnersUS") }, NOW).adultChildSex).toBe("other");
  });
});

describe("seu momento, padronização e migração (17/11/2026)", () => {
  it("migra dados da versão 1: remédio digitado vira quantidade e unidade padronizadas", () => {
    const v2 = createQuestionnaire(NOW);
    const self = v2.people[0]!;
    const v1 = {
      ...v2,
      schemaVersion: 1,
      personAnswers: {
        [self.id]: {
          "health.medications": [
            { name: "Remédio A", dose: "3 mg", frequency: "1 vez ao dia", special: "no" },
            { name: "Remédio B", dose: "meio comprimido", frequency: "", special: "" },
          ],
        },
      },
    };
    const migrated = parseQuestionnaire(JSON.parse(JSON.stringify(v1)));
    expect(migrated?.schemaVersion).toBe(2);
    expect(migrated?.personAnswers[self.id]?.["health.medications"]).toEqual([
      { name: "Remédio A", amount: 3, unit: "mg", frequency: "", special: "no" },
      { name: "Remédio B", amount: null, unit: "", frequency: "", special: "" },
    ]);
  });

  it("bloco Seu momento: apoio do cônjuge só quando há cônjuge", () => {
    let data = setAnswer(createQuestionnaire(NOW), "household.partner", "none", undefined, NOW);
    expect(stepIds("moment", data)).not.toContain("moment.partnerSupport");
    data = setAnswer(data, "household.partner", "not_going", undefined, NOW);
    expect(stepIds("moment", data)).toContain("moment.partnerSupport");
    expect(getBlock("moment")!.items.every((i) => "group" in i || i.optional)).toBe(true);
  });

  it("cidades só aparecem depois de escolher estados", () => {
    let data = setAnswer(createQuestionnaire(NOW), "dest.known", "yes", undefined, NOW);
    expect(stepIds("dest", data)).not.toContain("dest.cityList");
    data = setAnswer(data, "dest.places", ["WA", "TX"], undefined, NOW);
    expect(stepIds("dest", data)).toContain("dest.cityList");
  });

  it("geriatra só a partir de 55 anos e pediatra do desenvolvimento só até 20", () => {
    let data = setAnswer(createQuestionnaire(NOW), "you.birthYear", 1985, undefined, NOW);
    const self = data.people[0]!;
    const question = health.items
      .flatMap((i) => ("group" in i ? i.questions : [i]))
      .find((q) => q.id === "health.specialistsList")!;
    const options = visibleOptions(question, { record: data, person: self, now: NOW });
    expect(options).not.toContain("geriatrician");
    expect(options).not.toContain("developmental_pediatrician");
    data = setAnswer(data, "you.birthYear", 1960, undefined, NOW);
    expect(visibleOptions(question, { record: data, person: self, now: NOW })).toContain("geriatrician");
  });
});
