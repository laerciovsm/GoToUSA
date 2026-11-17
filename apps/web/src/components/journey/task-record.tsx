"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import {
  documentKey,
  type AgreementRecord,
  type DocumentState,
  type DocumentsRecord,
  type JourneyTask,
  type RecordSpec,
  type TaskRecord,
} from "@gotousa/shared";
import type { JourneyContent } from "@/lib/journey/content";
import type { JourneyState } from "./use-journey";
import { useJourneyText } from "./use-journey-text";

type Ready = Extract<JourneyState, { status: "ready" }>;
type Props = {
  content: JourneyContent;
  state: Ready;
  task: JourneyTask;
  spec: RecordSpec;
  record: TaskRecord;
  documentsText: Record<string, string>;
  onChange: (record: TaskRecord) => void;
};

const fieldClass = "w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-ink focus:border-primary focus:outline-none";
const chip = (selected: boolean) =>
  `min-h-11 rounded-full border-2 px-4 font-bold ${selected ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink"}`;

/**
 * Seção "Registro" da tarefa (decisão de 17/11/2026): anotar o combinado e a situação dos documentos.
 * Nunca recebe arquivos nem números de documentos.
 */
export function TaskRecordSection(props: Props) {
  const t = useTranslations("Journey.record");
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-ink2">{t(`intro.${props.spec.type}`)}</p>
      </div>
      {props.record.type === "agreement" && <Agreement {...props} record={props.record} />}
      {props.record.type === "documents" && <Documents {...props} record={props.record} />}
      {props.record.type === "notes" && (
        <textarea
          aria-label={t("title")}
          rows={4}
          maxLength={10000}
          value={props.record.text}
          onChange={(e) => props.onChange({ type: "notes", text: e.target.value })}
          className={fieldClass}
        />
      )}
    </section>
  );
}

function Agreement({ content, state, record, onChange }: Props & { record: AgreementRecord }) {
  const t = useTranslations("Journey.record");
  const { personName } = useJourneyText(content, state.data);
  const dateId = useId();
  const decidedId = useId();
  const nextId = useId();
  const set = (fields: Partial<AgreementRecord>) => onChange({ ...record, ...fields });

  return (
    <>
      <div className="flex flex-col gap-1">
        <label htmlFor={dateId} className="font-semibold">{t("date")}</label>
        <input id={dateId} type="date" value={record.date} onChange={(e) => set({ date: e.target.value })} className={`${fieldClass} max-w-56`} />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">{t("people")}</legend>
        <div className="flex flex-wrap gap-2">
          {state.data.people.map((p) => {
            const selected = record.people.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={selected}
                onClick={() => set({ people: selected ? record.people.filter((x) => x !== p.id) : [...record.people, p.id] })}
                className={chip(selected)}
              >
                {selected && <span aria-hidden="true">✓ </span>}
                {personName(p.id)}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1">
        <label htmlFor={decidedId} className="font-semibold">{t("decided")}</label>
        <textarea id={decidedId} rows={3} maxLength={5000} value={record.decided} onChange={(e) => set({ decided: e.target.value })} className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={nextId} className="font-semibold">{t("nextSteps")}</label>
        <textarea id={nextId} rows={3} maxLength={5000} value={record.nextSteps} onChange={(e) => set({ nextSteps: e.target.value })} className={fieldClass} />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">{t("agreed")}</legend>
        <div className="flex flex-wrap gap-2">
          {(["yes", "partly", "not_yet"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={record.agreed === v} onClick={() => set({ agreed: record.agreed === v ? "" : v })} className={chip(record.agreed === v)}>
              {t(`agreedOptions.${v}`)}
            </button>
          ))}
        </div>
      </fieldset>
    </>
  );
}

function Documents({ content, state, task, spec, record, documentsText, onChange }: Props & { record: DocumentsRecord }) {
  const t = useTranslations("Journey.record");
  const { personName } = useJourneyText(content, state.data);
  const documents = spec.type === "documents" ? spec.documents : [];
  // Tarefa por pessoa: só os documentos dela. Tarefa da família: de cada pessoa.
  const people = task.personId ? [task.personId] : state.data.people.map((p) => p.id);

  const setItem = (key: string, fields: Partial<DocumentsRecord["items"][string]>) => {
    const current = record.items[key] ?? { state: "" as DocumentState, validUntil: "", note: "" };
    onChange({ ...record, items: { ...record.items, [key]: { ...current, ...fields } } });
  };

  return (
    <>
      <p className="rounded-xl bg-celebrate-soft p-3 text-sm font-semibold">🔒 {t("noNumbers")}</p>
      {documents.flatMap((docId) =>
        people.map((personId) => {
          const key = documentKey(docId, personId);
          const item = record.items[key] ?? { state: "", validUntil: "", note: "" };
          const title = task.personId ? documentsText[docId] : `${documentsText[docId]} · ${personName(personId)}`;
          return (
            <DocumentItem
              key={key}
              title={title ?? docId}
              item={item}
              onState={(s) => setItem(key, { state: item.state === s ? "" : s })}
              onValid={(v) => setItem(key, { validUntil: v })}
              onNote={(v) => setItem(key, { note: v })}
            />
          );
        }),
      )}
    </>
  );
}

function DocumentItem({
  title,
  item,
  onState,
  onValid,
  onNote,
}: {
  title: string;
  item: DocumentsRecord["items"][string];
  onState: (s: DocumentState) => void;
  onValid: (v: string) => void;
  onNote: (v: string) => void;
}) {
  const t = useTranslations("Journey.record");
  const validId = useId();
  const noteId = useId();
  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-line p-3">
      <legend className="px-1 font-semibold">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {(["have", "requested", "missing"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={item.state === s} onClick={() => onState(s)} className={chip(item.state === s)}>
            {t(`docState.${s}`)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={validId} className="text-sm font-semibold">{t("validUntil")}</label>
        <input id={validId} type="month" value={item.validUntil} onChange={(e) => onValid(e.target.value)} className={`${fieldClass} max-w-56`} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={noteId} className="text-sm font-semibold">{t("docNote")}</label>
        <input id={noteId} type="text" maxLength={500} value={item.note} onChange={(e) => onNote(e.target.value)} className={fieldClass} />
      </div>
    </fieldset>
  );
}
