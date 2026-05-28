import React from 'react';
import { Calendar, Flame, BarChart3 } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className="text-brand-accent stroke-[1.5]" size={32} />,
      title: 'Precision Scheduling',
      description: 'Configure daily, weekly, or specific custom day patterns. Fit tracking into your life, not the other way around.',
    },
    {
      icon: <Flame className="text-brand-accentCyan stroke-[1.5]" size={32} />,
      title: 'Streak Multipliers',
      description: 'Keep the fire burning. Watch your current and longest streaks multiply as you check off items day after day.',
    },
    {
      icon: <BarChart3 className="text-purple-400 stroke-[1.5]" size={32} />,
      title: 'Visual Analytics',
      description: 'Analyze performance trends with interactive completion charts, heatmaps, and weekly progress statistics.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-brand-bg relative border-t border-brand-border/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-white mb-4">
            Engineered for Consistency
          </h2>
          <p className="text-brand-textSecondary text-sm sm:text-base max-w-xl mx-auto font-light">
            No fluff. Just the essential data and tools you need to build long-term positive behaviors.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-brand-card border border-brand-border hover:border-brand-border/90 rounded-2xl p-8 transition-all hover:scale-[1.01] hover:shadow-glow/5 flex flex-col items-start group"
            >
              <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/60 mb-6 group-hover:scale-105 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-brand-textSecondary text-sm font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
