"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { canExecute, LOCALES, uuid, type Person, type QuestionnaireData } from "@gotousa/shared";
import { LANGUAGE_NAMES } from "@/components/language-switcher";
import { usePersonLabel } from "@/components/questionnaire/use-person-label";
import { apiFetch, authErrorKey, getAuthClient } from "@/lib/auth-client";
import { browserQuestionnaireRepository } from "@/lib/storage/questionnaire-repository";
import { card, copyText, type ErrorLike, Field, fieldClass, Notice, primaryButton, secondaryButton, SelectField } from "./account-ui";

/**
 * Jornada da família na conta e as pessoas dela (docs/backend-local.md, passo 4).
 * Os dados da jornada (questionário e progresso) ainda ficam no navegador: vão para o servidor no passo 5.
 */

type Member = { id: string; name: string; email: string; role: string; personId: string | null; isMe: boolean };
type Invitation = { id: string; email: string; role: string; personId: string; inviteeName: string | null; locale: string; expiresAt: string; url: string };
type JourneyResponse = {
  canCreate: boolean;
  journey: null | { id: string; name: string; role: string; members: Member[]; invitations: Invitation[] };
};

const MANAGERS = new Set(["owner", "admin"]);

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; data: JourneyResponse };

async function fetchJourney(): Promise<LoadState> {
  const { data } = await apiFetch<JourneyResponse>("/journey");
  return data ? { status: "ready", data } : { status: "error" };
}

