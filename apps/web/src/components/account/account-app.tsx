"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { authErrorKey, getAuthClient } from "@/lib/auth-client";
import { card, type ErrorLike, Field, Notice, primaryButton, secondaryLink, Shell, textLink, useQueryParam } from "./account-ui";
import { JourneyPeople } from "./journey-people";

/** Telas de conta (docs/backend-local.md, passos 3 e 4). A jornada continua no navegador até o passo 5. */

type User = { name: string; email: string };

/** /account: situação da conta (entrar e criar conta, ou nome, sair e apagar). */
export function AccountHome() {
  const t = useTranslations("Account");
  const verified = useQueryParam("verified");
  const [state, setState] = useState<{ status: "loading" } | { status: "out" } | { status: "in"; user: User }>({ status: "loading" });
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAuthClient()
      .getSession()
      .then(({ data }) => setState(data?.user ? { status: "in", user: { name: data.user.name, email: data.user.email } } : { status: "out" }))
      .catch(() => setState({ status: "out" }));
  }, []);

  const signOut = async () => {
    setBusy(true);
    await getAuthClient().signOut();
    setBusy(false);
    setMessage(t("signedOut"));
    setState({ status: "out" });
  };

  const deleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().deleteUser({ password });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setPassword("");
    setDeleting(false);
    setMessage(t("deleted"));
    setState({ status: "out" });
  };

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      {verified === "1" && state.status === "in" && <p className="rounded-xl bg-celebrate-soft p-3 font-semibold">🎉 {t("verified")}</p>}
      {message && <p aria-live="polite" className="font-semibold text-done">✓ {message}</p>}

      {state.status === "loading" && <p className="text-ink2">{t("loading")}</p>}

      {state.status === "out" && (
        <section className={card}>
          <p className="text-ink2">{t("intro")}</p>
          <Link href="/account/sign-in" className="flex min-h-12 items-center self-start rounded-full bg-action px-6 font-bold text-on-action">{t("signIn")}</Link>
          <Link href="/account/sign-up" className={secondaryLink}>{t("signUp")}</Link>
          <p className="text-sm text-ink2">{t("journeyStays")}</p>
        </section>
      )}

      {state.status === "in" && (
        <>
          <section className={card}>
            <p>{t("signedInAs", { name: state.user.name })}</p>
            <p className="text-ink2">{state.user.email}</p>
            <p className="text-sm text-ink2">{t("journeyStays")}</p>
            <button type="button" onClick={signOut} disabled={busy} className={primaryButton}>{t("signOut")}</button>
          </section>

          <JourneyPeople userName={state.user.name} />

          <section className={card}>
            <h2 className="text-xl font-semibold">{t("deleteTitle")}</h2>
            <p className="text-ink2">{t("deleteBody")}</p>
            {!deleting ? (
              <button type="button" onClick={() => setDeleting(true)} className="min-h-12 self-start rounded-full border-2 border-line px-5 font-bold text-ink">{t("deleteStart")}</button>
            ) : (
              <form onSubmit={deleteAccount} className="flex flex-col gap-4">
                <Field label={t("password")} hint={t("deleteConfirmHint")} type="password" value={password} onChange={setPassword} autoComplete="current-password" />
                <Notice errorKey={error} />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={busy} className={primaryButton}>{t("deleteConfirm")}</button>
                  <button type="button" onClick={() => { setDeleting(false); setError(null); }} className="min-h-12 rounded-full border-2 border-line px-5 font-bold text-ink">{t("cancel")}</button>
                </div>
              </form>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}

/** /account/sign-in */
export function SignInView() {
  const t = useTranslations("Account");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().signIn.email({ email, password });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    router.push("/account");
  };

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("signInTitle")}</h1>
      <form onSubmit={submit} className={card}>
        <Field label={t("email")} type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label={t("password")} type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <Notice errorKey={error} />
        <button type="submit" disabled={busy} className={primaryButton}>{t("signIn")}</button>
        <Link href="/account/forgot" className={textLink}>{t("forgotLink")}</Link>
        <Link href="/account/sign-up" className={textLink}>{t("noAccount")}</Link>
      </form>
    </Shell>
  );
}

/** /account/sign-up */
export function SignUpView() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().signUp.email({
      name: name.trim(),
      email,
      password,
      locale,
      callbackURL: `/${locale}/account?verified=1`,
    });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    router.push("/account/check-email");
  };

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("signUpTitle")}</h1>
      <form onSubmit={submit} className={card}>
        <Field label={t("name")} hint={t("nameHint")} type="text" value={name} onChange={setName} autoComplete="given-name" maxLength={80} />
        <Field label={t("email")} type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label={t("password")} hint={t("passwordHint")} type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} maxLength={128} />
        <div className="flex flex-col gap-2 rounded-xl bg-celebrate-soft p-3 text-sm">
          <p>🔒 {t("dataNote")}</p>
          <p>⚖️ {t("legalNote")}</p>
        </div>
        <Notice errorKey={error} />
        <button type="submit" disabled={busy} className={primaryButton}>{t("signUp")}</button>
        <Link href="/account/sign-in" className={textLink}>{t("haveAccount")}</Link>
      </form>
    </Shell>
  );
}

/** /account/check-email: mesma mensagem para qualquer e-mail (não revela se já existe conta). */
export function CheckEmailView() {
  const t = useTranslations("Account");
  return (
    <Shell>
      <h1 className="text-3xl font-semibold">📬 {t("checkTitle")}</h1>
      <section className={card}>
        <p>{t("checkBody")}</p>
        <p className="text-sm text-ink2">{t("checkHint")}</p>
        <Link href="/account/sign-in" className={secondaryLink}>{t("signIn")}</Link>
      </section>
    </Shell>
  );
}

/** /account/forgot */
export function ForgotView() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().requestPasswordReset({ email, redirectTo: `/${locale}/account/reset` });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setSent(true);
  };

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("forgotTitle")}</h1>
      {sent ? (
        <section className={card}>
          <p>📬 {t("forgotSent")}</p>
          <p className="text-sm text-ink2">{t("checkHint")}</p>
          <Link href="/account/sign-in" className={secondaryLink}>{t("signIn")}</Link>
        </section>
      ) : (
        <form onSubmit={submit} className={card}>
          <p className="text-ink2">{t("forgotBody")}</p>
          <Field label={t("email")} type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Notice errorKey={error} />
          <button type="submit" disabled={busy} className={primaryButton}>{t("forgotSend")}</button>
        </form>
      )}
    </Shell>
  );
}

/** /account/reset?token=…  (o link do e-mail chega aqui; link vencido chega com ?error=INVALID_TOKEN) */
export function ResetView() {
  const t = useTranslations("Account");
  const token = useQueryParam("token");
  const linkError = useQueryParam("error");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    const { error: err } = await getAuthClient().resetPassword({ newPassword: password, token });
    setBusy(false);
    if (err) return setError(authErrorKey(err as ErrorLike));
    setDone(true);
  };

  const invalid = token === null || Boolean(linkError);

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("resetTitle")}</h1>
      {done ? (
        <section className={card}>
          <p className="font-semibold text-done">✓ {t("resetDone")}</p>
          <Link href="/account/sign-in" className="flex min-h-12 items-center self-start rounded-full bg-action px-6 font-bold text-on-action">{t("signIn")}</Link>
        </section>
      ) : invalid ? (
        <section className={card}>
          <Notice errorKey="INVALID_TOKEN" />
          <Link href="/account/forgot" className={secondaryLink}>{t("forgotSend")}</Link>
        </section>
      ) : (
        <form onSubmit={submit} className={card}>
          <Field label={t("newPassword")} hint={t("passwordHint")} type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} maxLength={128} />
          <p className="text-sm text-ink2">{t("resetNote")}</p>
          <Notice errorKey={error} />
          <button type="submit" disabled={busy || !token} className={primaryButton}>{t("resetSave")}</button>
        </form>
      )}
    </Shell>
  );
}
