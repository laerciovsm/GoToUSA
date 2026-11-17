/**
 * Validação do conteúdo de content/journey (docs/jornada.md, "Verificações automáticas").
 * Bloqueia a publicação de qualquer tarefa ou caminho com problema.
 */
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCALES } from "../i18n";
import { BLOCKS } from "../questionnaire/definition";
import type { Question } from "../questionnaire/types";
import { walkConditions } from "./conditions";
import { FACTS } from "./facts";
import { sourceRefs } from "./frontmatter";
import { loadCatalog, loadTexts } from "./load-node";
import type { Condition } from "./types";

const CONTENT_DIR = fileURLToPath(new URL("../../../../content", import.meta.url));
const catalog = loadCatalog(CONTENT_DIR);
const published = catalog.tasks.filter((t) => t.status === "published");
const publishedPaths = catalog.paths.filter((p) => p.status === "published");

const questions = new Map<string, Question>(
  BLOCKS.flatMap((b) => b.items.flatMap((i) => ("group" in i ? i.questions : [i]))).map((q) => [q.id, q]),
);

/** Problemas numa condição: perguntas, opções, fatos, caminhos e listas que não existem. */
function conditionProblems(condition: Condition | null | undefined, where: string): string[] {
  const problems: string[] = [];
  walkConditions(condition, (leaf) => {
    if ("q" in leaf || "p" in leaf) {
      const qid = "q" in leaf ? leaf.q : leaf.p;
      const q = questions.get(qid);
      if (!q) return problems.push(`${where}: pergunta inexistente "${qid}"`);
      const values = [leaf.is, leaf.has, ...(leaf.in ?? [])].filter((v): v is string => v !== undefined);
      for (const v of values) {
        if (q.options && !q.options.includes(v)) problems.push(`${where}: opção "${v}" não existe em "${qid}"`);
      }
    }
    if ("fact" in leaf && !FACTS[leaf.fact]) problems.push(`${where}: fato calculado inexistente "${leaf.fact}"`);
    if ("path" in leaf && !catalog.paths.some((p) => p.id === leaf.path)) problems.push(`${where}: caminho inexistente "${leaf.path}"`);
    if ("nationalityIn" in leaf && !catalog.lists.some((l) => l.id === leaf.nationalityIn)) {
      problems.push(`${where}: lista oficial inexistente "${leaf.nationalityIn}"`);
    }
    return undefined;
  });
  return problems;
}

describe("conteúdo da jornada: estrutura", () => {
  it("fases e etapas válidas e únicas", () => {
    const stageIds = catalog.structure.stages.map((s) => s.id);
    expect(new Set(stageIds).size).toBe(stageIds.length);
    for (const s of catalog.structure.stages) {
      expect(catalog.structure.phases.some((p) => p.id === s.phase)).toBe(true);
      expect(s.id.startsWith(`${s.phase}.`)).toBe(true);
    }
  });

  it("condições citam só perguntas, opções e fatos que existem", () => {
    const problems = [
      ...catalog.structure.phases.flatMap((p) => conditionProblems(p.appliesWhen, `fase ${p.id}`)),
      ...catalog.structure.stages.flatMap((s) => conditionProblems(s.appliesWhen, `etapa ${s.id}`)),
      ...catalog.tasks.flatMap((t) => [
        ...conditionProblems(t.appliesWhen, `tarefa ${t.id}`),
        ...conditionProblems(t.highlightWhen, `tarefa ${t.id}`),
        ...conditionProblems(t.who.scope === "each" ? t.who.where : null, `tarefa ${t.id}`),
      ]),
      ...catalog.paths.flatMap((p) => [
        ...conditionProblems(p.showWhen, `caminho ${p.id}`),
        ...p.reasons.flatMap((r) => conditionProblems(r.when, `caminho ${p.id}`)),
      ]),
    ];
    expect(problems).toEqual([]);
  });
});

