import React from 'react';
import { format, isSameDay } from 'date-fns';
import { getWeekDays } from '../../utils/dateHelpers';
import BorderGlow from '../UI/BorderGlow';

export const WeekStrip = ({ selectedDate, onSelectDate }) => {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayName = format(day, 'eee');
          const dayNum = format(day, 'd');

          return (
            <div
              key={idx}
              className="transition-transform duration-200 hover:scale-105 hover:-translate-y-1"
              style={{ borderRadius: '14px' }}
            >
              <BorderGlow
                borderRadius={14}
                glowRadius={30}
                glowColor="220 60 75"
                backgroundColor={isSelected ? '#1a1a2e' : '#111115'}
                colors={['#95b2e3', '#b18dd3', '#32548d']}
                fillOpacity={0.3}
                glowIntensity={isSelected ? 2.5 : 0.8}
                className="cursor-pointer w-full"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectDate(day);
                  }}
                  className="flex flex-col items-center justify-center p-3 w-full focus:outline-none"
                >
                  <span className={`text-[10px] uppercase font-bold tracking-widest text-white/70`}>
                    {dayName}
                  </span>
                  <span className="text-base font-mono font-bold mt-1 text-white">
                    {dayNum}
                  </span>
                </button>
              </BorderGlow>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekStrip;