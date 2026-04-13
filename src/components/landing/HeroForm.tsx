"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useTranslations } from "next-intl";
import { repoUrlSchema } from "@/schemas";
import { isPRUrl } from "@/lib/url";
import { useAnalyze, AnalyzeError } from "@/hooks/useAnalyze";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  AnalysisScopeDialog,
  type AnalysisScopeSubmit,
} from "@/components/ui/AnalysisScopeDialog";

const heroFormSchema = z.object({
  repoUrl: repoUrlSchema,
});

type HeroFormData = z.infer<typeof heroFormSchema>;

interface HeroFormProps {
  inputPlaceholder: string;
  inputHint?: string;
  ctaText: string;
}

export function HeroForm({ inputPlaceholder, inputHint, ctaText }: HeroFormProps) {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { analyze, isLoading, error } = useAnalyze();
  const searchParams = useSearchParams();
  const prefilledRepoUrl = searchParams.get("repo") ?? undefined;

  const [pendingRepoUrl, setPendingRepoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: prefilledRepoUrl ? { repoUrl: prefilledRepoUrl } : undefined,
  });

  function onSubmit(data: HeroFormData) {
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
      {inputHint && (
        <p className="mt-3 text-sm text-text-muted">{inputHint}</p>
      )}
      {error instanceof AnalyzeError && (
        <p className="mt-3 text-sm text-error">
          {tErrors(error.code as Parameters<typeof tErrors>[0])}
        </p>
      )}

      <AnalysisScopeDialog
        open={pendingRepoUrl !== null}
        onClose={() => setPendingRepoUrl(null)}
        onSubmit={handleScopeSubmit}
      />
    </div>
  );
}
