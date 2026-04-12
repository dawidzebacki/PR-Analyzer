import { getTranslations } from "next-intl/server";

interface ResultsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const t = await getTranslations("results");

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="font-heading text-4xl font-bold text-navy">
        {t("heading", { id })}
      </h1>
    </main>
  );
}
