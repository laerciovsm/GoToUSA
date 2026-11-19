"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch, authErrorKey, getAuthClient } from "@/lib/auth-client";
import { card, CheckField, type ErrorLike, Field, Notice, primaryButton, secondaryButton, secondaryLink, Shell, useQueryParam } from "./account-ui";

/**
 * /account/invite?id=…  Tela do link do convite (docs/backend-local.md, passo 4).
 * Quem não tem conta cria aqui (e-mail do convite travado), confirma o e-mail e volta para cá,
 * e o convite é aceito sozinho. Quem já tem conta entra e toca em "Aceitar convite".
 */

type Preview = { email: string; journeyName: string; inviterName: string; role: string; locale: string; inviteeName: string | null };
type SessionUser = { email: string; emailVerified: boolean };

type State =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ready"; preview: Preview; user: SessionUser | null }
  | { status: "accepted"; preview: Preview }
  | { status: "rejected" }
  | { status: "checkEmail" };

/** A conta logada é a do e-mail convidado? */
function isRecipient(user: SessionUser | null, preview: Preview): boolean {
  return Boolean(user && user.email.toLowerCase() === preview.email.toLowerCase());
}

async function loadInvite(id: string | null | undefined): Promise<State> {
  if (!id) return { status: "invalid" };
  const [{ data: preview }, session] = await Promise.all([
    apiFetch<Preview>(`/invitations/${encodeURIComponent(id)}`),
    getAuthClient().getSession().catch(() => ({ data: null })),
  ]);
  if (!preview) return { status: "invalid" };
  const u = session.data?.user;
  return { status: "ready", preview, user: u ? { email: u.email, emailVerified: u.emailVerified } : null };
}

export function InviteView() {
  const t = useTranslations("Account");
  const id = useQueryParam("id");
  const verified = useQueryParam("verified");
  const [state, setState] = useState<State>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => setState(await loadInvite(id)), [id]);

  const accept = useCallback(async (preview: Preview) => {
    if (!id) return;
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().organization.acceptInvitation({ invitationId: id });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setState({ status: "accepted", preview });
  }, [id]);

  useEffect(() => {
    if (id === undefined) return; // ainda gerando a página
    loadInvite(id).then(async (next) => {
      setState(next);
      // Voltou do link de confirmação do e-mail, já na conta certa: aceita sozinho.
      if (verified === "1" && next.status === "ready" && isRecipient(next.user, next.preview)) await accept(next.preview);
    });
  }, [id, verified, accept]);

  const reject = async () => {
    if (!id) return;
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().organization.rejectInvitation({ invitationId: id });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setState({ status: "rejected" });
  };

  const signOut = async () => {
    setBusy(true);
    await getAuthClient().signOut();
    setBusy(false);
    await load();
  };

  const roleLabel = (role: string) => t(`people.roles.${role === "admin" ? "admin" : "member"}`);

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">✉️ {t("invite.title")}</h1>

      {state.status === "loading" && <p className="text-ink2">{t("loading")}</p>}

      {state.status === "invalid" && (
        <section className={card}>
          <Notice errorKey="INVALID_INVITE" />
          <Link href="/account" className={secondaryLink}>{t("title")}</Link>
        </section>
      )}

      {state.status === "rejected" && (
        <section className={card}>
          <p>{t("invite.rejected")}</p>
          <Link href="/account" className={secondaryLink}>{t("title")}</Link>
        </section>
      )}

      {state.status === "checkEmail" && (
        <section className={card}>
          <p className="font-semibold">📬 {t("checkTitle")}</p>
          <p>{t("invite.checkEmail")}</p>
          <p className="text-sm text-ink2">{t("checkHint")}</p>
        </section>
      )}

      {state.status === "accepted" && (
        <section className={card}>
          <p className="rounded-xl bg-celebrate-soft p-3 font-semibold">🎉 {t("invite.accepted", { journey: state.preview.journeyName, role: roleLabel(state.preview.role) })}</p>
          <p className="text-ink2">{t("invite.afterAccept")}</p>
          <Link href="/account" className="flex min-h-12 items-center self-start rounded-full bg-action px-6 font-bold text-on-action">{t("title")}</Link>
        </section>
      )}

      {state.status === "ready" && (
        <>
          <section className={card}>
            <p>{t("invite.summary", { inviter: state.preview.inviterName, journey: state.preview.journeyName, role: roleLabel(state.preview.role) })}</p>
            <p className="text-sm text-ink2 break-all">{t("invite.forEmail", { email: state.preview.email })}</p>
            <p className="text-sm text-ink2">{t(`people.roleHint.${state.preview.role === "admin" ? "admin" : "member"}`)}</p>
          </section>

          {isRecipient(state.user, state.preview) ? (
            <section className={card}>
              <Notice errorKey={error} />
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={busy} onClick={() => accept(state.preview)} className={primaryButton}>{t("invite.accept")}</button>
                <button type="button" disabled={busy} onClick={reject} className={secondaryButton}>{t("invite.reject")}</button>
              </div>
            </section>
          ) : state.user ? (
            <section className={card}>
              <p>{t("invite.otherAccount", { email: state.user.email })}</p>
              <button type="button" disabled={busy} onClick={signOut} className={primaryButton}>{t("signOut")}</button>
            </section>
          ) : (
            <NoAccount invitationId={id ?? ""} preview={state.preview} onSignedIn={load} onSignedUp={() => setState({ status: "checkEmail" })} />
          )}
        </>
      )}
    </Shell>
  );
}

