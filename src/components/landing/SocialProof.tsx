"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const COMPANIES = [
  "vercel",
  "stripe",
  "shopify",
  "notion",
  "linear",
  "supabase",
] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function SocialProof() {
  const t = useTranslations("socialProof");

  return (
    <section className="pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm uppercase tracking-widest text-text-muted"
          >
            {t("label")}
          </motion.p>

          <motion.div
            variants={stagger}
            className="grid w-full grid-cols-3 gap-y-6 lg:grid-cols-6"
            aria-hidden="true"
          >
            {COMPANIES.map((company) => (
              <motion.span
                key={company}
                variants={fadeInUp}
                className="text-center text-2xl font-bold text-text-muted/30 select-none"
              >
                {t(`companies.${company}`)}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-sm text-text-muted"
          >
            {t("stat", { count: "12,000" })}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 h-px w-full bg-border"
        />
      </div>
    </section>
  );
}
