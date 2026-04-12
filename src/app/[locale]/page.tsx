import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="font-heading text-4xl font-bold text-navy">
        {t("title")}
      </h1>
    </main>
  );
}