/** Sem sessão: criar a conta (padrão) ou entrar com a conta que já existe. */
function NoAccount({ invitationId, preview, onSignedIn, onSignedUp }: { invitationId: string; preview: Preview; onSignedIn: () => Promise<void>; onSignedUp: () => void }) {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [mode, setMode] = useState<"signUp" | "signIn">("signUp");
  const [name, setName] = useState(preview.inviteeName ?? "");
  const [password, setPassword] = useState("");
  const [legal, setLegal] = useState(false);
  const [data, setData] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().signUp.email({
      name: name.trim(),
      email: preview.email,
      password,
      locale,
      // O link de confirmação volta para esta tela, que aceita o convite sozinha.
      callbackURL: `/${locale}/account/invite?id=${encodeURIComponent(invitationId)}&verified=1`,
    });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    onSignedUp();
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().signIn.email({
      email: preview.email,
      password,
      callbackURL: `/${locale}/account/invite?id=${encodeURIComponent(invitationId)}&verified=1`,
    });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    await onSignedIn();
  };

  const tabClass = (active: boolean) =>
    `min-h-11 flex-1 rounded-full px-4 font-bold ${active ? "bg-primary text-on-primary" : "border-2 border-line text-ink"}`;

  return (
    <section className={card}>
      <div role="group" aria-label={t("invite.howTitle")} className="flex gap-2">
        <button type="button" aria-pressed={mode === "signUp"} onClick={() => { setMode("signUp"); setError(null); }} className={tabClass(mode === "signUp")}>{t("signUp")}</button>
        <button type="button" aria-pressed={mode === "signIn"} onClick={() => { setMode("signIn"); setError(null); }} className={tabClass(mode === "signIn")}>{t("invite.haveAccount")}</button>
      </div>

      {mode === "signUp" ? (
        <form onSubmit={signUp} className="flex flex-col gap-4">
          <Field label={t("name")} hint={t("nameHint")} type="text" value={name} onChange={setName} autoComplete="given-name" maxLength={80} />
          <Field label={t("email")} hint={t("invite.emailLocked")} type="email" value={preview.email} onChange={() => {}} autoComplete="email" readOnly />
          <Field label={t("password")} hint={t("passwordHint")} type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} maxLength={128} />
          <div className="flex flex-col gap-3 rounded-xl bg-celebrate-soft p-3 text-sm">
            <p>🔒 {t("dataNote")}</p>
            <CheckField label={t("invite.consentData")} checked={data} onChange={setData} />
            <CheckField label={t("invite.consentLegal")} checked={legal} onChange={setLegal} />
          </div>
          <Notice errorKey={error} />
          <button type="submit" disabled={busy || !legal || !data} className={primaryButton}>{t("invite.createAndJoin")}</button>
        </form>
      ) : (
        <form onSubmit={signIn} className="flex flex-col gap-4">
          <Field label={t("email")} type="email" value={preview.email} onChange={() => {}} autoComplete="email" readOnly />
          <Field label={t("password")} type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          <Notice errorKey={error} />
          <button type="submit" disabled={busy} className={primaryButton}>{t("signIn")}</button>
          <Link href="/account/forgot" className="flex min-h-11 items-center self-start font-bold text-primary underline underline-offset-4">{t("forgotLink")}</Link>
        </form>
      )}
    </section>
  );
}
