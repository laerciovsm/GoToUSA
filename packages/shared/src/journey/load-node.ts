/**
 * Carrega o conteúdo da jornada a partir dos arquivos de content/journey (só no Node: testes e scripts).
 * NÃO é exportado pelo index do pacote, porque usa o sistema de arquivos.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter.ts";
import { officialListSchema, pathDefSchema, structureSchema, taskDefSchema } from "./schema.ts";
import type { Catalog, CatalogTexts, OfficialList, PathDef, TaskDef } from "./types.ts";

const readJson = (file: string): unknown => JSON.parse(readFileSync(file, "utf8"));
const dirs = (dir: string) =>
  existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : [];

function parseOrThrow<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown; error?: { message: string } } }, value: unknown, where: string): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new Error(`${where}: ${result.error?.message}`);
  return result.data as T;
}

/** Catálogo completo (inclusive rascunhos; o motor ignora o que não está publicado). */
export function loadCatalog(contentDir: string): Catalog {
  const journeyDir = join(contentDir, "journey");
  const structure = parseOrThrow<Catalog["structure"]>(structureSchema, readJson(join(journeyDir, "structure.json")), "structure.json");
  const tasks = dirs(join(journeyDir, "tasks")).map((name) => {
    const def = parseOrThrow<TaskDef>(taskDefSchema, readJson(join(journeyDir, "tasks", name, "task.json")), `tasks/${name}/task.json`);
    if (def.id !== name) throw new Error(`tasks/${name}: o ID (${def.id}) precisa ser igual ao nome da pasta`);
    return def;
  });
  const paths = dirs(join(journeyDir, "paths")).map((name) => {
    const def = parseOrThrow<PathDef>(pathDefSchema, readJson(join(journeyDir, "paths", name, "path.json")), `paths/${name}/path.json`);
    if (def.id !== name) throw new Error(`paths/${name}: o ID (${def.id}) precisa ser igual ao nome da pasta`);
    return def;
  });
  const dataDir = join(contentDir, "data");
  const lists = existsSync(dataDir)
    ? readdirSync(dataDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => parseOrThrow<OfficialList>(officialListSchema, readJson(join(dataDir, f)), `data/${f}`))
    : [];
  return { structure, tasks, paths, lists };
}

/** Textos de um idioma. Lança erro se algum arquivo estiver faltando ou mal formatado. */
export function loadTexts(contentDir: string, locale: string, catalog: Catalog): CatalogTexts {
  const journeyDir = join(contentDir, "journey");
  const messages = readJson(join(journeyDir, "messages", `${locale}.json`)) as {
    phases: CatalogTexts["phases"];
    stages: CatalogTexts["stages"];
  };
  const map = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, string>) : {});
  const text = (v: unknown, where: string) => {
    if (typeof v !== "string" || v.trim() === "") throw new Error(`${where}: texto obrigatório`);
    return v;
  };

  const tasks: CatalogTexts["tasks"] = {};
  for (const def of catalog.tasks) {
    const file = join(journeyDir, "tasks", def.id, `${locale}.md`);
    if (!existsSync(file)) throw new Error(`tasks/${def.id}/${locale}.md não existe`);
    const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
    tasks[def.id] = {
      title: text(data.title, `tasks/${def.id}/${locale}.md (title)`),
      why: text(data.why, `tasks/${def.id}/${locale}.md (why)`),
      subtasks: map(data.subtasks),
      documents: map(data.documents),
      body,
    };
  }

  const paths: CatalogTexts["paths"] = {};
  for (const def of catalog.paths) {
    const file = join(journeyDir, "paths", def.id, `${locale}.md`);
    if (!existsSync(file)) throw new Error(`paths/${def.id}/${locale}.md não existe`);
    const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
    paths[def.id] = {
      title: text(data.title, `paths/${def.id}/${locale}.md (title)`),
      summary: text(data.summary, `paths/${def.id}/${locale}.md (summary)`),
      reasons: map(data.reasons),
      body,
    };
  }

  return { phases: messages.phases, stages: messages.stages, tasks, paths };
}
