// Resolves the canonical site URL used for SEO metadata, sitemaps, and Open Graph tags.
// Reads NEXT_PUBLIC_SITE_URL when set, otherwise falls back to the Vercel-provided URL or localhost.

const FALLBACK_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return FALLBACK_URL;
}
