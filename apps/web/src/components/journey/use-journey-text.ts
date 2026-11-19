"use client";

import { useCallback } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { FAMILY_EXECUTOR, parseIsoDate, splitTaskKey, type JourneyTask, type QuestionnaireData } from "@gotousa/shared";
import type { JourneyContent } from "@/lib/journey/content";
import { usePersonLabel } from "@/components/questionnaire/use-person-label";

/** Textos montados a partir da jornada: título da tarefa, pessoa, prazo e tempo. */
export function useJourneyText(content: JourneyContent, data: QuestionnaireData) {
  const t = useTranslations("Journey");
  const format = useFormatter();
  const personLabel = usePersonLabel(data);

  const personName = useCallback(
    (personId: string | null) => {
      if (!personId) return null;
      const person = data.people.find((p) => p.id === personId);
      return person ? personLabel(person) : null;
    },
    [data, personLabel],
  );

  /** Quem executa: o nome da pessoa ou "a família toda". */
  const executorName = useCallback(
    (executor: string) => (executor === FAMILY_EXECUTOR ? t("executorFamily") : personName(executor) ?? t("executorFamily")),
    [t, personName],
  );

  /** "Conferir o passaporte · Pedro" (a pessoa só aparece nas tarefas por pessoa). */
  const taskTitle = useCallback(
    (key: string) => {
      const { taskId, personId } = splitTaskKey(key);
      const title = content.texts.tasks[taskId]?.title ?? taskId;
      const name = personName(personId);
      return name ? `${title} · ${name}` : title;
    },
    [content, personName],
  );

  /** "até mar. de 2027" ou, sem data, "12 meses antes da ida". */
  const dueText = useCallback(
    (task: JourneyTask) => {
      if (task.due) return t("dueUntil", { date: format.dateTime(parseIsoDate(task.due), { month: "short", year: "numeric" }) });
      if (task.dueRelative) return t("dueRelative", { ...task.dueRelative });
      return null;
    },
    [t, format],
  );

  const hoursText = useCallback(
    (taskId: string) => {
      const def = content.catalog.tasks.find((d) => d.id === taskId);
      if (!def) return null;
      const { minHours: min, maxHours: max } = def.time;
      return min === max ? t("hoursOne", { n: min }) : t("hoursRange", { min, max });
    },
    [content, t],
  );

  return { personName, executorName, taskTitle, dueText, hoursText };
}
