"use client";

import { useId, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, type Locale } from "@gotousa/shared";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Nome de cada idioma escrito no próprio idioma, para que qualquer pessoa reconheça o seu. */
const LANGUAGE_NAMES: Record<Locale, string> = {
  "en-US": "English (US)",
  "pt-BR": "Português (Brasil)",
  es: "Español",
};

export function LanguageSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const id = useId();

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor={id} className="text-ink2">
        {t("language")}
      </label>
      <select
        id={id}
        value={locale}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value as Locale;
          startTransition(() => router.replace(pathname, { locale: next }));
        }}
        className="min-h-11 rounded-lg border border-line bg-surface px-2 text-ink"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} lang={code}>
            {LANGUAGE_NAMES[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
