"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import {
  addOwnTask,
  removeOwnTask,
  setOwnTaskStatus,
  THEME_IDS,
  updateOwnTask,
  uuid,
  WEIGHTS,
  type OwnTask,
  type OwnTaskInput,
  type PhaseId,
  type ThemeId,
} from "@gotousa/shared";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyUpdate, ReadyJourney } from "./journey-gate";
import { useJourneyText } from "./use-journey-text";

const fieldClass = "w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-ink focus:border-primary focus:outline-none";
const chip = (selected: boolean) =>
  `min-h-11 rounded-full border-2 px-4 font-bold ${selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink"}`;

type Props = {
  content: JourneyContent;
  state: ReadyJourney;
  update: JourneyUpdate;
  /** Tarefa a editar; sem ela, cria uma nova. */
  editing: OwnTask | undefined;
  /** Fase sugerida para uma tarefa nova (a fase que a pessoa estava vendo). */
  defaultPhase: PhaseId | null;
  onDone: () => void;
};

/**
 * Tarefa própria (docs/telas.md, seção 7): só o título é obrigatório. Etapa, tema, pessoas, peso
 * (padrão: baixo) e prazo (mês e ano) são opcionais. Conta no progresso geral e no da etapa e do tema.
 */
export function OwnTaskForm({ content, state, update, editing, defaultPhase, onDone }: Props) {
  const t = useTranslations("Journey");
  const tt = useTranslations("Today.theme");
  const { personName } = useJourneyText(content, state.data);
  const ids = { title: useId(), phase: useId(), stage: useId(), theme: useId(), due: useId() };
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<OwnTaskInput>(
    editing
      ? { title: editing.title, phase: editing.phase, stage: editing.stage, theme: editing.theme, people: editing.people, weight: editing.weight, due: editing.due }
      : { title: "", phase: defaultPhase, stage: null, theme: null, people: [], weight: "low", due: null },
  );
  const set = (fields: Partial<OwnTaskInput>) => setForm((f) => ({ ...f, ...fields }));
  const stages = form.phase ? (state.journey.phases.find((p) => p.id === form.phase)?.stages ?? []) : [];
  const valid = form.title.trim().length > 0;

  const save = () => {
    if (!valid) return;
    update((p) => (editing ? updateOwnTask(p, editing.id, form) : addOwnTask(p, form, uuid())), true);
    onDone();
  };

  return (
    <article className="flex flex-col gap-5">
      <button type="button" onClick={onDone} className="min-h-11 self-start font-bold text-primary">
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {t("backToJourney")}
      </button>
      <h1 className="text-2xl font-semibold">{editing ? t("own.editTitle") : t("own.newTitle")}</h1>
      <p className="text-ink2">{t("own.intro")}</p>

      <div className="flex flex-col gap-1">
        <label htmlFor={ids.title} className="font-semibold">{t("own.title")}</label>
        <input id={ids.title} type="text" maxLength={200} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder={t("own.titlePlaceholder")} className={fieldClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={ids.phase} className="font-semibold">{t("own.phase")}</label>
          <select id={ids.phase} value={form.phase ?? ""} onChange={(e) => set({ phase: (e.target.value || null) as PhaseId | null, stage: null })} className={fieldClass}>
            <option value="">{t("own.none")}</option>
            {state.journey.phases.map((p) => <option key={p.id} value={p.id}>{content.texts.phases[p.id]?.title ?? p.id}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={ids.stage} className="font-semibold">{t("own.stage")}</label>
          <select id={ids.stage} value={form.stage ?? ""} disabled={stages.length === 0} onChange={(e) => set({ stage: e.target.value || null })} className={fieldClass}>
            <option value="">{t("own.none")}</option>
            {stages.map((s) => <option key={s} value={s}>{content.texts.stages[s]?.title ?? s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={ids.theme} className="font-semibold">{t("own.theme")}</label>
          <select id={ids.theme} value={form.theme ?? ""} onChange={(e) => set({ theme: (e.target.value || null) as ThemeId | null })} className={fieldClass}>
            <option value="">{t("own.none")}</option>
            {THEME_IDS.map((th) => <option key={th} value={th}>{tt(th)}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={ids.due} className="font-semibold">{t("own.due")}</label>
          <input id={ids.due} type="month" value={form.due ?? ""} onChange={(e) => set({ due: e.target.value || null })} className={fieldClass} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">{t("own.people")}</legend>
        <div className="flex flex-wrap gap-2">
          {state.data.people.map((p) => {
            const selected = form.people.includes(p.id);
            return (
              <button key={p.id} type="button" aria-pressed={selected} onClick={() => set({ people: selected ? form.people.filter((x) => x !== p.id) : [...form.people, p.id] })} className={chip(selected)}>
                {selected && <span aria-hidden="true">✓ </span>}
                {personName(p.id)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">{t("own.weight")}</legend>
        <div className="flex flex-wrap gap-2">
          {WEIGHTS.map((w) => (
            <button key={w} type="button" aria-pressed={form.weight === w} onClick={() => set({ weight: w })} className={chip(form.weight === w)}>
              {t(`weight.${w}`)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <button type="button" disabled={!valid} onClick={save} className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action disabled:opacity-50">
          {t("own.save")}
        </button>
        <button type="button" onClick={onDone} className="min-h-12 rounded-full border-2 border-line px-5 font-bold text-ink">{t("own.cancel")}</button>
      </div>

      {editing && (
        <div className="flex flex-col items-start gap-3">
          {editing.status !== "na" ? (
            <button type="button" onClick={() => { update((p) => setOwnTaskStatus(p, editing.id, "na"), true); onDone(); }} className="min-h-11 px-2 font-bold text-ink2 underline underline-offset-4">
              {t("markNa")}
            </button>
          ) : (
            <button type="button" onClick={() => { update((p) => setOwnTaskStatus(p, editing.id, "todo"), true); onDone(); }} className="min-h-11 px-2 font-bold text-ink2 underline underline-offset-4">
              {t("undoNa")}
            </button>
          )}
          {confirmDelete ? (
            <div role="alertdialog" aria-label={t("own.deleteConfirm")} className="flex flex-col gap-3 rounded-2xl border border-error p-4">
              <p>{t("own.deleteConfirm")}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => { update((p) => removeOwnTask(p, editing.id), true); onDone(); }} className="min-h-12 rounded-full border-2 border-error px-5 font-bold text-ink">
                  {t("own.deleteYes")}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="min-h-12 rounded-full bg-action px-6 font-bold text-on-action">{t("own.cancel")}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="min-h-11 px-2 font-bold text-ink2 underline underline-offset-4">
              {t("own.delete")}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
