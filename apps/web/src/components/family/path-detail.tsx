"use client";

import { useTranslations } from "next-intl";
import type { VisiblePath } from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import type { JourneyContent } from "@/lib/journey/content";
import type { ReadyJourney } from "@/components/journey/journey-gate";
import { useJourneyText } from "@/components/journey/use-journey-text";
import { SimpleMarkdown } from "@/components/journey/simple-markdown";
import { OfficialSources } from "@/components/journey/official-sources";

type Props = { content: JourneyContent; state: ReadyJourney; visible: VisiblePath; onBack: () => void };

/**
 * Caminho de visto (docs/telas.md, seção 5): por que apareceu, requisitos oficiais resumidos com fonte,
 * o que fazer agora e a recomendação de advogado. Sem ranking, sem nota, sem "você se qualifica".
 */
export function PathDetail({ content, state, visible, onBack }: Props) {
  const t = useTranslations("Family");
  const { personName, taskTitle } = useJourneyText(content, state.data);
  const def = content.catalog.paths.find((p) => p.id === visible.pathId)!;
  const text = content.texts.paths[visible.pathId]!;
  const tasks = def.tasks.flatMap((id) => state.journey.tasks.filter((x) => x.taskId === id));

  return (
    <article className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="min-h-11 self-start font-bold text-primary">
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {t("backToFamily")}
      </button>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-ink2">
          {t(`kind.${visible.kind}`)} · {t(`group.${visible.group}`)}
        </p>
        <h1 className="text-2xl font-semibold">{text.title}</h1>
        <p className="text-ink2">{text.summary}</p>
      </header>

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <h2 className="text-lg font-semibold">{t("whyShown")}</h2>
        <p className="text-sm text-ink2">{t("whyShownHint")}</p>
        <ul className="flex flex-col gap-2">
          {visible.reasons.map((r) => (
            <li key={r.personId ?? "family"} className="flex flex-col gap-1">
              {r.personId && <span className="font-semibold">{personName(r.personId)}</span>}
              {r.reasonIds.length > 0 ? (
                <ul className="flex list-disc flex-col gap-0.5 ps-6 text-ink2">
                  {r.reasonIds.map((id) => <li key={id}>{text.reasons[id]}</li>)}
                </ul>
              ) : (
                <p className="text-ink2">{t("reasonGeneral")}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <SimpleMarkdown text={text.body} sources={def.sources} />

      <section className="flex flex-col gap-2 rounded-2xl border-2 border-celebrate bg-celebrate-soft p-4">
        <h2 className="text-lg font-semibold">⚖️ {t("lawyerTitle")}</h2>
        <p>{t("lawyerBody")}</p>
      </section>

      {tasks.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t("doNow")}</h2>
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li key={task.key}>
                <Link
                  href={`/journey?task=${encodeURIComponent(task.key)}`}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 font-semibold"
                >
                  <span>{taskTitle(task.key)}</span>
                  <span aria-hidden="true" className="text-primary rtl:-scale-x-100">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <OfficialSources sources={def.sources} />
    </article>
  );
}