export function JourneyPeople({ userName }: { userName: string }) {
  const t = useTranslations("Account.people");
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | undefined>(undefined);

  const reload = useCallback(async () => setState(await fetchJourney()), []);

  useEffect(() => {
    fetchJourney().then(setState);
    // O questionário fica no navegador; sem ele, não dá para escolher a pessoa da família.
    browserQuestionnaireRepository.load().then(setQuestionnaire).catch(() => setQuestionnaire(undefined));
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "error") {
    return (
      <section className={card}>
        <h2 className="text-xl font-semibold">👨‍👩‍👧 {t("title")}</h2>
        <Notice errorKey="generic" />
      </section>
    );
  }

  const { data } = state;
  if (!data.journey) {
    return data.canCreate ? <CreateJourney userName={userName} onDone={reload} /> : (
      <section className={card}>
        <h2 className="text-xl font-semibold">👨‍👩‍👧 {t("title")}</h2>
        <p className="text-ink2">{t("noJourney")}</p>
      </section>
    );
  }

  return <JourneyDetails journey={data.journey} questionnaire={questionnaire} onChange={reload} />;
}

function CreateJourney({ userName, onDone }: { userName: string; onDone: () => Promise<void> }) {
  const t = useTranslations("Account.people");
  const [name, setName] = useState(() => t("defaultName", { name: userName }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().organization.create({ name: name.trim(), slug: uuid() });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    await onDone();
  };

  return (
    <form onSubmit={submit} className={card}>
      <h2 className="text-xl font-semibold">👨‍👩‍👧 {t("createTitle")}</h2>
      <p className="text-ink2">{t("createBody")}</p>
      <Field label={t("journeyName")} type="text" value={name} onChange={setName} autoComplete="off" maxLength={80} />
      <Notice errorKey={error} />
      <button type="submit" disabled={busy} className={primaryButton}>{t("createAction")}</button>
    </form>
  );
}

type Journey = NonNullable<JourneyResponse["journey"]>;

function JourneyDetails({ journey, questionnaire, onChange }: { journey: Journey; questionnaire: QuestionnaireData | undefined; onChange: () => Promise<void> }) {
  const t = useTranslations("Account.people");
  const format = useFormatter();
  const manager = MANAGERS.has(journey.role);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const labelOf = usePeopleLabels(questionnaire);

  /** Executa uma ação e recarrega a lista; mostra o erro traduzido, se houver. */
  const run = async (action: () => Promise<{ error: unknown }>, done?: string) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    const { error: err } = await action();
    setBusy(false);
    setConfirming(null);
    if (err) return setError(authErrorKey(err as ErrorLike));
    if (done) setMessage(done);
    await onChange();
  };

  const org = getAuthClient().organization;
  const roleLabel = (role: string) => t(`roles.${role === "owner" || role === "admin" ? role : "member"}`);

  const copy = async (url: string) => {
    setMessage((await copyText(url)) ? t("linkCopied") : t("copyManually"));
  };

  return (
    <>
      <section className={card} aria-labelledby="journey-people-title">
        <h2 id="journey-people-title" className="text-xl font-semibold">👨‍👩‍👧 {t("title")}</h2>
        <p><span className="font-semibold">{journey.name}</span></p>
        <p className="text-ink2">{t("yourRole", { role: roleLabel(journey.role) })}</p>
        <p className="text-sm text-ink2">{t("dataStays")}</p>
        {message && <p aria-live="polite" className="font-semibold text-done">✓ {message}</p>}
        <Notice errorKey={error} />

        <ul className="flex flex-col gap-3">
          {journey.members.map((m) => {
            const person = m.role === "owner" ? labelOf.self() : m.personId ? labelOf.byId(m.personId) : null;
            const canManage = manager && !m.isMe && m.role !== "owner";
            return (
              <li key={m.id} className="flex flex-col gap-2 rounded-xl border border-line p-3">
                <p className="font-semibold">{m.isMe ? t("you", { name: m.name }) : m.name}</p>
                <p className="text-sm text-ink2 break-all">{m.email}</p>
                <p className="text-sm">{roleLabel(m.role)}{person ? ` · ${person}` : ""}</p>
                {canManage && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      className={secondaryButton}
                      onClick={() => run(() => org.updateMemberRole({ memberId: m.id, role: m.role === "admin" ? "member" : "admin", organizationId: journey.id }))}
                    >
                      {m.role === "admin" ? t("makeMember") : t("makeAdmin")}
                    </button>
                    {confirming === `remove:${m.id}` ? (
                      <button type="button" disabled={busy} className={primaryButton} onClick={() => run(() => org.removeMember({ memberIdOrEmail: m.id, organizationId: journey.id }), t("removed"))}>
                        {t("removeConfirm", { name: m.name })}
                      </button>
                    ) : (
                      <button type="button" disabled={busy} className={secondaryButton} onClick={() => setConfirming(`remove:${m.id}`)}>{t("remove")}</button>
                    )}
                  </div>
                )}
                {m.isMe && m.role !== "owner" && (
                  confirming === "leave" ? (
                    <button type="button" disabled={busy} className={primaryButton} onClick={() => run(() => org.leave({ organizationId: journey.id }), t("left"))}>{t("leaveConfirm")}</button>
                  ) : (
                    <button type="button" disabled={busy} className={secondaryButton} onClick={() => setConfirming("leave")}>{t("leave")}</button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {manager && journey.invitations.length > 0 && (
        <section className={card} aria-labelledby="journey-invites-title">
          <h2 id="journey-invites-title" className="text-xl font-semibold">✉️ {t("pendingTitle")}</h2>
          <ul className="flex flex-col gap-3">
            {journey.invitations.map((i) => {
              const person = labelOf.byId(i.personId);
              return (
                <li key={i.id} className="flex flex-col gap-2 rounded-xl border border-line p-3">
                  <p className="font-semibold break-all">{i.inviteeName ? `${i.inviteeName} · ${i.email}` : i.email}</p>
                  <p className="text-sm">{roleLabel(i.role)}{person ? ` · ${person}` : ""}</p>
                  <p className="text-sm text-ink2">{t("validUntil", { date: format.dateTime(new Date(i.expiresAt), { dateStyle: "medium" }) })}</p>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-ink2">{t("inviteLink")}</span>
                    <input readOnly value={i.url} onFocus={(e) => e.currentTarget.select()} className={`${fieldClass} text-sm`} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={primaryButton} onClick={() => copy(i.url)}>{t("copyLink")}</button>
                    <button
                      type="button"
                      disabled={busy}
                      className={secondaryButton}
                      onClick={() => run(() => org.inviteMember({ email: i.email, role: i.role === "admin" ? "admin" : "member", organizationId: journey.id, resend: true, personId: i.personId, locale: i.locale, inviteeName: i.inviteeName ?? undefined }), t("resent"))}
                    >
                      {t("resend")}
                    </button>
                    {confirming === `cancel:${i.id}` ? (
                      <button type="button" disabled={busy} className={primaryButton} onClick={() => run(() => org.cancelInvitation({ invitationId: i.id }), t("canceled"))}>{t("cancelConfirm")}</button>
                    ) : (
                      <button type="button" disabled={busy} className={secondaryButton} onClick={() => setConfirming(`cancel:${i.id}`)}>{t("cancelInvite")}</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {manager && <InviteForm journey={journey} questionnaire={questionnaire} onDone={onChange} />}
      {journey.role === "owner" && <DeleteJourney name={journey.name} onDone={onChange} />}
    </>
  );
}

/** Rótulo das pessoas do questionário deste navegador ("Cônjuge", apelido do filho etc.). */
function usePeopleLabels(questionnaire: QuestionnaireData | undefined) {
  const label = usePersonLabel(questionnaire ?? EMPTY_DATA);
  return useMemo(
    () => ({
      byId: (id: string) => {
        const p = questionnaire?.people.find((x) => x.id === id);
        return p ? label(p) : null;
      },
      self: () => {
        const p = questionnaire?.people.find((x) => x.kind === "self");
        return p ? label(p) : null;
      },
    }),
    [questionnaire, label],
  );
}

const EMPTY_DATA = { people: [] } as unknown as QuestionnaireData;

function InviteForm({ journey, questionnaire, onDone }: { journey: Journey; questionnaire: QuestionnaireData | undefined; onDone: () => Promise<void> }) {
  const t = useTranslations("Account.people");
  const locale = useLocale();
  const personLabel = usePersonLabel(questionnaire ?? EMPTY_DATA);

  // Quem pode receber convite: adultos que executam tarefas, menos "você" e quem já tem conta ou convite.
  const options = useMemo<Person[]>(() => {
    if (!questionnaire) return [];
    const used = new Set([...journey.members.map((m) => m.personId), ...journey.invitations.map((i) => i.personId)]);
    const now = new Date();
    return questionnaire.people.filter((p) => p.kind !== "self" && !used.has(p.id) && canExecute(questionnaire, p, now));
  }, [questionnaire, journey]);

  const [personId, setPersonId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [emailLocale, setEmailLocale] = useState(locale);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const selected = options.find((p) => p.id === personId) ?? options[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError(null);
    setSent(null);
    const { error: err } = await getAuthClient().organization.inviteMember({
      email: email.trim(),
      role,
      organizationId: journey.id,
      personId: selected.id,
      locale: emailLocale,
      inviteeName: name.trim() || undefined,
    });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setSent(email.trim());
    setName("");
    setEmail("");
    setPersonId("");
    await onDone();
  };

  return (
    <section className={card} aria-labelledby="journey-invite-title">
      <h2 id="journey-invite-title" className="text-xl font-semibold">➕ {t("inviteTitle")}</h2>
      {sent && <p aria-live="polite" className="font-semibold text-done">✓ {t("inviteSent", { email: sent })}</p>}
      {!questionnaire ? (
        <p className="text-ink2">{t("needQuestionnaire")}</p>
      ) : options.length === 0 ? (
        <p className="text-ink2">{t("nobodyToInvite")}</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <p className="text-ink2">{t("inviteBody")}</p>
          <SelectField
            label={t("person")}
            value={selected?.id ?? ""}
            onChange={setPersonId}
            options={options.map((p) => ({ value: p.id, label: personLabel(p) }))}
          />
          <Field label={t("inviteeName")} hint={t("inviteeNameHint")} type="text" value={name} onChange={setName} autoComplete="off" maxLength={80} required={false} />
          <Field label={t("inviteeEmail")} type="email" value={email} onChange={setEmail} autoComplete="off" />
          <fieldset className="flex flex-col gap-2">
            <legend className="font-semibold">{t("role")}</legend>
            {(["member", "admin"] as const).map((r) => (
              <label key={r} className="flex min-h-11 items-start gap-3">
                <input type="radio" name="invite-role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-1 size-5 shrink-0 accent-primary" />
                <span>
                  <span className="font-semibold">{t(`roles.${r}`)}</span>
                  <span className="block text-sm text-ink2">{t(`roleHint.${r}`)}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <SelectField
            label={t("emailLanguage")}
            value={emailLocale}
            onChange={setEmailLocale}
            options={LOCALES.map((code) => ({ value: code, label: LANGUAGE_NAMES[code], lang: code }))}
          />
          <p className="text-sm text-ink2">{t("inviteNote")}</p>
          <Notice errorKey={error} />
          <button type="submit" disabled={busy} className={primaryButton}>{t("inviteAction")}</button>
        </form>
      )}
    </section>
  );
}

function DeleteJourney({ name, onDone }: { name: string; onDone: () => Promise<void> }) {
  const t = useTranslations("Account");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await apiFetch<{ deleted: true }>("/journey/delete", { method: "POST", body: JSON.stringify({ password }) });
    setBusy(false);
    if (err) return setError(authErrorKey(err));
    setPassword("");
    setOpen(false);
    await onDone();
  };

  return (
    <section className={card}>
      <h2 className="text-xl font-semibold">{t("people.deleteTitle")}</h2>
      <p className="text-ink2">{t("people.deleteBody", { name })}</p>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={secondaryButton}>{t("people.deleteStart")}</button>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label={t("password")} hint={t("deleteConfirmHint")} type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          <Notice errorKey={error} />
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className={primaryButton}>{t("people.deleteConfirm")}</button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className={secondaryButton}>{t("cancel")}</button>
          </div>
        </form>
      )}
    </section>
  );
}
