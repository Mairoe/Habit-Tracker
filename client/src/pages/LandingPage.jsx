import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import Footer from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="bg-brand-bg min-h-screen text-brand-textPrimary flex flex-col justify-between">
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
