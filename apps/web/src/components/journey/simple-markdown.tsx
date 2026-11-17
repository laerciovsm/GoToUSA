import { Fragment, type ReactNode } from "react";
import type { Source } from "@gotousa/shared";

/**
 * Leitor simples e seguro do passo a passo (docs/telas.md): parágrafos, títulos (##, ###),
 * listas (- e 1.), **negrito**, links https e marcas de fonte [[fonte:id]].
 * Lê linha a linha: um título ou uma lista podem vir logo depois de outra linha, sem linha em branco.
 * Não aceita HTML: tudo vira texto do React, para um erro no conteúdo nunca quebrar a página.
 */
type Props = { text: string; sources: Source[] };

type Block =
  | { kind: "heading"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "p"; lines: string[] };

const INLINE = /\*\*([^*]+)\*\*|\[\[fonte:([a-z0-9][a-z0-9.-]*)\]\]|\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;
const BULLET = /^[-*]\s+/;
const NUMBERED = /^\d+\.\s+/;
const HEADING = /^#{2,3}\s+(.+)$/;

function inline(text: string, sources: Source[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const [, bold, sourceId, linkText, linkUrl] = match;
    if (bold) nodes.push(<strong key={index}>{bold}</strong>);
    else if (sourceId) {
      const source = sources.find((s) => s.id === sourceId);
      if (source) {
        nodes.push(
          <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-2">
            [{source.agency}]
          </a>,
        );
      }
    } else if (linkText && linkUrl) {
      nodes.push(
        <a key={index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-2">
          {linkText}
        </a>,
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    const current = blocks[blocks.length - 1];
    if (line === "") {
      blocks.push({ kind: "p", lines: [] }); // separador: o próximo texto começa um parágrafo novo
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) blocks.push({ kind: "heading", text: heading[1]! });
    else if (BULLET.test(line) || NUMBERED.test(line)) {
      const kind = BULLET.test(line) ? "ul" : "ol";
      const item = line.replace(kind === "ul" ? BULLET : NUMBERED, "");
      if (current?.kind === kind) current.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else if (current?.kind === "p") current.lines.push(line);
    else blocks.push({ kind: "p", lines: [line] });
  }
  return blocks.filter((b) => b.kind !== "p" || b.lines.length > 0);
}

export function SimpleMarkdown({ text, sources }: Props) {
  return (
    <div className="flex flex-col gap-3 text-ink2">
      {parseBlocks(text).map((block, i) => {
        if (block.kind === "heading") {
          return <h3 key={i} className="pt-2 text-lg font-semibold text-ink">{inline(block.text, sources)}</h3>;
        }
        if (block.kind !== "p") {
          const List = block.kind;
          return (
            <List key={i} className={`flex flex-col gap-1.5 ps-6 ${block.kind === "ul" ? "list-disc" : "list-decimal"}`}>
              {block.items.map((item, j) => <li key={j}>{inline(item, sources)}</li>)}
            </List>
          );
        }
        return (
          <p key={i}>
            {block.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && " "}
                {inline(l, sources)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
