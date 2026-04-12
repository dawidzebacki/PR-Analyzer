"use client";

import { Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const tLang = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "pl" : "en";

  return (
    <Link href={pathname} locale={otherLocale} className={className}>
      <Globe className="h-4 w-4" />
      {tLang(otherLocale)}
    </Link>
  );
}
