import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-brand-accent flex items-center justify-center">
            <CheckSquare size={12} className="text-brand-bg stroke-[3]" />
          </div>
          <span className="font-sans font-extrabold text-sm tracking-wide text-white">
            HABIT<span className="text-brand-accent font-light">PULSE</span>
          </span>
        </div>

        {/* Copyright */}
        <p className="text-white/50 text-[11px] font-medium tracking-wide uppercase text-center md:text-right">
          © {new Date().getFullYear()} HABITPULSE. BUILD STREAKS, TRANSFORM LIFE.
        </p>
      </div>
    </footer>
  );
};

export default Footer;