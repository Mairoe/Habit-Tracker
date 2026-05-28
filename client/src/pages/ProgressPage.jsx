import React, { useEffect, useMemo } from 'react';
import useHabits from '../hooks/useHabits';
import { calculateStreakStats, isHabitActiveOnDate, formatDateKey, getWeekDays } from '../utils/dateHelpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  format,
  parseISO,
} from 'date-fns';
import {
  BarChart3,
  Activity,
  Flame,
  CheckCircle2,
  TrendingUp,
  Percent
} from 'lucide-react';

export const ProgressPage = () => {
  const { habits, loading, fetchHabits } = useHabits();

  useEffect(() => {
    fetchHabits().catch((err) => console.error('Progress page initial load error:', err));
  }, [fetchHabits]);

  // Calculations
  const stats = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalActive: 0,
        weeklyCompletions: 0,
        bestStreak: 0,
        weeklyRate: 0,
        habitProgressList: [],
        chartData: []
      };
    }

    const today = new Date();
    const weekDays = getWeekDays(today);
    
    // 1. Total active habits
    const totalActive = habits.length;

    // 2. Weekly completions (Mon-Sun completions)
    let weeklyCompletions = 0;
    let totalScheduledSlots = 0;
    let totalCompletedSlots = 0;

    const habitProgressList = habits.map(habit => {
      let habitScheduled = 0;
      let habitCompleted = 0;
      const targetCount = habit.timesPerDay || 1;

      const completionsObj = habit.completions instanceof Map
        ? Object.fromEntries(habit.completions)
        : habit.completions || {};

      weekDays.forEach(day => {
        const dateKey = formatDateKey(day);
        const count = completionsObj[dateKey] || 0;
        const isActive = isHabitActiveOnDate(habit, day);

        if (isActive) {
          habitScheduled++;
          totalScheduledSlots++;
          
          if (count >= targetCount) {
            habitCompleted++;
            totalCompletedSlots++;
          }
        }
        
        // Sum total individual completions in this week range
        weeklyCompletions += count;
      });

      const rate = habitScheduled > 0 ? Math.round((habitCompleted / habitScheduled) * 100) : 0;

      return {
        id: habit._id,
        name: habit.name,
        completed: habitCompleted,
        scheduled: habitScheduled,
        rate
      };
    });

    // 3. Weekly completion rate percentage
    const weeklyRate = totalScheduledSlots > 0 ? Math.round((totalCompletedSlots / totalScheduledSlots) * 100) : 0;

    // 4. Best streak across all habits
    let bestStreak = 0;
    habits.forEach(habit => {
      const targetCount = habit.timesPerDay || 1;
      const { longestStreak } = calculateStreakStats(habit.completions, habit.startDate, targetCount);
      if (longestStreak > bestStreak) {
        bestStreak = longestStreak;
      }
    });

    // 5. Daily completion counts for the past 7 days (e.g. 6 days ago -> today)
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    const chartData = last7Days.map(day => {
      const dateKey = formatDateKey(day);
      let dayCompletionsSum = 0;

      habits.forEach(habit => {
        const completionsObj = habit.completions instanceof Map
          ? Object.fromEntries(habit.completions)
          : habit.completions || {};
        dayCompletionsSum += completionsObj[dateKey] || 0;
      });

      return {
        dateLabel: format(day, 'E'), // Mon, Tue...
        fullDate: format(day, 'MMM d'),
        completions: dayCompletionsSum
      };
    });

    return {
      totalActive,
      weeklyCompletions,
      bestStreak,
      weeklyRate,
      habitProgressList,
      chartData
    };
  }, [habits]);

  if (loading && habits.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-card border border-brand-border p-3 rounded-xl text-center select-none shadow-glow-cyan">
          <p className="text-[10px] font-bold text-brand-textSecondary uppercase tracking-wider">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-mono font-extrabold text-brand-accentCyan mt-1">
            {payload[0].value} {payload[0].value === 1 ? 'completion' : 'completions'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-brand-bg relative pb-16">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial-gradient rounded-full pointer-events-none filter blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-2xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-8">
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
            Analytics & Progress
          </h1>
          <p className="text-brand-textSecondary text-xs sm:text-sm font-light uppercase tracking-wider mt-1">
            Summarize consistency metrics and completion records
          </p>
        </div>

        {habits.length === 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center max-w-lg mx-auto mt-6">
            <div className="p-4 bg-brand-bg rounded-full border border-brand-border/80 mb-6">
              <BarChart3 size={32} className="text-brand-textSecondary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">No data available</h3>
            <p className="text-brand-textSecondary text-xs sm:text-sm font-light max-w-sm mb-6 leading-relaxed">
              Create habits and log activity to unlock charts, completion rates, and streak counters.
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest">Active Habits</span>
                <span className="text-2xl font-mono font-extrabold text-white mt-2 flex items-baseline">
                  {stats.totalActive}
                  <span className="text-xs text-brand-textSecondary font-light ml-1">total</span>
                </span>
              </div>

              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest">Weekly Logs</span>
                <span className="text-2xl font-mono font-extrabold text-brand-accentCyan mt-2 flex items-baseline">
                  {stats.weeklyCompletions}
                  <span className="text-xs text-brand-textSecondary font-light ml-1">times</span>
                </span>
              </div>

              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest">Best Streak</span>
                <span className="text-2xl font-mono font-extrabold text-brand-accent mt-2 flex items-baseline">
                  {stats.bestStreak}
                  <span className="text-xs text-brand-textSecondary font-light ml-1">days</span>
                </span>
              </div>

              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-brand-textSecondary uppercase tracking-widest">Completion Rate</span>
                <span className="text-2xl font-mono font-extrabold text-purple-400 mt-2 flex items-baseline">
                  {stats.weeklyRate}%
                  <span className="text-xs text-brand-textSecondary font-light ml-1">this week</span>
                </span>
              </div>
            </div>

            {/* Chart + Habits Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart Panel */}
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 lg:col-span-2 flex flex-col">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                  <Activity size={16} className="text-brand-accentCyan animate-pulse" />
                  <span>Activity (Past 7 Days)</span>
                </h3>
                
                <div className="h-64 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis
                        dataKey="dateLabel"
                        stroke="#8F8F99"
                        fontSize={10}
                        fontWeight="semibold"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#8F8F99"
                        fontSize={10}
                        fontWeight="semibold"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                      <Bar dataKey="completions" radius={[6, 6, 0, 0]}>
                        {stats.chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === stats.chartData.length - 1 ? '#00F59B' : '#00D8F6'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Lists */}
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-accent" />
                  <span>Consistency List</span>
                </h3>

                <div className="space-y-5 overflow-y-auto max-h-64 pr-1">
                  {stats.habitProgressList.map(progress => (
                    <div key={progress.id} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white tracking-wide truncate max-w-[150px]">
                          {progress.name}
                        </span>
                        <span className="font-mono text-brand-textSecondary font-semibold">
                          {progress.completed}/{progress.scheduled} days ({progress.rate}%)
                        </span>
                      </div>
                      
                      {/* Bar Container */}
                      <div className="w-full h-2.5 bg-brand-bg border border-brand-border/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress.rate}%`,
                            background: progress.rate >= 80 
                              ? 'linear-gradient(to right, #00D8F6, #00F59B)'
                              : progress.rate >= 40 
                                ? '#00D8F6' 
                                : '#a855f7'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
