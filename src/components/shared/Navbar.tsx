"use client";

import { useState, useEffect } from "react";
import { GitBranch, Menu, X, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ANCHOR_LINKS = ["howItWorks", "scoring"] as const;
const GITHUB_URL = "https://github.com/dawidzebacki/PR-Analyzer";

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const otherLocale = locale === "en" ? "pl" : "en";

  function scrollToHero() {
    const input = document.getElementById("hero-repo-url");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      // Defer focus until after smooth scroll begins to avoid jump
      window.setTimeout(() => input.focus({ preventScroll: true }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-surface transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_1px_0_0_var(--color-border)]" : ""
      }`}
    >
      <nav className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between px-[18px] lg:h-[100px] lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
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

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {ANCHOR_LINKS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="text-base font-semibold leading-[22px] text-navy transition-colors duration-300 hover:text-primary"
            >
              {t(key)}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold leading-[22px] text-navy transition-colors duration-300 hover:text-primary"
          >
            {t("github")}
          </a>

          {/* Language switcher */}
          <Link
            href={pathname}
            locale={otherLocale}
            onClick={() => scrollToHero()}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-primary"
          >
            <Globe className="h-4 w-4" />
            {tLang(otherLocale)}
          </Link>

          {/* CTA - appears on scroll */}
          <motion.div
            initial={false}
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={isScrolled ? "" : "pointer-events-none"}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => scrollToHero()}
            >
              {t("cta")}
            </Button>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center lg:hidden"
          aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-navy" />
          ) : (
            <Menu className="h-6 w-6 text-navy" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 top-[66px] z-40 bg-surface lg:hidden"
          >
            <div className="flex flex-col gap-6 px-[18px] pt-8">
              {ANCHOR_LINKS.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-semibold text-navy transition-colors duration-300 hover:text-primary"
                >
                  {t(key)}
                </a>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-navy transition-colors duration-300 hover:text-primary"
              >
                {t("github")}
              </a>

              <Link
                href={pathname}
                locale={otherLocale}
                className="flex items-center gap-1.5 text-base font-medium text-text-secondary transition-colors duration-300 hover:text-primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToHero();
                }}
              >
                <Globe className="h-4 w-4" />
                {tLang(otherLocale)}
              </Link>

              <Button
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToHero();
                }}
              >
                {t("cta")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
