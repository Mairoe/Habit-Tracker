import React from 'react';
import { Plus, Minus } from 'lucide-react';

export const Counter = ({ value = 1, onChange, min = 1, max = 999, label = '' }) => {
  const handleDecrement = (e) => {
    e.preventDefault();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">{label}</label>}
      <div className="flex items-center space-x-2 bg-brand-bg border border-brand-border rounded-lg p-1.5 w-max">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 bg-brand-card hover:bg-brand-border disabled:opacity-40 text-brand-textPrimary rounded-md transition-colors border border-brand-border/40 focus:outline-none"
        >
          <Minus size={14} className="stroke-[2.5]" />
        </button>
        <span className="w-12 text-center font-mono text-base font-semibold text-brand-textPrimary select-none">
          {value}
        </span>
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 bg-brand-card hover:bg-brand-border disabled:opacity-40 text-brand-textPrimary rounded-md transition-colors border border-brand-border/40 focus:outline-none"
        >
          <Plus size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default Counter;
