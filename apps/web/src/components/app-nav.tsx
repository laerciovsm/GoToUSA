"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Barra inferior (docs/telas.md). Por enquanto só com as telas que já existem;
 * Mais entra nas próximas partes do Marco 5.
 */
const TABS = [
  { href: "/today", key: "today", icon: "☀️" },
  { href: "/journey", key: "journey", icon: "🧭" },
  { href: "/family", key: "family", icon: "👨‍👩‍👧" },
  { href: "/questionnaire", key: "questionnaire", icon: "📝" },
] as const;

export function AppNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-4xl">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.key} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm font-bold ${active ? "text-primary" : "text-ink2"}`}
              >
                <span aria-hidden="true" className="text-xl">{tab.icon}</span>
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
