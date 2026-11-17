"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

/** Texto de uma opção do questionário (ex.: "you.education", "master" → "Mestrado"), na forma neutra. */
export function useOptionLabel() {
  const tq = useTranslations("Q");
  return useCallback(
    (questionId: string, value: string) =>
      tq(`${questionId}.options.${value}`, { sex: "other", partnerSex: "other", adultChildSex: "other", personKind: "other" }),
    [tq],
  );
}
