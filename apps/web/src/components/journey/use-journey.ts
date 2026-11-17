"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BLOCK_ORDER,
  computeReadiness,
  createProgress,
  generateJourney,
  type Journey,
  type JourneyProgress,
  type QuestionnaireData,
  type Readiness,
} from "@gotousa/shared";
import type { JourneyContent } from "@/lib/journey/content";
import { InvalidProgressError, browserJourneyRepository as progressRepo } from "@/lib/storage/journey-repository";
import { InvalidQuestionnaireError, browserQuestionnaireRepository as questionnaireRepo } from "@/lib/storage/questionnaire-repository";

const SAVE_DELAY_MS = 300;
const essentialBlocks = BLOCK_ORDER.filter((b) => b.stage === "essential").map((b) => b.id);

export type JourneyState =
  | { status: "loading" }
  | { status: "error"; invalid: boolean }
  | { status: "needsQuestionnaire" }
  | {
      status: "ready";
      data: QuestionnaireData;
      progress: JourneyProgress;
      journey: Journey;
      readiness: Readiness;
      now: Date;
    };

/**
 * Carrega as respostas e o progresso do navegador, gera a jornada e salva cada mudança.
 * A jornada é recalculada sempre que o progresso muda (as mesmas entradas geram a mesma jornada).
 */
export function useJourney(content: JourneyContent) {
  const [loaded, setLoaded] = useState<
    | { status: "loading" }
    | { status: "error"; invalid: boolean }
    | { status: "ok"; data: QuestionnaireData | undefined; progress: JourneyProgress; now: Date }
  >({ status: "loading" });
  const [saveFailed, setSaveFailed] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef<JourneyProgress | undefined>(undefined);

  useEffect(() => {
    let active = true;
    Promise.all([questionnaireRepo.load(), progressRepo.load()])
      .then(([data, saved]) => {
        if (!active) return;
        const now = new Date();
        const progress = saved ?? createProgress(now);
        // A jornada começa no primeiro acesso: guarda a data de início.
        if (!saved && data) progressRepo.save(progress).catch(() => setSaveFailed(true));
        setLoaded({ status: "ok", data, progress, now });
      })
      .catch((error: unknown) => {
        if (active) {
          const invalid = error instanceof InvalidProgressError || error instanceof InvalidQuestionnaireError;
          setLoaded({ status: "error", invalid });
        }
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
    progressRepo.save(next).then(
      () => setSaveFailed(false),
      () => setSaveFailed(true),
    );
  }, []);

  /** Atualiza a tela na hora e salva logo em seguida (agrupando digitação rápida). */
  const update = useCallback(
    (change: (progress: JourneyProgress) => JourneyProgress, immediate = false) => {
      setLoaded((current) => {
        if (current.status !== "ok") return current;
        const next = change(current.progress);
        pending.current = next;
        return { ...current, progress: next };
      });
      clearTimeout(saveTimer.current);
      if (immediate) queueMicrotask(flush);
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

  const state = useMemo<JourneyState>(() => {
    if (loaded.status !== "ok") return loaded;
    const { data, progress, now } = loaded;
    if (!data || !essentialBlocks.every((id) => data.completedBlocks.includes(id))) return { status: "needsQuestionnaire" };
    const journey = generateJourney(content.catalog, data, progress, now);
    const readiness = computeReadiness(journey, content.catalog, progress);
    return { status: "ready", data, progress, journey, readiness, now };
  }, [loaded, content]);

  return { state, update, saveFailed };
}