describe("conteúdo da jornada: tarefas publicadas", () => {
  it("etapa existe e é da mesma fase", () => {
    for (const t of published) {
      const stage = catalog.structure.stages.find((s) => s.id === t.stage);
      expect(stage, t.id).toBeDefined();
      expect(stage!.phase, t.id).toBe(t.phase);
    }
  });

  it("dependências existem, estão publicadas e não formam ciclo", () => {
    const byId = new Map(published.map((t) => [t.id, t]));
    for (const t of published) for (const d of t.dependsOn) expect(byId.has(d), `${t.id} → ${d}`).toBe(true);
    const visiting = new Set<string>();
    const visit = (id: string, trail: string[]) => {
      if (trail.includes(id)) throw new Error(`Dependência circular: ${[...trail, id].join(" → ")}`);
      if (visiting.has(id)) return;
      visiting.add(id);
      byId.get(id)?.dependsOn.forEach((d) => visit(d, [...trail, id]));
    };
    published.forEach((t) => visit(t.id, []));
  });

  it("tempo estimado coerente", () => {
    for (const t of published) expect(t.time.minHours <= t.time.maxHours, t.id).toBe(true);
  });

  it("alerta legal sempre tem fonte oficial", () => {
    for (const t of published.filter((t) => t.type === "alert")) expect(t.sources.length, t.id).toBeGreaterThan(0);
  });

  it("fontes com data de verificação no passado e IDs únicos; custo cita fonte existente", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const t of published) {
      const ids = t.sources.map((s) => s.id);
      expect(new Set(ids).size, t.id).toBe(ids.length);
      for (const s of t.sources) expect(s.verifiedAt <= today, `${t.id}/${s.id}`).toBe(true);
      if (t.cost?.source) expect(ids, t.id).toContain(t.cost.source);
    }
  });

  for (const locale of LOCALES) {
    it(`${locale}: textos completos, mesmas subtarefas e documentos, fontes citadas existem`, () => {
      const texts = loadTexts(CONTENT_DIR, locale, catalog);
      for (const t of published) {
        const text = texts.tasks[t.id]!;
        expect(Object.keys(text.subtasks).sort(), `${t.id} (${locale})`).toEqual([...t.subtasks].sort());
        const docs = t.record?.type === "documents" ? t.record.documents : [];
        expect(Object.keys(text.documents).sort(), `${t.id} (${locale})`).toEqual([...docs].sort());
        for (const ref of sourceRefs(text.body)) expect(t.sources.map((s) => s.id), `${t.id} (${locale})`).toContain(ref);
      }
      for (const p of catalog.structure.phases) expect(texts.phases[p.id]?.title, `fase ${p.id}`).toBeTruthy();
      for (const s of catalog.structure.stages) expect(texts.stages[s.id]?.title, `etapa ${s.id}`).toBeTruthy();
    });
  }
});

describe("conteúdo da jornada: caminhos de visto", () => {
  it("todo caminho publicado tem fonte oficial e tarefas existentes", () => {
    for (const p of publishedPaths) {
      expect(p.sources.length, p.id).toBeGreaterThan(0);
      for (const t of p.tasks) expect(catalog.tasks.some((x) => x.id === t), `${p.id} → ${t}`).toBe(true);
    }
  });

  const FORBIDDEN = [/você se qualifica/i, /suas chances/i, /you qualify/i, /your chances/i, /usted califica/i, /calificas/i, /tus posibilidades/i];
  for (const locale of LOCALES) {
    it(`${locale}: nenhum texto de caminho usa expressões proibidas`, () => {
      const texts = loadTexts(CONTENT_DIR, locale, catalog);
      for (const p of publishedPaths) {
        const all = JSON.stringify(texts.paths[p.id]);
        for (const re of FORBIDDEN) expect(re.test(all), `${p.id} (${locale}): ${re}`).toBe(false);
      }
    });
  }
});
