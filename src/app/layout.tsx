import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "block",
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: "700",
  display: "block",
});

export const metadata: Metadata = {
  title: "PR Analyzer — Score Your Pull Requests",
  description:
    "Analyze GitHub pull requests for Impact, AI-Leverage, and Quality. Get actionable scores and insights for your team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
