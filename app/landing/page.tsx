'use client';

import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import PricingSection from '@/components/landing/PricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import NewsletterSection from '@/components/landing/NewsletterSection';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <FooterSection />
    </main>
  );
}