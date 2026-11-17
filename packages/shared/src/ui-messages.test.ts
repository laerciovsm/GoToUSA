/**
 * Confere se os textos da interface (apps/web/messages/<idioma>.json) têm exatamente
 * as mesmas chaves em todos os idiomas, sem texto vazio.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCALES } from "./i18n";

type Tree = { [key: string]: string | Tree };

const load = (locale: string): Tree =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../../apps/web/messages/${locale}.json`, import.meta.url)), "utf8")) as Tree;

const flat = (tree: Tree, prefix = ""): [string, string][] =>
  Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [[`${prefix}${key}`, value] as [string, string]] : flat(value, `${prefix}${key}.`),
  );

describe("textos da interface", () => {
  const base = flat(load("pt-BR")).map(([k]) => k).sort();
  for (const locale of LOCALES) {
    it(`${locale}: mesmas chaves do pt-BR e nenhum texto vazio`, () => {
      const entries = flat(load(locale));
      expect(entries.map(([k]) => k).sort()).toEqual(base);
      expect(entries.filter(([, v]) => v.trim() === "").map(([k]) => k)).toEqual([]);
    });
  }
});
