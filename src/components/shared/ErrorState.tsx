"use client";

import { useTranslations } from "next-intl";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  GitPullRequest,
  GitPullRequestClosed,
  Lock,
  Search,
  ShieldAlert,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export type ErrorVariant =
  | "INVALID_URL"
  | "REPO_NOT_FOUND"
  | "REPO_PRIVATE"
  | "NO_PRS"
  | "PR_NOT_FOUND"
  | "GITHUB_RATE_LIMIT"
  | "AI_RATE_LIMIT"
  | "AI_TOO_LARGE"
  | "AI_AUTH_ERROR"
  | "ANALYSIS_FAILED"
  | "EXPIRED";

type Severity = "error" | "warning" | "info";

interface VariantConfig {
  icon: LucideIcon;
  severity: Severity;
  titleKey: string;
  messageKey: string;
  actionKey: string;
  suggestionKey?: string;
}

const VARIANTS: Record<ErrorVariant, VariantConfig> = {
  INVALID_URL: {
    icon: AlertCircle,
    severity: "error",
    titleKey: "invalidUrlTitle",
    messageKey: "invalidUrl",
    actionKey: "actionTryAgain",
  },
  REPO_NOT_FOUND: {
    icon: Search,
    severity: "error",
    titleKey: "repoNotFoundTitle",
    messageKey: "repoNotFound",
    actionKey: "actionTryAnotherRepo",
  },
  REPO_PRIVATE: {
    icon: Lock,
    severity: "warning",
    titleKey: "repoPrivateTitle",
    messageKey: "repoPrivate",
    actionKey: "actionTryAnotherRepo",
  },
  NO_PRS: {
    icon: GitPullRequestClosed,
    severity: "info",
    titleKey: "noPrsTitle",
    messageKey: "noPrs",
    actionKey: "actionTryAnotherRepo",
    suggestionKey: "noPrsSuggestion",
  },
  PR_NOT_FOUND: {
    icon: GitPullRequest,
    severity: "error",
    titleKey: "prNotFoundTitle",
    messageKey: "prNotFound",
    actionKey: "actionTryAgain",
  },
  GITHUB_RATE_LIMIT: {
    icon: Clock,
    severity: "warning",
    titleKey: "githubRateLimitedTitle",
    messageKey: "githubRateLimited",
    actionKey: "actionTryAgainLater",
  },
  AI_RATE_LIMIT: {
    icon: Clock,
    severity: "warning",
    titleKey: "aiRateLimitedTitle",
    messageKey: "aiRateLimited",
    actionKey: "actionTryAgainLater",
  },
  AI_TOO_LARGE: {
    icon: AlertTriangle,
    severity: "warning",
    titleKey: "aiTooLargeTitle",
    messageKey: "aiTooLarge",
    actionKey: "actionNarrowScope",
  },
  AI_AUTH_ERROR: {
    icon: ShieldAlert,
    severity: "error",
    titleKey: "aiAuthErrorTitle",
    messageKey: "aiAuthError",
    actionKey: "actionContactSupport",
  },
  ANALYSIS_FAILED: {
    icon: XCircle,
    severity: "error",
    titleKey: "analysisFailedTitle",
    messageKey: "analysisFailed",
    actionKey: "actionTryAgain",
  },
  EXPIRED: {
    icon: AlertCircle,
    severity: "error",
    titleKey: "expiredTitle",
    messageKey: "expired",
    actionKey: "actionReanalyze",
  },
};

const SEVERITY_STYLES: Record<
  Severity,
  { iconBg: string; iconColor: string }
> = {
  error: {
    iconBg: "bg-error-bg",
    iconColor: "text-error",
  },
  warning: {
    iconBg: "bg-score-yellow/15",
    iconColor: "text-score-yellow",
  },
  info: {
    iconBg: "bg-accent-blue/10",
    iconColor: "text-accent-blue",
  },
};

interface ErrorStateProps {
  variant: ErrorVariant;
  onAction?: () => void;
  actionHref?: string;
}

export function ErrorState({ variant, onAction, actionHref }: ErrorStateProps) {
  const t = useTranslations("errors");
  const config = VARIANTS[variant];
  const { icon: Icon, severity, titleKey, messageKey, actionKey, suggestionKey } =
    config;
  const { iconBg, iconColor } = SEVERITY_STYLES[severity];

  const actionButton = (
    <Button variant="primary" size="md" onClick={onAction}>
      {t(actionKey)}
    </Button>
  );

  return (
    <Container className="py-12 lg:py-16">
      <div
        role="alert"
        aria-live="polite"
        className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 text-center shadow-sm"
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]">
            {t(titleKey)}
          </h1>
          <p className="text-base text-text-muted">{t(messageKey)}</p>
          {suggestionKey && (
            <p className="text-sm text-text-muted">{t(suggestionKey)}</p>
          )}
        </div>
        {actionHref ? (
          <Link href={actionHref}>{actionButton}</Link>
        ) : onAction ? (
          actionButton
        ) : (
          <Link href="/">{actionButton}</Link>
        )}
      </div>
    </Container>
  );
}
