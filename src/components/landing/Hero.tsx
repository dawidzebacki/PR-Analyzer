import { getTranslations } from "next-intl/server";
import { HeroForm } from "./HeroForm";
import { HeroIllustration } from "./HeroIllustration";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="pb-16 pt-12 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left column — text + form */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-heading text-[2.5rem] font-bold leading-[2.875rem] tracking-[-0.08rem] text-navy lg:text-[4.5rem] lg:leading-[5rem] lg:tracking-[-0.15rem] animate-fade-in-up">
              {t("title")}
            </h1>

            <p className="mt-5 text-lg leading-7 text-text-muted lg:text-xl lg:leading-8 animate-fade-in-up [animation-delay:0.1s]">
              {t("subtitle")}
            </p>

            <HeroForm
              inputPlaceholder={t("inputPlaceholder")}
              ctaText={t("cta")}
            />

            <p className="mt-4 text-sm leading-5 text-text-muted animate-fade-in-up [animation-delay:0.3s]">
              {t("trust")}
            </p>
          </div>

          {/* Right column — decorative illustration */}
          <div className="flex w-full max-w-[555px] items-center justify-center lg:flex-1 aspect-[480/420] animate-slide-in-right [animation-delay:0.3s]">
            <HeroIllustration
              scoreLabel={t("illustration.score")}
              prsAnalyzedLabel={t("illustration.prsAnalyzed")}
              qualityBadgeLabel={t("illustration.qualityBadge")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
