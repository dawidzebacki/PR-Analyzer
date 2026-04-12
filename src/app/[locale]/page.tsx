import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ScoringDimensions } from "@/components/landing/ScoringDimensions";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ScoringDimensions />
    </>
  );
}
