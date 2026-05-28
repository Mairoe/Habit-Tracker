import React from 'react';
import { format, isSameDay } from 'date-fns';
import { getWeekDays } from '../../utils/dateHelpers';

export const WeekStrip = ({ selectedDate, onSelectDate }) => {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 shadow-sm select-none">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayName = format(day, 'eee'); // Mon, Tue...
          const dayNum = format(day, 'd');    // 1, 2...

          return (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                onSelectDate(day);
              }}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl transition-all focus:outline-none w-full
                ${isSelected 
                  ? 'bg-brand-accent text-brand-bg font-extrabold shadow-glow border-none scale-105' 
                  : 'hover:bg-brand-border text-brand-textSecondary hover:text-brand-textPrimary border border-brand-border/40'
                }
              `}
            >
              <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-brand-bg/80' : 'text-brand-textSecondary'}`}>
                {dayName}
              </span>
              <span className="text-base font-mono font-bold mt-1">
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekStrip;
