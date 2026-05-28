import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DatePicker = ({ value, onChange, label = '' }) => {
  const selectedDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const prevMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generate days to display (full weeks covering the current month)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (day, e) => {
    e.preventDefault();
    onChange(day);
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full max-w-sm">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
          {label}
        </span>
      )}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 shadow-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-brand-textPrimary text-sm font-sans tracking-wide">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-brand-border text-brand-textPrimary rounded-md transition-colors border border-brand-border/40 focus:outline-none"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-brand-border text-brand-textPrimary rounded-md transition-colors border border-brand-border/40 focus:outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayAbbr, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold text-brand-textSecondary uppercase tracking-widest font-sans"
            >
              {dayAbbr}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonthDay = day.getMonth() === currentMonth.getMonth();
            const isDayToday = isToday(day);

            return (
              <button
                key={idx}
                onClick={(e) => handleDateClick(day, e)}
                className={`
                  aspect-square flex items-center justify-center text-xs font-mono rounded-lg transition-all focus:outline-none
                  ${!isCurrentMonthDay ? 'text-brand-textSecondary/30 hover:bg-brand-border/20' : ''}
                  ${isCurrentMonthDay && !isSelected && !isDayToday ? 'text-brand-textPrimary hover:bg-brand-border' : ''}
                  ${isDayToday && !isSelected ? 'border border-brand-accent/50 text-brand-accent' : ''}
                  ${isSelected ? 'bg-brand-accent text-brand-bg font-bold shadow-glow border-none' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
