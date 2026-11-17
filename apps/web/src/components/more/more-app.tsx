"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  backupFileName,
  createBackup,
  parseBackup,
  type BackupError,
  type JourneyProgress,
  type ParsedBackup,
  type QuestionnaireData,
} from "@gotousa/shared";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { browserJourneyRepository as progressRepo } from "@/lib/storage/journey-repository";
import { browserQuestionnaireRepository as questionnaireRepo } from "@/lib/storage/questionnaire-repository";
import {
  getDisclaimerServerSnapshot,
  getDisclaimerSnapshot,
  parseDisclaimer,
  subscribeDisclaimer,
} from "@/lib/disclaimer-store";

type Loaded = { status: "loading" } | { status: "ready"; questionnaire: QuestionnaireData | undefined; progress: JourneyProgress | undefined; unreadable: boolean };

const card = "flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5";
const primaryButton = "min-h-12 self-start rounded-full bg-action px-6 font-bold text-on-action disabled:opacity-50";
const secondaryButton = "min-h-12 self-start rounded-full border-2 border-primary px-5 font-bold text-primary";
const fieldClass = "w-full max-w-56 rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-ink focus:border-primary focus:outline-none";

/** Aba "Mais" (docs/telas.md): seus dados (baixar e importar), ajustes, questionário, idioma e aviso legal. */
export function MoreApp() {
  const t = useTranslations("More");
  const td = useTranslations("Disclaimer");
  const format = useFormatter();
  const fileInput = useRef<HTMLInputElement>(null);
  const ids = { arrival: useId(), discovery: useId() };
  const [loaded, setLoaded] = useState<Loaded>({ status: "loading" });
  const [preview, setPreview] = useState<ParsedBackup | null>(null);
  const [importError, setImportError] = useState<BackupError | "read" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const disclaimer = parseDisclaimer(useSyncExternalStore(subscribeDisclaimer, getDisclaimerSnapshot, getDisclaimerServerSnapshot));

  useEffect(() => {
    let active = true;
    // Cada parte é lida separadamente: um dado ilegível não impede importar um arquivo bom.
    Promise.allSettled([questionnaireRepo.load(), progressRepo.load()]).then(([q, p]) => {
      if (!active) return;
      setLoaded({
        status: "ready",
        questionnaire: q.status === "fulfilled" ? q.value : undefined,
        progress: p.status === "fulfilled" ? p.value : undefined,
        unreadable: q.status === "rejected" || p.status === "rejected",
      });
    });
    return () => {
      active = false;
    };
  }, []);

  if (loaded.status === "loading") return <Shell><p className="text-ink2">{t("loading")}</p></Shell>;
  const { questionnaire, progress } = loaded;

  const download = () => {
    if (!questionnaire) return;
    const blob = new Blob([JSON.stringify(createBackup(questionnaire, progress ?? null), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(t("downloaded"));
  };

  const pickFile = async (file: File | undefined) => {
    setImportError(null);
    setPreview(null);
    setMessage(null);
    if (!file) return;
    let text: string;
    try {
      text = await file.text();
    } catch {
      setImportError("read");
      return;
    }
    const result = parseBackup(text);
    if (result.ok) setPreview(result.backup);
    else setImportError(result.error);
    if (fileInput.current) fileInput.current.value = "";
  };

  const confirmImport = async () => {
    if (!preview) return;
    try {
      await questionnaireRepo.save(preview.questionnaire);
      if (preview.progress) await progressRepo.save(preview.progress);
      window.location.assign(window.location.pathname.replace(/\/more$/, "/today"));
    } catch {
      setImportError("read");
    }
  };

  const saveProgress = (next: JourneyProgress) => {
    setLoaded({ ...loaded, progress: next });
    progressRepo.save(next).catch(() => setMessage(t("saveError")));
  };

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{t("title")}</h1>

      {/* Seus dados: baixar e importar */}
      <section className={card}>
        <h2 className="text-xl font-semibold">💾 {t("dataTitle")}</h2>
        <p className="text-ink2">{t("dataIntro")}</p>
        {loaded.unreadable && <p role="alert" className="rounded-xl border border-error p-3">{t("unreadable")}</p>}

        <h3 className="pt-2 font-semibold">{t("downloadTitle")}</h3>
        <p className="text-sm text-ink2">{t("downloadBody")}</p>
        <button type="button" onClick={download} disabled={!questionnaire} className={primaryButton}>
          ⬇ {t("download")}
        </button>
        {!questionnaire && <p className="text-sm text-ink2">{t("nothingToDownload")}</p>}
        <p className="rounded-xl bg-celebrate-soft p-3 text-sm">🔒 {t("privacy")}</p>

        <h3 className="pt-2 font-semibold">{t("importTitle")}</h3>
        <p className="text-sm text-ink2">{t("importBody")}</p>
        <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileInput.current?.click()} className={secondaryButton}>
          ⬆ {t("import")}
        </button>
        {importError && <p role="alert" className="rounded-xl border border-error p-3">{t(`importError.${importError}`)}</p>}
        {preview && (
          <div role="alertdialog" aria-labelledby="import-title" className="flex flex-col gap-3 rounded-2xl border-2 border-primary p-4">
            <h4 id="import-title" className="font-semibold">{t("previewTitle")}</h4>
            <ul className="flex list-disc flex-col gap-1 ps-6 text-ink2">
              <li>{t("previewDate", { date: format.dateTime(new Date(preview.exportedAt), { dateStyle: "medium", timeStyle: "short" }) })}</li>
              <li>{t("previewPeople", { n: preview.questionnaire.people.length })}</li>
              <li>{t("previewDone", { n: preview.progress ? Object.values(preview.progress.tasks).filter((x) => x.status === "done").length + preview.progress.ownTasks.filter((x) => x.status === "done").length : 0 })}</li>
            </ul>
            <p className="font-semibold">{questionnaire ? t("previewReplace") : t("previewNew")}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={confirmImport} className={primaryButton}>{t("confirmImport")}</button>
              <button type="button" onClick={() => setPreview(null)} className="min-h-12 rounded-full border-2 border-line px-5 font-bold text-ink">{t("cancel")}</button>
            </div>
          </div>
        )}
        {message && <p aria-live="polite" className="text-sm font-semibold text-done">✓ {message}</p>}
      </section>

      {/* Ajustes da jornada */}
      {progress && (
        <section className={card}>
          <h2 className="text-xl font-semibold">⚙️ {t("adjustTitle")}</h2>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{t("goal")}</span>
            <p className="text-sm text-ink2">{t("goalHint")}</p>
            <Link href="/questionnaire?block=goal" className="flex min-h-11 items-center self-start font-bold text-primary underline underline-offset-4">{t("changeGoal")}</Link>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={ids.arrival} className="font-semibold">{t("arrival")}</label>
            <p className="text-sm text-ink2">{t("arrivalHint")}</p>
            <input id={ids.arrival} type="date" value={progress.arrivalDate ?? ""} onChange={(e) => saveProgress({ ...progress, arrivalDate: e.target.value || null })} className={fieldClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={ids.discovery} className="font-semibold">{t("discovery")}</label>
            <p className="text-sm text-ink2">{t("discoveryHint")}</p>
            <input id={ids.discovery} type="date" value={progress.discoveryDue ?? ""} onChange={(e) => saveProgress({ ...progress, discoveryDue: e.target.value || null })} className={fieldClass} />
          </div>
        </section>
      )}

      {/* Questionário */}
      <section className={card}>
        <h2 className="text-xl font-semibold">📝 {t("questionnaireTitle")}</h2>
        <p className="text-ink2">{t("questionnaireBody")}</p>
        <Link href="/questionnaire" className="flex min-h-12 items-center self-start rounded-full border-2 border-primary px-5 font-bold text-primary">{t("questionnaireAction")}</Link>
      </section>

      {/* Idioma */}
      <section className={card}>
        <h2 className="text-xl font-semibold">🌐 {t("languageTitle")}</h2>
        <LanguageSwitcher />
      </section>

      {/* Aviso legal */}
      <section className={card}>
        <h2 className="text-xl font-semibold">⚖️ {td("title")}</h2>
        <div className="flex flex-col gap-2 text-ink2">
          <p>{td("body1")}</p>
          <p>{td("body2")}</p>
          <p>{td("body3")}</p>
        </div>
        {disclaimer && (
          <p className="text-sm text-ink2">✓ {td("acceptedOn", { date: format.dateTime(new Date(disclaimer.acceptedAt), { dateStyle: "medium" }) })}</p>
        )}
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-6 pb-28">{children}</main>;
}
