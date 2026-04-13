import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "terms" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${safeLocale}/terms`,
      languages: {
        en: "/en/terms",
        pl: "/pl/terms",
        "x-default": "/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "terms" });

  const sectionKeys = ["acceptance", "usage", "limitations", "intellectualProperty", "termination"] as const;

  return (
    <Container className="py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm text-text-muted">{t("lastUpdated")}</p>

        <p className="mt-8 text-base leading-7 text-text">{t("intro")}</p>

        <div className="mt-10 space-y-8">
          {sectionKeys.map((key) => (
            <section key={key} className="space-y-3">
              <h2 className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy">
                {t(`sections.${key}.heading`)}
              </h2>
              <p className="text-base leading-7 text-text">
                {t(`sections.${key}.body`)}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm italic text-text-muted">{t("disclaimer")}</p>
      </article>
    </Container>
  );
}
