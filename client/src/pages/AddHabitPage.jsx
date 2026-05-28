import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addDays, startOfDay } from 'date-fns';
import useHabits from '../hooks/useHabits';
import DatePicker from '../components/shared/DatePicker';
import FrequencyPicker from '../components/habits/FrequencyPicker';
import Counter from '../components/shared/Counter';
import { ArrowLeft, Save, Bell, Calendar, Clock, AlertCircle } from 'lucide-react';

export const AddHabitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addHabit, updateHabit, fetchHabitById, loading, error } = useHabits();

  // Check if edit mode
  const editId = new URLSearchParams(location.search).get('edit');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [startDateOpt, setStartDateOpt] = useState('today'); // 'today', 'tomorrow', 'custom'
  const [customStartDate, setCustomStartDate] = useState(new Date());

  const [frequency, setFrequency] = useState('daily'); // 'daily', 'weekly'
  const [everyNDays, setEveryNDays] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [repeatEveryNWeeks, setRepeatEveryNWeeks] = useState(1);

  const [endDateOpt, setEndDateOpt] = useState('none'); // 'none', 'custom'
  const [customEndDate, setCustomEndDate] = useState(addDays(new Date(), 30));

  const [timeOfDay, setTimeOfDay] = useState('Anytime'); // 'Morning', 'Afternoon', 'Evening', 'Anytime'
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:30');

  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load habit details if editing
  useEffect(() => {
    if (editId) {
      const loadHabit = async () => {
        try {
          const habit = await fetchHabitById(editId);
          setName(habit.name);
          setDescription(habit.description || '');
          
          // Determine start date option
          const hStart = startOfDay(new Date(habit.startDate));
          const today = startOfDay(new Date());
          const tomorrow = startOfDay(addDays(new Date(), 1));

          if (hStart.getTime() === today.getTime()) {
            setStartDateOpt('today');
          } else if (hStart.getTime() === tomorrow.getTime()) {
            setStartDateOpt('tomorrow');
          } else {
            setStartDateOpt('custom');
            setCustomStartDate(new Date(habit.startDate));
          }

          setFrequency(habit.frequency);
          setEveryNDays(habit.everyNDays || 1);
          setDaysOfWeek(habit.daysOfWeek || []);
          setTimesPerDay(habit.timesPerDay || 1);
          setRepeatEveryNWeeks(habit.repeatEveryNWeeks || 1);

          if (habit.endDate) {
            setEndDateOpt('custom');
            setCustomEndDate(new Date(habit.endDate));
          } else {
            setEndDateOpt('none');
          }

          setTimeOfDay(habit.timeOfDay || 'Anytime');
          setReminderEnabled(habit.reminderEnabled || false);
          setReminderTime(habit.reminderTime || '08:30');
        } catch (err) {
          setSubmitError('Failed to load habit details for editing.');
        }
      };
      loadHabit();
    }
  }, [editId, fetchHabitById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setSubmitError('Habit name is required.');
      return;
    }

    setSubmitError('');
    setIsSaving(true);

    // Calculate final start date
    let startDate = new Date();
    if (startDateOpt === 'tomorrow') {
      startDate = addDays(new Date(), 1);
    } else if (startDateOpt === 'custom') {
      startDate = customStartDate;
    }

    // Calculate end date
    const endDate = endDateOpt === 'custom' ? customEndDate : null;

    const payload = {
      name,
      description,
      startDate,
      frequency,
      timesPerDay,
      timeOfDay,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : '',
      endDate,
      // Clear frequency-specific fields if not matching
      everyNDays: frequency === 'daily' ? everyNDays : 1,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : [],
      repeatEveryNWeeks: frequency === 'weekly' ? repeatEveryNWeeks : 1,
    };

    try {
      if (editId) {
        await updateHabit(editId, payload);
      } else {
        await addHabit(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save habit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generated reminder description
  const reminderLabel = reminderEnabled
    ? `Notification: "Time to complete ${name || 'your habit'}" will fire daily at ${reminderTime}.`
    : '';

  return (
    <div className="min-h-screen bg-brand-bg relative pb-16">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial-gradient rounded-full pointer-events-none filter blur-2xl"></div>
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-2xl"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-brand-card hover:bg-brand-border text-brand-textPrimary rounded-xl transition-colors border border-brand-border focus:outline-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-white">
              {editId ? 'Edit Habit' : 'Create New Habit'}
            </h1>
            <p className="text-brand-textSecondary text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-0.5">
              {editId ? 'Update your current routine' : 'Define a new behavior loop'}
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {(submitError || error) && (
          <div className="flex items-start space-x-2.5 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-red-400 text-sm mb-8">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{submitError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1 - Basic Info */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 1 — Basic Info
            </h2>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Habit Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Meditation, Read Books"
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your motivation or specifics of this routine..."
                rows={3}
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
              />
            </div>
          </section>

          {/* SECTION 2 - Start Date */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 2 — Start Date
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                {['today', 'tomorrow', 'custom'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStartDateOpt(opt)}
                    className={`
                      px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus:outline-none border
                      ${
                        startDateOpt === opt
                          ? 'bg-brand-accent text-brand-bg border-none shadow-glow'
                          : 'border-brand-border/60 text-brand-textSecondary hover:text-brand-textPrimary'
                      }
                    `}
                  >
                    {opt === 'today' ? 'Today' : opt === 'tomorrow' ? 'Tomorrow' : 'Custom Date'}
                  </button>
                ))}
              </div>

              {startDateOpt === 'custom' && (
                <div className="pt-2 animate-fadeIn">
                  <DatePicker
                    value={customStartDate}
                    onChange={setCustomStartDate}
                    label="Choose custom start date"
                  />
                </div>
              )}
            </div>
          </section>

          {/* SECTION 3 - Frequency */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 3 — Frequency
            </h2>
            <FrequencyPicker
              frequency={frequency}
              setFrequency={setFrequency}
              everyNDays={everyNDays}
              setEveryNDays={setEveryNDays}
              daysOfWeek={daysOfWeek}
              setDaysOfWeek={setDaysOfWeek}
              timesPerDay={timesPerDay}
              setTimesPerDay={setTimesPerDay}
              repeatEveryNWeeks={repeatEveryNWeeks}
              setRepeatEveryNWeeks={setRepeatEveryNWeeks}
            />
          </section>

          {/* SECTION 4 - Repeat / Duration */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 4 — Duration
            </h2>
            <div className="space-y-4">
              {frequency === 'weekly' && (
                <Counter
                  label="Repeat Every N Weeks"
                  value={repeatEveryNWeeks}
                  onChange={setRepeatEveryNWeeks}
                  min={1}
                  max={12}
                />
              )}

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                  End Date Option
                </label>
                <div className="flex bg-brand-bg border border-brand-border rounded-xl p-1 w-max">
                  <button
                    type="button"
                    onClick={() => setEndDateOpt('none')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all focus:outline-none ${
                      endDateOpt === 'none'
                        ? 'bg-brand-accent text-brand-bg shadow-glow'
                        : 'text-brand-textSecondary hover:text-brand-textPrimary'
                    }`}
                  >
                    No End Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndDateOpt('custom')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all focus:outline-none ${
                      endDateOpt === 'custom'
                        ? 'bg-brand-accent text-brand-bg shadow-glow'
                        : 'text-brand-textSecondary hover:text-brand-textPrimary'
                    }`}
                  >
                    Specific End Date
                  </button>
                </div>
              </div>

              {endDateOpt === 'custom' && (
                <div className="pt-2">
                  <DatePicker
                    value={customEndDate}
                    onChange={setCustomEndDate}
                    label="Choose custom end date"
                  />
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5 - Time of Day */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 5 — Time of Day
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeOfDay(time)}
                  className={`
                    px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus:outline-none border
                    ${
                      timeOfDay === time
                        ? 'bg-brand-accent text-brand-bg border-none shadow-glow'
                        : 'border-brand-border/60 text-brand-textSecondary hover:text-brand-textPrimary'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 6 - Reminders */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent mb-2">
              SECTION 6 — Reminders
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide">Enable Reminder Notifications</span>
                <span className="text-xs text-brand-textSecondary font-light">Get alerted when it is time to check off this habit.</span>
              </div>
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`
                  relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                  ${reminderEnabled ? 'bg-brand-accent' : 'bg-brand-border'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out
                    ${reminderEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {reminderEnabled && (
              <div className="pt-4 space-y-4 border-t border-brand-border/40 animate-fadeIn flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-brand-accentCyan" />
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-brand-bg border border-brand-border text-white text-sm font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent/50"
                  />
                </div>
                {reminderLabel && (
                  <p className="text-xs text-brand-accentCyan font-medium flex items-center gap-1.5 pt-1">
                    <Bell size={12} />
                    <span>{reminderLabel}</span>
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving || loading}
            className="group flex items-center justify-center space-x-2.5 w-full py-4 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/60 text-brand-bg font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-glow hover:shadow-brand-accent/25 hover:scale-[1.005] focus:outline-none"
          >
            {isSaving || loading ? (
              <div className="w-5 h-5 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={16} />
                <span>{editId ? 'Save Updates' : 'Publish Habit'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitPage;
