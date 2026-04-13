"use client";

import { GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

const GITHUB_URL = "https://github.com/dawidzebacki/PR-Analyzer";

interface FooterLink {
  key: string;
  href: string;
  external?: boolean;
}

const PRODUCT_LINKS: FooterLink[] = [
  { key: "analyzer", href: "/#howItWorks" },
  { key: "scoring", href: "/#scoring" },
];

const LEGAL_LINKS: FooterLink[] = [
  { key: "github", href: GITHUB_URL, external: true },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
];

const linkClass =
  "text-sm font-medium text-navy transition-colors duration-300 hover:text-primary cursor-pointer";

function FooterLinkItem({ link, label }: { link: FooterLink; label: string }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {label}
    </Link>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  function scrollToHero() {
    const input = document.getElementById("hero-repo-url");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => input.focus({ preventScroll: true }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1110px] px-[18px] py-12 lg:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  scrollToHero();
                }
              }}
            >
              <GitBranch className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-navy">
                {tCommon("appName")}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">
              {t("description")}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-navy">
              {t("product")}
            </h4>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.key}>
                  <FooterLinkItem
                    link={link}
                    label={t(`productLinks.${link.key}`)}
                  />
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
              {LEGAL_LINKS.map((link) => (
                <li key={link.key}>
                  <FooterLinkItem
                    link={link}
                    label={t(`legalLinks.${link.key}`)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">{t("copyright")}</p>
          <LocaleSwitcher className="flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-primary cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
