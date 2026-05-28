import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useHabits from '../hooks/useHabits';
import WeekStrip from '../components/habits/WeekStrip';
import HabitCard from '../components/habits/HabitCard';
import { isHabitActiveOnDate, formatDateKey } from '../utils/dateHelpers';
import { Plus, AlertCircle, PlusCircle, CalendarDays } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { habits, loading, error, fetchHabits, updateCompletion } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchHabits().catch((err) => console.error('Initial habits fetch error:', err));
  }, [fetchHabits]);

  // Filter habits active on selectedDate
  const activeHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, selectedDate)
  );

  const handleUpdateCompletion = async (id, dateStr, newCount) => {
    try {
      await updateCompletion(id, dateStr, newCount);
    } catch (err) {
      console.error('Error updating completion count:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative pb-24 md:pb-8">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial-gradient rounded-full pointer-events-none filter blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-2xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col mb-8">
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
            Daily Routine
          </h1>
          <p className="text-brand-textSecondary text-xs sm:text-sm font-light uppercase tracking-wider mt-1">
            Track and log your consistency
          </p>
        </div>

        {/* Weekly Calendar Strip */}
        <div className="mb-8">
          <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start justify-between p-4 bg-red-950/20 border border-red-500/25 rounded-2xl text-red-400 text-sm mb-8">
            <div className="flex items-center space-x-2.5">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchHabits}
              className="text-xs font-bold uppercase tracking-wider text-brand-accent hover:underline focus:outline-none"
            >
              Retry
            </button>
          </div>
        )}

        {/* Habits Checklist Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-brand-border/40 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-textSecondary">
              Today's Habits ({activeHabits.length})
            </h2>
          </div>

          {loading && habits.length === 0 ? (
            /* Loading skeletons matching Contra Labs cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-brand-card border border-brand-border/60 rounded-2xl p-5 h-44 animate-pulse flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-brand-border/40 rounded w-2/3"></div>
                    <div className="h-3 bg-brand-border/30 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-brand-border/30 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : activeHabits.length === 0 ? (
            /* Empty State */
            <div className="bg-brand-card border border-brand-border rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center max-w-lg mx-auto mt-6">
              <div className="p-4 bg-brand-bg rounded-full border border-brand-border/80 mb-6">
                <CalendarDays size={32} className="text-brand-textSecondary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">No habits scheduled</h3>
              <p className="text-brand-textSecondary text-xs sm:text-sm font-light max-w-sm mb-6 leading-relaxed">
                There are no active habits configured for this day. Get started by adding a habit or selecting another calendar day.
              </p>
              <button
                onClick={() => navigate('/add-habit')}
                className="flex items-center space-x-2 px-5 py-3 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow hover:shadow-brand-accent/25 focus:outline-none"
              >
                <PlusCircle size={14} />
                <span>Add Habit</span>
              </button>
            </div>
          ) : (
            /* Habits Grid List */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeHabits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  selectedDate={selectedDate}
                  onUpdateCompletion={handleUpdateCompletion}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) for mobile & desktop */}
      <button
        onClick={() => navigate('/add-habit')}
        className="fixed bottom-20 md:bottom-8 right-6 z-30 p-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg rounded-full shadow-glow shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all border border-brand-accent/25 focus:outline-none"
        title="Add new habit"
      >
        <Plus size={24} className="stroke-[3]" />
      </button>
    </div>
  );
};

export default Dashboard;
