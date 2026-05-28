import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import useHabits from '../hooks/useHabits';
import { calculateStreakStats, isHabitActiveOnDate, formatDateKey } from '../utils/dateHelpers';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  CloudSun,
  Moon,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const HabitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchHabitById, deleteHabit, loading, error } = useHabits();
  
  const [habit, setHabit] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadHabit = async () => {
      try {
        const data = await fetchHabitById(id);
        setHabit(data);
      } catch (err) {
        console.error('Error fetching habit in details page:', err);
      }
    };
    loadHabit();
  }, [id, fetchHabitById]);

  if (loading && !habit) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Habit not found</h2>
        <p className="text-brand-textSecondary text-sm mb-6">This habit may have been deleted or is unauthorized.</p>
        <Link to="/dashboard" className="px-5 py-2.5 bg-brand-accent text-brand-bg font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate streaks
  const targetCount = habit.timesPerDay || 1;
  const { currentStreak, longestStreak, totalCompletions } = calculateStreakStats(
    habit.completions,
    habit.startDate,
    targetCount
  );

  // Calendar Heatgrid generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const completionsObj = habit.completions instanceof Map
    ? Object.fromEntries(habit.completions)
    : habit.completions || {};

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteHabit(habit._id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete habit error:', err);
      setDeleteLoading(false);
    }
  };

  // Helper to determine cell status colors
  const getCellStatus = (day) => {
    const isCurrentMonthDay = day.getMonth() === currentMonth.getMonth();
    if (!isCurrentMonthDay) return 'other-month';

    const dateKey = formatDateKey(day);
    const count = completionsObj[dateKey] || 0;
    const isFuture = isAfter(day, new Date());
    const isBeforeStart = isBefore(day, new Date(habit.startDate)) && !isSameDay(day, new Date(habit.startDate));

    if (isFuture || isBeforeStart) {
      return 'future';
    }

    const isActive = isHabitActiveOnDate(habit, day);
    if (!isActive) {
      return 'inactive'; // Day not scheduled
    }

    // Scheduled day in past or today
    if (count >= targetCount) {
      return 'completed';
    }
    return 'missed';
  };

  const getTimeIcon = (time) => {
    switch (time) {
      case 'Morning': return <Sun size={14} className="text-amber-400" />;
      case 'Afternoon': return <CloudSun size={14} className="text-brand-accentCyan" />;
      case 'Evening': return <Moon size={14} className="text-purple-400" />;
      default: return <HelpCircle size={14} className="text-brand-textSecondary" />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative pb-16">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial-gradient rounded-full pointer-events-none filter blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-2xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-brand-border/40 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2.5 bg-brand-card hover:bg-brand-border text-brand-textPrimary rounded-xl transition-colors border border-brand-border focus:outline-none"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-white">
                {habit.name}
              </h1>
              <div className="flex items-center space-x-2.5 mt-1">
                <span className="flex items-center space-x-1 text-xs text-brand-textSecondary">
                  {getTimeIcon(habit.timeOfDay)}
                  <span>{habit.timeOfDay}</span>
                </span>
                <span className="text-brand-border/80 text-xs">•</span>
                <span className="text-xs text-brand-textSecondary uppercase font-mono tracking-wider">
                  {habit.frequency} ({habit.frequency === 'daily' ? `every ${habit.everyNDays}d` : `weekly repeat`})
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/add-habit?edit=${habit._id}`}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-brand-card hover:bg-brand-border text-brand-textPrimary border border-brand-border font-bold text-xs uppercase tracking-wider rounded-xl transition-colors focus:outline-none"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors focus:outline-none"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-bg/80 backdrop-blur-sm">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 max-w-sm w-full text-center">
              <AlertTriangle size={36} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Are you absolutely sure?</h3>
              <p className="text-brand-textSecondary text-xs sm:text-sm font-light mb-6">
                This action cannot be undone. You will lose all streak counts and completion records for this habit.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 py-3 bg-brand-bg hover:bg-brand-border border border-brand-border text-brand-textPrimary font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-brand-accent/5 border border-brand-accent/15 rounded-xl text-brand-accent">
              <Flame size={24} className="fill-brand-accent" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest block">Current Streak</span>
              <span className="text-xl font-mono font-extrabold text-white">{currentStreak} days</span>
            </div>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-brand-accentCyan/5 border border-brand-accentCyan/15 rounded-xl text-brand-accentCyan">
              <Flame size={24} className="fill-brand-accentCyan" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest block">Longest Streak</span>
              <span className="text-xl font-mono font-extrabold text-white">{longestStreak} days</span>
            </div>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/5 border border-purple-500/15 rounded-xl text-purple-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest block">Total Completions</span>
              <span className="text-xl font-mono font-extrabold text-white">{totalCompletions} times</span>
            </div>
          </div>
        </div>

        {/* Description panel if exists */}
        {habit.description && (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8">
            <h3 className="text-xs font-extrabold text-brand-textSecondary uppercase tracking-wider mb-2">Description / Motivation</h3>
            <p className="text-brand-textPrimary text-sm font-light leading-relaxed">{habit.description}</p>
          </div>
        )}

        {/* Monthly Calendar Heatgrid Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar size={16} className="text-brand-accent" />
              <span>Completion History</span>
            </h2>
            
            {/* Month Toggles */}
            <div className="flex items-center space-x-1 bg-brand-bg border border-brand-border/60 rounded-xl p-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-brand-border text-brand-textPrimary rounded-lg transition-colors border border-brand-border/40 focus:outline-none"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 text-xs font-bold text-brand-textPrimary font-sans">
                {format(currentMonth, 'MMM yyyy')}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-brand-border text-brand-textPrimary rounded-lg transition-colors border border-brand-border/40 focus:outline-none"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Days of Week label */}
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayAbbr, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold text-brand-textSecondary uppercase tracking-widest"
              >
                {dayAbbr}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const status = getCellStatus(day);
              const isTodayCell = isToday(day);

              let styleClasses = 'bg-brand-bg text-brand-textSecondary/40 border border-transparent cursor-default';
              
              if (status === 'other-month') {
                styleClasses = 'opacity-0 pointer-events-none';
              } else if (status === 'future') {
                styleClasses = 'bg-brand-bg text-brand-textSecondary/40 border border-brand-border/60';
              } else if (status === 'inactive') {
                styleClasses = 'bg-brand-bg text-brand-textSecondary/20 border border-brand-border/20 line-through';
              } else if (status === 'completed') {
                styleClasses = 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent font-extrabold shadow-glow';
              } else if (status === 'missed') {
                styleClasses = 'bg-red-950/15 border border-red-500/30 text-red-400 font-medium';
              }

              if (isTodayCell && status !== 'other-month') {
                styleClasses += ' ring-2 ring-brand-accentCyan/60';
              }

              return (
                <div
                  key={idx}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-xs font-mono rounded-xl transition-all relative
                    ${styleClasses}
                  `}
                  title={format(day, 'yyyy-MM-dd')}
                >
                  <span>{format(day, 'd')}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-brand-border/40 text-[10px] font-bold uppercase tracking-wider text-brand-textSecondary">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-accent/15 border border-brand-accent/40"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-red-950/15 border border-red-500/30"></span>
              <span>Missed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-bg border border-brand-border/60"></span>
              <span>Pending / Future</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-bg border border-brand-border/20 line-through opacity-50"></span>
              <span>Off-Schedule</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailPage;
