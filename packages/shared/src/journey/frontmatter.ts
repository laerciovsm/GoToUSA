/**
 * Leitor do cabeçalho dos textos (<idioma>.md). Formato restrito, de propósito simples:
 *
 * ---
 * title: Texto
 * why: Texto
 * subtasks:
 *   id-da-subtarefa: Texto
 * ---
 * Passo a passo em Markdown...
 *
 * Só "chave: valor" e mapas de um nível (com 2 espaços). Sem dependência externa.
 */
export type Frontmatter = Record<string, string | Record<string, string>>;

export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error("Cabeçalho (---) não encontrado");
  const data: Frontmatter = {};
  let currentMap: Record<string, string> | undefined;
  for (const [index, raw] of match[1]!.split("\n").entries()) {
    if (raw.trim() === "") continue;
    const nested = /^ {2}([a-z0-9][a-z0-9.-]*):\s+(.+)$/.exec(raw);
    if (nested) {
      if (!currentMap) throw new Error(`Linha ${index + 1}: item recuado fora de uma lista`);
      currentMap[nested[1]!] = nested[2]!.trim();
      continue;
    }
    const top = /^([a-zA-Z][a-zA-Z0-9]*):(?:\s+(.*))?$/.exec(raw);
    if (!top) throw new Error(`Linha ${index + 1}: formato inválido: "${raw}"`);
    const [, key, value] = top;
    if (value && value.trim() !== "") {
      data[key!] = value.trim();
      currentMap = undefined;
    } else {
      currentMap = {};
      data[key!] = currentMap;
    }
  }
  return { data, body: match[2]!.trim() };
}

/** Marcas de fonte no texto: [[fonte:id]]. */
export function sourceRefs(body: string): string[] {
  return [...body.matchAll(/\[\[fonte:([a-z0-9][a-z0-9.-]*)\]\]/g)].map((m) => m[1]!);
}
