"use client";

import { GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

const PRODUCT_LINKS = ["analyzer", "scoring", "api"] as const;
const RESOURCE_LINKS = ["docs", "blog", "changelog"] as const;
const LEGAL_LINKS = ["github", "privacy", "terms"] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1110px] px-[18px] py-12 lg:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-navy">
                {tCommon("appName")}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-text-muted">
              {t("description")}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-navy">
              {t("product")}
            </h4>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-sm font-medium text-navy transition-colors duration-300 hover:text-primary"
                  >
                    {t(`productLinks.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-navy">
              {t("resources")}
            </h4>
            <ul className="flex flex-col gap-3">
              {RESOURCE_LINKS.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-sm font-medium text-navy transition-colors duration-300 hover:text-primary"
                  >
                    {t(`resourceLinks.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-navy">
              {t("links")}
            </h4>
            <ul className="flex flex-col gap-3">
              {LEGAL_LINKS.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-sm font-medium text-navy transition-colors duration-300 hover:text-primary"
                  >
                    {t(`legalLinks.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">{t("copyright")}</p>
          <LocaleSwitcher className="flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-primary" />
        </div>
      </div>
    </footer>
  );
}
