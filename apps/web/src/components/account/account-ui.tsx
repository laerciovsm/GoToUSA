"use client";

import { useId, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

/** Peças comuns das telas de conta e de jornada (docs/backend-local.md, passos 3 e 4). */

export const card = "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5";
export const primaryButton = "min-h-12 self-start rounded-full bg-action px-6 font-bold text-on-action disabled:opacity-50";
export const secondaryLink = "flex min-h-12 items-center self-start rounded-full border-2 border-primary px-5 font-bold text-primary";
export const textLink = "flex min-h-11 items-center self-start font-bold text-primary underline underline-offset-4";
export const fieldClass = "w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-ink focus:border-primary focus:outline-none";

export type ErrorLike = { code?: string; status?: number } | null | undefined;

export function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 pt-6 pb-28">{children}</main>;
}

export function Notice({ errorKey }: { errorKey: string | null }) {
  const t = useTranslations("Account.errors");
  if (!errorKey) return null;
  return <p role="alert" className="rounded-xl border border-error p-3">{t(errorKey)}</p>;
}

export function Field(props: { label: string; hint?: string; type: string; value: string; onChange: (v: string) => void; autoComplete: string; minLength?: number; maxLength?: number; required?: boolean; readOnly?: boolean }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">{props.label}</label>
      {props.hint && <p id={`${id}-hint`} className="text-sm text-ink2">{props.hint}</p>}
      <input
        id={id}
        type={props.type}
        required={props.required ?? true}
        readOnly={props.readOnly}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete={props.autoComplete}
        minLength={props.minLength}
        maxLength={props.maxLength}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        className={`${fieldClass}${props.readOnly ? " bg-bg text-ink2" : ""}`}
      />
    </div>
  );
}

/** Lista de opções com rótulo, no mesmo estilo dos campos. */
export function SelectField(props: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string; lang?: string }[] }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">{props.label}</label>
      <select id={id} required value={props.value} onChange={(e) => props.onChange(e.target.value)} className={`${fieldClass} min-h-12`}>
        {props.options.map((o) => (
          <option key={o.value} value={o.value} lang={o.lang}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** Caixa de marcar obrigatória (aceites), com área de toque grande. */
export function CheckField(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" required checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} className="mt-1 size-6 shrink-0 accent-primary" />
      <label htmlFor={id} className="min-h-11">{props.label}</label>
    </div>
  );
}

/** Botão secundário (contorno), para ações que não são a principal. */
export const secondaryButton = "min-h-12 self-start rounded-full border-2 border-line px-5 font-bold text-ink disabled:opacity-50";

/**
 * Copia um texto. Sem HTTPS (rede de casa) o navegador não libera a área de transferência moderna;
 * nesse caso usa o jeito antigo. Devolve se deu certo (senão a pessoa copia do campo à mão).
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // tenta o jeito antigo abaixo
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

export const noSubscribe = () => () => {};

/** Lê um parâmetro da URL no navegador, sem Suspense (undefined na geração da página). */
export function useQueryParam(name: string): string | null | undefined {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => undefined,
  );
}
