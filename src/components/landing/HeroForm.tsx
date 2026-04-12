"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useRouter } from "@/i18n/navigation";
import { repoUrlSchema } from "@/schemas";
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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroFormSchema),
  });

  function onSubmit(data: HeroFormData) {
    const match = data.repoUrl.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
    if (match) {
      const id = encodeURIComponent(match[1]);
      router.push(`/results/${id}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-start lg:max-w-lg animate-fade-in-up [animation-delay:0.2s]"
    >
      <div className="flex-1">
        <Input
          placeholder={inputPlaceholder}
          aria-label={inputPlaceholder}
          error={errors.repoUrl?.message}
          className="h-[60px]"
          {...register("repoUrl")}
        />
      </div>
      <Button type="submit" variant="primary" size="lg">
        {ctaText}
      </Button>
    </form>
  );
}
