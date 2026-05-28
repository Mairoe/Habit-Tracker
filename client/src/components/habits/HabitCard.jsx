import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Plus, Minus, Sun, CloudSun, Moon, HelpCircle } from 'lucide-react';
import { calculateStreakStats, formatDateKey } from '../../utils/dateHelpers';

export const HabitCard = ({ habit, selectedDate, onUpdateCompletion }) => {
  const navigate = useNavigate();
  const dateKey = formatDateKey(selectedDate);
  
  // Get current completions for the selected date
  const completionsObj = habit.completions instanceof Map
    ? Object.fromEntries(habit.completions)
    : habit.completions || {};
  
  const currentCount = completionsObj[dateKey] || 0;
  const targetCount = habit.timesPerDay || 1;

  // Calculate streaks using helper
  const { currentStreak } = calculateStreakStats(
    habit.completions,
    habit.startDate,
    targetCount
  );

  // Status mapping
  let statusText = 'Not Started';
  let statusColor = 'border-brand-border text-brand-textSecondary';
  let dotColor = 'bg-brand-textSecondary/40';

  if (currentCount > 0 && currentCount < targetCount) {
    statusText = 'In Progress';
    statusColor = 'border-brand-accentCyan/30 text-brand-accentCyan bg-brand-accentCyan/5';
    dotColor = 'bg-brand-accentCyan shadow-glow-cyan';
  } else if (currentCount >= targetCount) {
    statusText = 'Completed';
    statusColor = 'border-brand-accent/30 text-brand-accent bg-brand-accent/5';
    dotColor = 'bg-brand-accent shadow-glow';
  }

  // Time of Day Icon mapping
  const getTimeIcon = (time) => {
    switch (time) {
      case 'Morning': return <Sun size={13} className="text-amber-400" />;
      case 'Afternoon': return <CloudSun size={13} className="text-brand-accentCyan" />;
      case 'Evening': return <Moon size={13} className="text-purple-400" />;
      default: return <HelpCircle size={13} className="text-brand-textSecondary" />;
    }
  };

  const handleMinusClick = (e) => {
    e.stopPropagation(); // Prevent navigation to detail page
    if (currentCount > 0) {
      onUpdateCompletion(habit._id, dateKey, currentCount - 1);
    }
  };

  const handlePlusClick = (e) => {
    e.stopPropagation(); // Prevent navigation to detail page
    onUpdateCompletion(habit._id, dateKey, currentCount + 1);
  };

  const handleCardClick = () => {
    navigate(`/habit/${habit._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-brand-card border hover:border-brand-border/90 rounded-2xl p-5 flex flex-col justify-between 
        cursor-pointer transition-all hover:scale-[1.01] hover:shadow-glow/5 relative select-none w-full
        ${currentCount >= targetCount ? 'border-brand-accent/20' : 'border-brand-border'}
      `}
    >
      {/* Top Section: Name and Category info */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white tracking-wide leading-tight group-hover:text-brand-accent">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-xs text-brand-textSecondary font-light mt-1 line-clamp-2 leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>

        {/* Time of Day badge */}
        <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-bg border border-brand-border/60 rounded-full text-[10px] font-semibold text-brand-textSecondary uppercase tracking-wider">
          {getTimeIcon(habit.timeOfDay)}
          <span>{habit.timeOfDay}</span>
        </span>
      </div>

      {/* Middle Section: Streak & Status */}
      <div className="flex items-center space-x-4 mb-4 mt-2">
        {/* Streak Counter */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-brand-bg rounded-lg border border-brand-border/40">
          <Flame size={14} className="text-brand-accent fill-brand-accent" />
          <span className="text-xs font-mono font-bold text-brand-textPrimary">{currentStreak}d streak</span>
        </div>

        {/* Status indicator tag */}
        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
          <span>{statusText}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-brand-border/40 w-full mb-4"></div>

      {/* Bottom Section: Increment controls */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-widest">
          Daily Target
        </span>

        <div className="flex items-center space-x-3 bg-brand-bg border border-brand-border/60 rounded-xl p-1.5">
          <button
            onClick={handleMinusClick}
            disabled={currentCount <= 0}
            className="p-1.5 bg-brand-card hover:bg-brand-border disabled:opacity-40 text-brand-textPrimary rounded-lg transition-colors border border-brand-border/40 focus:outline-none"
          >
            <Minus size={12} className="stroke-[2.5]" />
          </button>
          
          <span className="w-12 text-center font-mono text-sm font-extrabold text-brand-textPrimary">
            {currentCount} / {targetCount}
          </span>

          <button
            onClick={handlePlusClick}
            className="p-1.5 bg-brand-card hover:bg-brand-border text-brand-textPrimary rounded-lg transition-colors border border-brand-border/40 focus:outline-none"
          >
            <Plus size={12} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
