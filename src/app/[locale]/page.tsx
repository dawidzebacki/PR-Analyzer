import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ScoringDimensions } from "@/components/landing/ScoringDimensions";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ScoringDimensions />
      <DashboardPreview />
    </>
  );
}
