"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { getAnswer, personSex, type Person, type QuestionnaireData } from "@gotousa/shared";

/** Nome de exibição de uma pessoa da família: o apelido, se houver, ou "Filho(a) 1", "Cônjuge" etc. */
export function usePersonLabel(data: QuestionnaireData) {
  const t = useTranslations("Questionnaire.person");
  return useCallback(
    (person: Person) => {
      if (person.kind === "self") return t("self");
      if (person.kind === "partner") return t("partner");
      const nicknameId = person.kind === "child" ? "child.nickname" : "dependent.nickname";
      const nickname = getAnswer(data, nicknameId, person);
      if (typeof nickname === "string" && nickname.trim()) return nickname.trim();
      const n = data.people.filter((p) => p.kind === person.kind).findIndex((p) => p.id === person.id) + 1;
      const sex = personSex(data, person);
      return t(person.kind, { n, sex: sex === "male" || sex === "female" ? sex : "other" });
    },
    [data, t],
  );
}
