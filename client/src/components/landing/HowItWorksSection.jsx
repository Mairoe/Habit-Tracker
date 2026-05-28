import React from 'react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Define Your Habits',
      description: 'Set your habit name, description, exact daily/weekly frequencies, daily target frequencies, and custom reminder alerts.',
    },
    {
      num: '02',
      title: 'Log Daily Action',
      description: 'Open your dashboard, view today\'s checklist, and tap the + or - triggers to record completions as you finish them.',
    },
    {
      num: '03',
      title: 'Analyze & Scale',
      description: 'Examine detailed progress sheets, maintain streaks, track weekly trends, and view completions on the monthly heatgrid.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-brand-bg relative border-t border-brand-border/40">
      {/* Background glow */}
      <div className="absolute right-10 top-1/3 w-80 h-80 bg-radial-gradient rounded-full pointer-events-none filter blur-2xl"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-white mb-4">
            Three Steps to Mastery
          </h2>
          <p className="text-brand-textSecondary text-sm sm:text-base max-w-xl mx-auto font-light">
            An intuitive workflow crafted to minimize friction and maximize accountability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group flex flex-col items-start">
              {/* Number Overlay */}
              <span className="text-5xl sm:text-6xl font-extrabold font-mono text-brand-border/80 group-hover:text-brand-accent/20 transition-colors select-none mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
                {step.title}
              </h3>
              <p className="text-brand-textSecondary text-sm font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
