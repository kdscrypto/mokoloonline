import React from 'react';
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/how-it-works/HeroSection";
import { StepsSection } from "@/components/how-it-works/StepsSection";
import { GuaranteesSection } from "@/components/how-it-works/GuaranteesSection";
import { CTASection } from "@/components/how-it-works/CTASection";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <StepsSection />
        <GuaranteesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}