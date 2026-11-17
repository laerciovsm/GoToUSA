import { Fragment, type ReactNode } from "react";
import type { Source } from "@gotousa/shared";

/**
 * Leitor simples e seguro do passo a passo (docs/telas.md): parágrafos, títulos (##, ###),
 * listas (- e 1.), **negrito**, links https e marcas de fonte [[fonte:id]].
 * Não aceita HTML: tudo vira texto do React, para um erro no conteúdo nunca quebrar a página.
 */
type Props = { text: string; sources: Source[] };

const INLINE = /\*\*([^*]+)\*\*|\[\[fonte:([a-z0-9][a-z0-9.-]*)\]\]|\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

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
      nodes.push(
        source ? (
          <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-2">
            [{source.agency}]
          </a>
        ) : null,
      );
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

export function SimpleMarkdown({ text, sources }: Props) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-3 text-ink2">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="flex list-disc flex-col gap-1 ps-6">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^[-*]\s+/, ""), sources)}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="flex list-decimal flex-col gap-1 ps-6">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\.\s+/, ""), sources)}</li>)}
            </ol>
          );
        }
        const heading = /^#{2,3}\s+(.+)$/.exec(lines[0]!);
        if (heading && lines.length === 1) {
          return <h3 key={i} className="pt-1 text-lg font-semibold text-ink">{inline(heading[1]!, sources)}</h3>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
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
