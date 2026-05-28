import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import Footer from '../components/landing/Footer';
import Grainient from '../components/UI/Grainient';

export const LandingPage = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Grainient
          color1="#95b2e3"
          color2="#32548d"
          color3="#b18dd3"
          timeSpeed={0.25}
          colorBalance={-0.08}
          warpStrength={2.55}
          warpFrequency={4.2}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={-6}
          blendSoftness={0.15}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col min-h-screen justify-between text-brand-textPrimary">
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
        </main>
        <Footer />
      </div>

    </div>
  );
};

export default LandingPage;