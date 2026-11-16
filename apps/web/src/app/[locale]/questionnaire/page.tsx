import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Marco 2 do MVP. Por enquanto, só reserva a rota. */
export default function QuestionnairePage() {
  const t = useTranslations("Questionnaire");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="max-w-[62ch] text-ink2">{t("comingSoon")}</p>
      <Link href="/" className="self-start font-bold text-primary underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}
