import { getTranslations } from "next-intl/server";
import { Link2, Brain, BarChart3 } from "lucide-react";

const STEPS = [
  { icon: Link2, key: "step1" },
  { icon: Brain, key: "step2" },
  { icon: BarChart3, key: "step3" },
] as const;

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="howItWorks" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-text-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative mt-16">
          {/* Dashed connector line — desktop only */}
          <div
            className="absolute top-14 right-[calc(16.67%+12px)] left-[calc(16.67%+12px)] hidden border-t-2 border-dashed border-border lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  className="relative flex flex-col items-center text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Step number badge */}
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-surface">
                      <span className="absolute text-[4rem] font-bold leading-none text-border select-none">
                        {index + 1}
                      </span>
                      <Icon className="relative z-10 h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-xs text-base leading-6 text-text-muted">
                    {t(`${step.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
