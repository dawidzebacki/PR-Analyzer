"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { repoUrlSchema } from "@/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CTAFormData>({
    resolver: zodResolver(ctaFormSchema),
  });

  function onSubmit(data: CTAFormData) {
    const match = data.repoUrl.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
    if (match) {
      const id = encodeURIComponent(match[1]);
      router.push(`/results/${id}`);
    }
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

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-center lg:max-w-lg"
          >
            <div className="relative flex-1 [&_p]:absolute [&_p]:left-0 [&_p]:top-full [&_p]:mt-1.5">
              <Input
                placeholder={t("inputPlaceholder")}
                error={errors.repoUrl?.message}
                className="h-[60px]"
                {...register("repoUrl")}
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              {t("button")}
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
