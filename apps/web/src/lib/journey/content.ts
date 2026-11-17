/**
 * Conteúdo da jornada para as telas (docs/telas.md, "Como os dados chegam à tela").
 * Só roda no servidor, durante o build: lê content/journey, valida (Zod) e entrega
 * o catálogo publicado e os textos de UM idioma. Conteúdo com erro faz o build falhar.
 */
import path from "node:path";
import type { Catalog, CatalogTexts } from "@gotousa/shared";
import { loadCatalog, loadTexts } from "@gotousa/shared/node";

export type JourneyContent = { catalog: Catalog; texts: CatalogTexts };

// O build roda em apps/web; o conteúdo fica na raiz do repositório.
const CONTENT_DIR = path.join(process.cwd(), "..", "..", "content");

const full = loadCatalog(CONTENT_DIR);
const catalog: Catalog = {
  structure: full.structure,
  tasks: full.tasks.filter((t) => t.status === "published"),
  paths: full.paths.filter((p) => p.status === "published"),
  lists: full.lists,
};

const pick = <T,>(record: Record<string, T>, ids: string[]) =>
  Object.fromEntries(ids.filter((id) => id in record).map((id) => [id, record[id]!]));

export function journeyContent(locale: string): JourneyContent {
  const texts = loadTexts(CONTENT_DIR, locale, full);
  return {
    catalog,
    texts: {
      phases: texts.phases,
      stages: texts.stages,
      tasks: pick(texts.tasks, catalog.tasks.map((t) => t.id)),
      paths: pick(texts.paths, catalog.paths.map((p) => p.id)),
    },
  };
}
