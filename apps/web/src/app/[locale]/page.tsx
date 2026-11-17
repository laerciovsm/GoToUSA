import { useTranslations } from "next-intl";
import { DisclaimerGate } from "@/components/disclaimer-gate";
import { Link } from "@/i18n/navigation";

const POINTS = ["you", "whole", "decide", "data"] as const;

export default function WelcomePage() {
  const t = useTranslations("Welcome");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{t("eyebrow")}</p>
        <h1 className="max-w-[22ch] text-3xl font-semibold leading-tight sm:text-4xl">{t("title")}</h1>
        <p className="max-w-[62ch] text-lg text-ink2">{t("intro")}</p>
      </section>

      <section aria-labelledby="points-title" className="flex flex-col gap-4">
        <h2 id="points-title" className="text-xl font-semibold">
          {t("pointsTitle")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {POINTS.map((key) => (
            <li key={key} className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-lg font-semibold">{t(`points.${key}.title`)}</h3>
              <p className="text-ink2">{t(`points.${key}.body`)}</p>
            </li>
          ))}
        </ul>
      </section>

      <DisclaimerGate />

      <Link href="/more" className="flex min-h-11 items-center self-start font-bold text-primary underline underline-offset-4">
        {t("importLink")}
      </Link>
    </main>
  );
}
