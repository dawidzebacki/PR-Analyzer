import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/Hero";

const SocialProof = dynamic(() =>
  import("@/components/landing/SocialProof").then((m) => ({
    default: m.SocialProof,
  })),
);

const HowItWorks = dynamic(() =>
  import("@/components/landing/HowItWorks").then((m) => ({
    default: m.HowItWorks,
  })),
);

const ScoringDimensions = dynamic(() =>
  import("@/components/landing/ScoringDimensions").then((m) => ({
    default: m.ScoringDimensions,
  })),
);

const DashboardPreview = dynamic(() =>
  import("@/components/landing/DashboardPreview").then((m) => ({
    default: m.DashboardPreview,
  })),
);

const CTASection = dynamic(() =>
  import("@/components/landing/CTASection").then((m) => ({
    default: m.CTASection,
  })),
);

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ScoringDimensions />
      <DashboardPreview />
      <CTASection />
    </>
  );
}
