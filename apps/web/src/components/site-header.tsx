import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const t = useTranslations("Header");

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label={t("home")}>
          <span className="grid size-9 place-items-center rounded-xl bg-primary" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="var(--on-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18c3-6 7-9 16-12" />
              <path d="M14 5.5l6 .5-2.5 5.5" />
            </svg>
          </span>
          <span className="font-display text-xl font-semibold">GoToUSA</span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
