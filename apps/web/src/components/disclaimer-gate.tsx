"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { BLOCK_ORDER } from "@gotousa/shared";
import { Link, useRouter } from "@/i18n/navigation";
import { browserQuestionnaireRepository } from "@/lib/storage/questionnaire-repository";
import {
  acceptDisclaimer,
  getDisclaimerServerSnapshot,
  getDisclaimerSnapshot,
  parseDisclaimer,
  subscribeDisclaimer,
} from "@/lib/disclaimer-store";

export function DisclaimerGate() {
  const t = useTranslations("Disclaimer");
  const format = useFormatter();
  const checkboxId = useId();
  const [checked, setChecked] = useState(false);

  const raw = useSyncExternalStore(subscribeDisclaimer, getDisclaimerSnapshot, getDisclaimerServerSnapshot);
  const acceptance = parseDisclaimer(raw);
  const router = useRouter();

  // Decisão de 17/11/2026: depois do essencial do questionário, o app abre direto em "Hoje".
  const accepted = acceptance !== null;
  useEffect(() => {
    if (!accepted) return;
    let active = true;
    browserQuestionnaireRepository
      .load()
      .then((data) => {
        const essential = BLOCK_ORDER.filter((b) => b.stage === "essential");
        if (active && data && essential.every((b) => data.completedBlocks.includes(b.id))) router.replace("/today");
      })
      .catch(() => {
        // Sem dados legíveis: fica na tela inicial.
      });
    return () => {
      active = false;
    };
  }, [accepted, router]);

  if (acceptance) {
    return (
      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-primary-soft p-5">
        <p className="text-sm text-ink2">
          <span className="font-bold text-done" aria-hidden="true">✓ </span>
          {t("acceptedOn", {
            date: format.dateTime(new Date(acceptance.acceptedAt), { dateStyle: "medium" }),
          })}
        </p>
        <Link
          href="/questionnaire"
          className="self-start rounded-full bg-action px-6 py-3 font-bold text-on-action"
        >
          {t("continue")}
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="disclaimer-title"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5"
    >
      <h2 id="disclaimer-title" className="text-xl font-semibold">
        {t("title")}
      </h2>
      <div className="flex flex-col gap-3 text-ink2">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
        <p>{t("body3")}</p>
      </div>
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="mt-1 size-5 shrink-0 accent-done"
        />
        <label htmlFor={checkboxId} className="font-semibold">
          {t("checkbox")}
        </label>
      </div>
      <button
        type="button"
        disabled={!checked}
        onClick={acceptDisclaimer}
        className="self-start rounded-full bg-action px-6 py-3 font-bold text-on-action disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("accept")}
      </button>
    </section>
  );
}
