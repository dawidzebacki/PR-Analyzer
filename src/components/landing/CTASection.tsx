"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { repoUrlSchema } from "@/schemas";
import { isPRUrl } from "@/lib/url";
import { useAnalyze, AnalyzeError } from "@/hooks/useAnalyze";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  AnalysisScopeDialog,
  type AnalysisScopeSubmit,
} from "@/components/ui/AnalysisScopeDialog";

const ctaFormSchema = z.object({
  repoUrl: repoUrlSchema,
});

type CTAFormData = z.infer<typeof ctaFormSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function CTASection() {
  const t = useTranslations("cta");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { analyze, isLoading, error } = useAnalyze();

  const [pendingRepoUrl, setPendingRepoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CTAFormData>({
    resolver: zodResolver(ctaFormSchema),
  });

  function onSubmit(data: CTAFormData) {
    if (isPRUrl(data.repoUrl)) {
      analyze({ repoUrl: data.repoUrl });
    } else {
      setPendingRepoUrl(data.repoUrl);
    }
  }

  function handleScopeSubmit(values: AnalysisScopeSubmit) {
    if (!pendingRepoUrl) return;
    analyze({ repoUrl: pendingRepoUrl, ...values });
    setPendingRepoUrl(null);
  }

  return (
    <section className="bg-navy py-20 lg:py-28">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-white lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-white/70"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 w-full sm:max-w-lg">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-center"
            >
              <div className="relative flex-1 [&_p]:absolute [&_p]:left-0 [&_p]:top-full [&_p]:mt-1.5">
                <Input
                  placeholder={t("inputPlaceholder")}
                  aria-label={t("inputPlaceholder")}
                  error={errors.repoUrl?.message}
                  className="h-[60px]"
                  disabled={isLoading}
                  {...register("repoUrl")}
                />
              </div>
              <Button type="submit" variant="primary" size="lg" loading={isLoading}>
                {isLoading ? tCommon("loading") : t("button")}
              </Button>
            </form>
            {error instanceof AnalyzeError && (
              <p className="mt-3 text-sm text-error">
                {tErrors(error.code as Parameters<typeof tErrors>[0])}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnalysisScopeDialog
        open={pendingRepoUrl !== null}
        onClose={() => setPendingRepoUrl(null)}
        onSubmit={handleScopeSubmit}
      />
    </section>
  );
}
