"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useTranslations } from "next-intl";
import { repoUrlSchema } from "@/schemas";
import { useAnalyze, AnalyzeError } from "@/hooks/useAnalyze";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const heroFormSchema = z.object({
  repoUrl: repoUrlSchema,
});

type HeroFormData = z.infer<typeof heroFormSchema>;

interface HeroFormProps {
  inputPlaceholder: string;
  ctaText: string;
}

export function HeroForm({ inputPlaceholder, ctaText }: HeroFormProps) {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { analyze, isLoading, error } = useAnalyze();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroFormSchema),
  });

  function onSubmit(data: HeroFormData) {
    analyze(data.repoUrl);
  }

  return (
    <div className="mt-8 w-full lg:max-w-lg animate-fade-in-up [animation-delay:0.2s]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <Input
            placeholder={inputPlaceholder}
            aria-label={inputPlaceholder}
            error={errors.repoUrl?.message}
            className="h-[60px]"
            disabled={isLoading}
            {...register("repoUrl")}
          />
        </div>
        <Button type="submit" variant="primary" size="lg" loading={isLoading}>
          {isLoading ? tCommon("loading") : ctaText}
        </Button>
      </form>
      {error instanceof AnalyzeError && (
        <p className="mt-3 text-sm text-error">
          {tErrors(error.code as Parameters<typeof tErrors>[0])}
        </p>
      )}
    </div>
  );
}
