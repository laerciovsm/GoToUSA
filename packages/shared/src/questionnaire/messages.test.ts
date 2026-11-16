/**
 * Confere se todas as perguntas, opções e blocos têm texto em todos os idiomas,
 * e se os arquivos de tradução do questionário têm exatamente as mesmas chaves.
 * Os arquivos ficam em apps/web/messages/questionnaire/<idioma>.json.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCALES } from "../i18n";
import { BLOCKS } from "./definition";
import type { Question } from "./types";

type Tree = { [key: string]: string | Tree };

function load(locale: string): Tree {
  const url = new URL(`../../../../apps/web/messages/questionnaire/${locale}.json`, import.meta.url);
  return JSON.parse(readFileSync(fileURLToPath(url), "utf8")) as Tree;
}

function get(tree: Tree, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => (node as Tree | undefined)?.[key], tree);
}

function flatKeys(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : flatKeys(value, `${prefix}${key}.`),
  );
}

const questions: Question[] = BLOCKS.flatMap((b) => b.items.flatMap((i) => ("group" in i ? i.questions : [i])));

function requiredKeys(): string[] {
  const keys = new Set<string>();
  for (const block of BLOCKS) {
    keys.add(`QBlocks.${block.id}.title`);
    keys.add(`QBlocks.${block.id}.intro`);
  }
  for (const q of questions) {
    keys.add(`Q.${q.id}.label`);
    keys.add(`Q.${q.id}.why`);
    for (const o of q.options ?? []) keys.add(`Q.${q.optionsFrom ?? q.id}.options.${o}`);
    for (const o of q.extraOptions ?? []) keys.add(`Q.${q.id}.options.${o}`);
  }
  return [...keys];
}

describe("traduções do questionário", () => {
  const base = load("pt-BR");

  for (const locale of LOCALES) {
    it(`${locale}: tem texto para todas as perguntas, opções e blocos`, () => {
      const messages = load(locale);
      const missing = requiredKeys().filter((k) => typeof get(messages, k) !== "string" || get(messages, k) === "");
      expect(missing).toEqual([]);
    });

    it(`${locale}: tem as mesmas chaves do pt-BR`, () => {
      expect(flatKeys(load(locale)).sort()).toEqual(flatKeys(base).sort());
    });
  }
});
