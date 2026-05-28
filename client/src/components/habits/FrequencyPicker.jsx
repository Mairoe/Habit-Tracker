import React from 'react';
import Counter from '../shared/Counter';

export const FrequencyPicker = ({
  frequency,
  setFrequency,
  everyNDays,
  setEveryNDays,
  daysOfWeek,
  setDaysOfWeek,
  timesPerDay,
  setTimesPerDay,
  repeatEveryNWeeks,
  setRepeatEveryNWeeks,
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day, e) => {
    e.preventDefault();
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Frequency Toggle */}
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
          Frequency Type
        </label>
        <div className="flex bg-brand-bg border border-brand-border rounded-xl p-1 w-max">
          <button
            type="button"
            onClick={() => setFrequency('daily')}
            className={`px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all focus:outline-none ${
              frequency === 'daily'
                ? 'bg-brand-accent text-brand-bg shadow-glow'
                : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setFrequency('weekly')}
            className={`px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all focus:outline-none ${
              frequency === 'weekly'
                ? 'bg-brand-accent text-brand-bg shadow-glow'
                : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Conditionally render settings based on frequency */}
      {frequency === 'daily' ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <Counter
            label="Every N Days"
            value={everyNDays}
            onChange={setEveryNDays}
            min={1}
            max={30}
          />
          <Counter
            label="Times Per Day"
            value={timesPerDay}
            onChange={setTimesPerDay}
            min={1}
            max={20}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Days of week selector */}
          <div className="flex flex-col space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
              Active Days of the Week
            </label>
            <div className="flex flex-wrap gap-2">
              {days.map((day, idx) => {
                const isSelected = daysOfWeek.includes(day);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => toggleDay(day, e)}
                    className={`
                      px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all focus:outline-none border
                      ${
                        isSelected
                          ? 'bg-brand-accentCyan text-brand-bg border-none shadow-glow-cyan scale-105'
                          : 'border-brand-border/60 text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-border'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Counter
              label="Repeat Every N Weeks"
              value={repeatEveryNWeeks}
              onChange={setRepeatEveryNWeeks}
              min={1}
              max={12}
            />
            <Counter
              label="Times Per Selected Day"
              value={timesPerDay}
              onChange={setTimesPerDay}
              min={1}
              max={20}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyPicker;
