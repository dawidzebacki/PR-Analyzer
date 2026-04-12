import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/HowItWorks";

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
