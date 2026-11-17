"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  BLOCK_ORDER,
  blockApplies,
  blockProgress,
  createQuestionnaire,
  getAnswer,
  getBlock,
  isAnswered,
  markBlockCompleted,
  setAnswer,
  visibleSteps,
  type AnswerValue,
  type Block,
  type QuestionnaireData,
  type Step,
} from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import {
  InvalidQuestionnaireError,
  browserQuestionnaireRepository as repository,
} from "@/lib/storage/questionnaire-repository";
import {
  getDisclaimerServerSnapshot,
  getDisclaimerSnapshot,
  parseDisclaimer,
  subscribeDisclaimer,
} from "@/lib/disclaimer-store";
import { QuestionStep } from "./question-step";

type View =
  | { kind: "overview" }
  | { kind: "step"; blockId: string; key: string }
  | { kind: "blockDone"; blockId: string };

type LoadState = { status: "loading" } | { status: "error"; invalid: boolean } | { status: "ready" };

const SAVE_DELAY_MS = 300;

/** Moeda usada por último numa resposta de valor livre (para não pedir a moeda toda vez). */
function lastCurrency(data: QuestionnaireData): string {
  for (const id of ["money.debtsMonthly", "money.monthlySaving", "money.saved"]) {
    const value = data.answers[id];
    if (value && typeof value === "object" && !Array.isArray(value)) return value.currency;
  }
  return "USD";
}

const essentialBlocks = BLOCK_ORDER.filter((b) => b.stage === "essential");

