import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-grid-pattern">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial-gradient rounded-full pointer-events-none filter blur-xl"></div>
      <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-xl"></div>

      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 mb-8 animate-pulse-glow">
          <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
          <span className="text-[11px] font-bold tracking-widest uppercase text-brand-accent">
            Next-Gen habit tracking
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
          Build Streaks.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-accentCyan to-brand-accent">
            Transform Your Life.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-brand-textSecondary max-w-2xl mb-10 font-light leading-relaxed">
          Master your routines, visualize your consistency, and unlock your potential with a dashboard engineered for high-performance habits.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="group flex items-center justify-center space-x-2 px-8 py-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-glow hover:shadow-brand-accent/20 hover:scale-[1.02] w-full sm:w-auto focus:outline-none"
          >
            <span>Get Started Free</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center px-8 py-4 bg-brand-card hover:bg-brand-border text-brand-textPrimary font-extrabold text-sm uppercase tracking-wider rounded-xl border border-brand-border transition-all w-full sm:w-auto focus:outline-none"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
