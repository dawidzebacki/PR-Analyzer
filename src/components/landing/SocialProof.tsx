"use client";

import { useTranslations } from "next-intl";

const TOOLS = [
  "nextjs",
  "typescript",
  "tailwind",
  "framerMotion",
  "groq",
  "vercel",
] as const;

export function SocialProof() {
  const t = useTranslations("socialProof");

  return (
    <section className="pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <div className="flex flex-col items-center gap-8 animate-fade-in-up">
          <p className="text-sm uppercase tracking-widest text-text-muted">
            {t("label")}
          </p>

          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-4 text-center text-sm font-semibold text-navy transition-colors duration-300 hover:border-primary/40 hover:text-primary"
              >
                {t(`tools.${tool}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 h-px w-full bg-border" />
      </div>
    </section>
  );
}
