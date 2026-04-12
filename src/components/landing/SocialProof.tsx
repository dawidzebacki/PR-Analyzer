import { getTranslations } from "next-intl/server";

const COMPANIES = [
  "vercel",
  "stripe",
  "shopify",
  "notion",
  "linear",
  "supabase",
] as const;

export async function SocialProof() {
  const t = await getTranslations("socialProof");

  return (
    <section className="pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <div className="flex flex-col items-center gap-8 animate-fade-in-up">
          <p className="text-sm uppercase tracking-widest text-text-muted">
            {t("label")}
          </p>

          <div
            className="grid w-full grid-cols-3 gap-y-6 lg:grid-cols-6"
            aria-hidden="true"
          >
            {COMPANIES.map((company) => (
              <span
                key={company}
                className="text-center text-2xl font-bold text-text-muted/30 select-none"
              >
                {t(`companies.${company}`)}
              </span>
            ))}
          </div>

          <p className="text-sm text-text-muted">
            {t("stat", { count: "12,000" })}
          </p>
        </div>

        <div className="mt-12 h-px w-full bg-border" />
      </div>
    </section>
  );
}
