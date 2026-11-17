"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { Source } from "@gotousa/shared";

/**
 * Aviso padrão ao final de todo conteúdo com fonte oficial (docs/conteudo.md):
 * informação compilada, link da fonte na íntegra com a data de verificação e "apoio, não consultoria jurídica".
 * Componente fixo, para o aviso nunca faltar.
 */
export function OfficialSources({ sources }: { sources: Source[] }) {
  const t = useTranslations("Journey");
  const format = useFormatter();
  if (sources.length === 0) return null;
  return (
    <aside className="flex flex-col gap-2 rounded-2xl border border-line bg-primary-soft p-4 text-sm">
      <p className="font-bold">ℹ️ {t("aboutInfo")}</p>
      <p className="text-ink2">{t("aboutInfoBody")}</p>
      <ul className="flex flex-col gap-1">
        {sources.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-2">
              {s.agency} – {s.title}
            </a>{" "}
            <span className="text-ink2">
              ({t("verifiedOn", { date: format.dateTime(new Date(`${s.verifiedAt}T12:00:00`), { dateStyle: "short" }) })})
            </span>
          </li>
        ))}
      </ul>
      <p className="text-ink2">{t("aboutInfoLegal")}</p>
    </aside>
  );
}