export function QuestionnaireApp() {
  const t = useTranslations("Questionnaire");
  const tb = useTranslations("QBlocks");
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [data, setData] = useState<QuestionnaireData | undefined>();
  const [view, setView] = useState<View>({ kind: "overview" });
  const [saveFailed, setSaveFailed] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef<QuestionnaireData | undefined>(undefined);
  const disclaimer = parseDisclaimer(
    useSyncExternalStore(subscribeDisclaimer, getDisclaimerSnapshot, getDisclaimerServerSnapshot),
  );

  useEffect(() => {
    let active = true;
    repository
      .load()
      .then((saved) => {
        if (!active) return;
        setData(saved ?? createQuestionnaire());
        setLoad({ status: "ready" });
      })
      .catch((error: unknown) => {
        if (active) setLoad({ status: "error", invalid: error instanceof InvalidQuestionnaireError });
      });
    return () => {
      active = false;
    };
  }, []);

  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    const next = pending.current;
    pending.current = undefined;
    if (!next) return;
    repository.save(next).then(
      () => setSaveFailed(false),
      () => setSaveFailed(true),
    );
  }, []);

  /** Atualiza a tela na hora e salva no navegador logo em seguida (agrupando digitação rápida). */
  const update = useCallback(
    (next: QuestionnaireData, immediate = false) => {
      setData(next);
      pending.current = next;
      clearTimeout(saveTimer.current);
      if (immediate) flush();
      else saveTimer.current = setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush],
  );

  // Garante o salvamento ao sair da página ou trocar de aba.
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      flush();
    };
  }, [flush]);

  useEffect(() => {
    if (view.kind !== "step") window.scrollTo({ top: 0 });
  }, [view]);

  if (load.status === "loading") {
    return <Shell><p className="text-ink2">{t("loading")}</p></Shell>;
  }
  if (load.status === "error" || !data) {
    return (
      <Shell>
        <p role="alert" className="rounded-2xl border border-error p-4 text-ink">
          {load.status === "error" && load.invalid ? t("invalidData") : t("loadError")}
        </p>
      </Shell>
    );
  }

  // O aviso legal precisa ter sido aceito antes do questionário.
  if (!disclaimer) {
    return (
      <Shell>
        <p className="rounded-2xl border border-line bg-surface p-4">{t("needsDisclaimer")}</p>
        <Link href="/" className="min-h-12 self-start rounded-full bg-action px-6 py-3 font-bold text-on-action">
          {t("back")}
        </Link>
      </Shell>
    );
  }

  /** Entra num passo; se a pergunta tem pré-preenchimento (ex.: país onde mora), aplica. */
  const goToStep = (step: Step) => {
    const { question, person } = step;
    if (question.prefillFrom && !isAnswered(getAnswer(data, question.id, person))) {
      const source = getAnswer(data, question.prefillFrom);
      const first = Array.isArray(source) ? source[0] : undefined;
      if (typeof first === "string") update(setAnswer(data, question.id, first, person));
    }
    setView({ kind: "step", blockId: step.blockId, key: step.key });
    window.scrollTo({ top: 0 });
  };

  const startBlock = (block: Block) => {
    const steps = visibleSteps(block, data);
    const firstOpen = steps.find((s) => !isAnswered(getAnswer(data, s.question.id, s.person)));
    const target = data.completedBlocks.includes(block.id) ? steps[0] : (firstOpen ?? steps[0]);
    if (target) goToStep(target);
  };

  if (view.kind === "step") {
    const block = getBlock(view.blockId)!;
    const steps = visibleSteps(block, data);
    const found = steps.findIndex((s) => s.key === view.key);
    const index = found >= 0 ? found : 0;
    const step = steps[index]!;

    return (
      <QuestionStep
        key={step.key}
        step={step}
        index={index}
        total={steps.length}
        blockTitle={tb(`${block.id}.title`)}
        data={data}
        defaultCurrency={lastCurrency(data)}
        onAnswer={(value: AnswerValue | undefined) => update(setAnswer(data, step.question.id, value, step.person))}
        onBack={() => {
          const previous = steps[index - 1];
          if (previous) goToStep(previous);
          else setView({ kind: "overview" });
        }}
        onNext={() => {
          // Recalcula: a resposta pode ter aberto ou fechado perguntas seguintes.
          const fresh = visibleSteps(block, data);
          const at = fresh.findIndex((s) => s.key === step.key);
          const next = fresh[at + 1];
          if (next) goToStep(next);
          else {
            update(markBlockCompleted(data, block.id), true);
            setView({ kind: "blockDone", blockId: block.id });
          }
        }}
      />
    );
  }

  const essentialDone = essentialBlocks.every((b) => data.completedBlocks.includes(b.id));

  if (view.kind === "blockDone") {
    const nextBlock = BLOCK_ORDER.find((b) => !data.completedBlocks.includes(b.id) && blockApplies(b, data));
    const justFinishedEssential = essentialDone && getBlock(view.blockId)?.stage === "essential";
    return (
      <Shell>
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6" aria-live="polite">
          <span
            aria-hidden="true"
            className="flex size-16 -rotate-6 items-center justify-center rounded-full border-4 border-done text-3xl font-bold text-done"
          >
            ✓
          </span>
          <h1 className="text-2xl font-semibold">{justFinishedEssential ? t("essentialDoneTitle") : t("blockDoneTitle")}</h1>
          <p className="text-ink2">{justFinishedEssential ? t("essentialDoneBody") : t("blockDoneBody")}</p>
          <div className="flex flex-wrap gap-3">
            {nextBlock && (
              <button
                type="button"
                onClick={() => startBlock(nextBlock)}
                className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action"
              >
                {t("nextBlock", { block: tb(`${nextBlock.id}.title`) })}
              </button>
            )}
            <button
              type="button"
              onClick={() => setView({ kind: "overview" })}
              className="min-h-12 rounded-full border-2 border-line px-5 font-bold text-ink"
            >
              {t("toOverview")}
            </button>
          </div>
        </section>
      </Shell>
    );
  }

  const renderBlock = (block: Block) => {
    const progress = blockProgress(block, data);
    const started = progress.answered > 0;
    return (
      <li key={block.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-widest text-ink2">{t("blockNumber", { n: block.number })}</p>
            <h3 className="text-lg font-semibold">{tb(`${block.id}.title`)}</h3>
          </div>
          {progress.completed && (
            <span className="shrink-0 rounded-full border-2 border-done px-3 py-0.5 text-sm font-bold text-done">
              ✓ {t("done")}
            </span>
          )}
        </div>
        <p className="text-ink2">{tb(`${block.id}.intro`)}</p>
        <p className="text-sm text-ink2">
          {t("minutes", { n: block.minutes })} · {t("progress", { answered: progress.answered, total: progress.total })}
        </p>
        <button
          type="button"
          onClick={() => startBlock(block)}
          className={
            progress.completed
              ? "min-h-12 self-start rounded-full border-2 border-primary px-5 font-bold text-primary"
              : "min-h-12 self-start rounded-full bg-action px-6 font-bold text-on-action"
          }
        >
          {progress.completed ? t("review") : started ? t("continue") : t("start")}
        </button>
      </li>
    );
  };

  return (
    <Shell>
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="max-w-[62ch] text-ink2">{t("intro")}</p>
        <p className="text-sm text-ink2">🔒 {t("savedLocally")}</p>
      </section>

      {saveFailed && (
        <p role="alert" className="rounded-2xl border border-error p-4">
          {t("saveError")}
        </p>
      )}

      {essentialDone && (
        <section className="flex flex-col gap-2 rounded-2xl border border-celebrate bg-celebrate-soft p-5">
          <h2 className="text-xl font-semibold">{t("essentialDoneTitle")}</h2>
          <p className="text-ink2">{t("essentialDoneBody")}</p>
        </section>
      )}

      <section aria-labelledby="essential-title" className="flex flex-col gap-3">
        <div>
          <h2 id="essential-title" className="text-xl font-semibold">{t("essentialTitle")}</h2>
          <p className="text-ink2">{t("essentialHint")}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">{essentialBlocks.map(renderBlock)}</ul>
      </section>

      <section aria-labelledby="complete-title" className="flex flex-col gap-3">
        <div>
          <h2 id="complete-title" className="text-xl font-semibold">{t("completeTitle")}</h2>
          <p className="text-ink2">{t("completeHint")}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {BLOCK_ORDER.filter((b) => b.stage === "complete" && blockApplies(b, data)).map(renderBlock)}
        </ul>
      </section>

      <section className="flex flex-col items-start gap-3 border-t border-line pt-6">
        {confirmRestart ? (
          <div role="alertdialog" aria-labelledby="restart-title" className="flex flex-col gap-3 rounded-2xl border border-error p-5">
            <h2 id="restart-title" className="text-lg font-semibold">{t("restartTitle")}</h2>
            <p className="text-ink2">{t("restartBody")}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  update(createQuestionnaire(), true);
                  setConfirmRestart(false);
                  setView({ kind: "overview" });
                }}
                className="min-h-12 rounded-full border-2 border-error px-5 font-bold text-ink"
              >
                {t("restartConfirm")}
              </button>
              <button
                type="button"
                onClick={() => setConfirmRestart(false)}
                className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action"
              >
                {t("restartCancel")}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmRestart(true)}
            className="min-h-11 font-bold text-ink2 underline underline-offset-4"
          >
            {t("restart")}
          </button>
        )}
        <Link href="/" className="min-h-11 font-bold text-primary underline underline-offset-4">
          {t("back")}
        </Link>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">{children}</main>;
}
