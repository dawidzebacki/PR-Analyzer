"use client";

import { useTranslations } from "next-intl";
import { Share2, FileJson, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/components/ui/Toast";
import type { RepoAnalysis } from "@/types/scoring";

interface ShareBarProps {
  analysis: RepoAnalysis;
}

export function ShareBar({ analysis }: ShareBarProps) {
  const t = useTranslations("dashboard");
  const tErrors = useTranslations("errors");
  const { showToast } = useToast();

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("repo", analysis.repoUrl);
    const shareUrl = url.toString();

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(t("shareCopied"), "success");
    } catch {
      showToast(tErrors("CLIPBOARD_ERROR"), "error");
    }
  }

  function handleExportJson() {
    try {
      const blob = new Blob([JSON.stringify(analysis, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, buildFileName(analysis, "json"));
      URL.revokeObjectURL(url);
      showToast(t("exportJsonSuccess"), "success");
    } catch {
      showToast(tErrors("EXPORT_ERROR"), "error");
    }
  }

  async function handleExportBadge() {
    try {
      const blob = await renderBadgeBlob(analysis);
      if (!blob) {
        showToast(tErrors("EXPORT_ERROR"), "error");
        return;
      }
      const url = URL.createObjectURL(blob);
      triggerDownload(url, buildFileName(analysis, "png"));
      URL.revokeObjectURL(url);
      showToast(t("exportBadgeSuccess"), "success");
    } catch {
      showToast(tErrors("EXPORT_ERROR"), "error");
    }
  }

  return (
    <div className="sticky top-[66px] z-30 border-b border-border bg-surface/90 py-3 backdrop-blur-md lg:top-[100px]">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" aria-hidden />
            {t("shareResults")}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportJson}>
            <FileJson className="mr-2 h-4 w-4" aria-hidden />
            {t("exportJson")}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportBadge}>
            <ImageDown className="mr-2 h-4 w-4" aria-hidden />
            {t("exportBadge")}
          </Button>
        </div>
      </Container>
    </div>
  );
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildFileName(analysis: RepoAnalysis, ext: "json" | "png"): string {
  const base = analysis.repoName.replace(/[^\w.-]+/g, "-").toLowerCase();
  const suffix =
    analysis.prs.length === 1 ? `-pr-${analysis.prs[0].number}` : "";
  return `${base}${suffix}-pr-analyzer.${ext}`;
}

function renderBadgeBlob(analysis: RepoAnalysis): Promise<Blob | null> {
  const WIDTH = 600;
  const HEIGHT = 300;
  const DPR =
    typeof window !== "undefined" && window.devicePixelRatio
      ? Math.min(window.devicePixelRatio, 2)
      : 1;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * DPR;
  canvas.height = HEIGHT * DPR;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.scale(DPR, DPR);

  // Background gradient (light blue → white)
  const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGradient.addColorStop(0, "#EFF6FA");
  bgGradient.addColorStop(1, "#FFFFFF");
  ctx.fillStyle = bgGradient;
  drawRoundedRect(ctx, 0, 0, WIDTH, HEIGHT, 16);
  ctx.fill();

  // Border
  ctx.strokeStyle = "#E8ECFC";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 1, 1, WIDTH - 2, HEIGHT - 2, 16);
  ctx.stroke();

  // Eyebrow: "PR ANALYZER"
  ctx.fillStyle = "#4E43E1";
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText("PR ANALYZER", 32, 32);

  // Title
  const isSinglePR = analysis.prs.length === 1;
  const title = isSinglePR
    ? `PR #${analysis.prs[0].number}`
    : analysis.repoName;
  ctx.fillStyle = "#1D253B";
  ctx.font = "700 28px 'PT Serif', Georgia, serif";
  ctx.fillText(truncate(ctx, title, WIDTH - 64), 32, 58);

  // Big score
  const score = Math.round(analysis.totalScore);
  ctx.fillStyle = scoreColor(score);
  ctx.font = "700 84px 'PT Serif', Georgia, serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${score}`, 32, 190);
  const bigWidth = ctx.measureText(`${score}`).width;

  // "/ 100" suffix
  ctx.fillStyle = "#6B6F85";
  ctx.font = "500 28px Inter, system-ui, sans-serif";
  ctx.fillText("/ 100", 32 + bigWidth + 8, 175);

  // Dimension mini-scores on the right
  const dims: Array<{ label: string; value: number }> = [
    { label: "Impact", value: Math.round(analysis.scores.impact) },
    { label: "AI Leverage", value: Math.round(analysis.scores.aiLeverage) },
    { label: "Quality", value: Math.round(analysis.scores.quality) },
  ];

  const colX = 340;
  let colY = 110;
  for (const dim of dims) {
    ctx.fillStyle = "#6B6F85";
    ctx.font = "500 13px Inter, system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(dim.label.toUpperCase(), colX, colY);

    ctx.fillStyle = scoreColor(dim.value);
    ctx.font = "700 24px Inter, system-ui, sans-serif";
    ctx.fillText(`${dim.value}`, colX, colY + 18);
    const dimBig = ctx.measureText(`${dim.value}`).width;

    ctx.fillStyle = "#6B6F85";
    ctx.font = "500 14px Inter, system-ui, sans-serif";
    ctx.fillText("/100", colX + dimBig + 4, colY + 27);

    colY += 54;
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

function scoreColor(score: number): string {
  if (score < 40) return "#E04E6A";
  if (score < 70) return "#E8A93C";
  return "#35BA80";
}
