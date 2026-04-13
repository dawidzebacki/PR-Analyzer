import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import * as cache from "@/lib/cache";

interface ResultsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ResultsLayoutProps): Promise<Metadata> {
  const { locale, id } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "seo" });
  const siteName = t("siteName");

  const analysis = cache.get(id);
  let title: string;
  let description: string;

  if (analysis) {
    const isSinglePr = analysis.prs.length === 1;
    const repo = analysis.repoName;
    title = isSinglePr
      ? t("results.titlePr", { number: analysis.prs[0].number, repo })
      : t("results.title", { repo });
    description = t("results.description", { repo });
  } else {
    title = `${t("results.title", { repo: id })} | ${siteName}`;
    description = t("defaultDescription");
  }

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return children;
}
