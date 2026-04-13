import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/HowItWorks";

const ScoringDimensions = dynamic(() =>
  import("@/components/landing/ScoringDimensions").then((m) => ({
    default: m.ScoringDimensions,
  })),
);

const DashboardPreview = dynamic(() =>
  import("@/components/landing/DashboardPreview").then((m) => ({
    default: m.DashboardPreview,
  })),
);

const CTASection = dynamic(() =>
  import("@/components/landing/CTASection").then((m) => ({
    default: m.CTASection,
  })),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "seo" });
  const title = t("home.title");
  const description = t("home.description");

  return {
    title,
    description,
    alternates: {
      canonical: `/${safeLocale}`,
      languages: {
        en: "/en",
        pl: "/pl",
        "x-default": "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${safeLocale}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ScoringDimensions />
      <DashboardPreview />
      <CTASection />
    </>
  );
}
