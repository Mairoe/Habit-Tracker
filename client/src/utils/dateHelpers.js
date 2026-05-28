import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  parseISO,
} from 'date-fns';

// Format date to API key YYYY-MM-DD
export const formatDateKey = (date) => {
  return format(date, 'yyyy-MM-dd');
};

// Generate list of 7 days for the current week starting on Monday
export const getWeekDays = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Map JS day index to Mon-Sun abbreviation
export const getDayAbbr = (date) => {
  const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayMap[date.getDay()];
};

// Check if a habit is active on a given date
export const isHabitActiveOnDate = (habit, targetDate) => {
  const target = startOfDay(targetDate);
  const start = startOfDay(new Date(habit.startDate));

  // 1. Before start date
  if (isBefore(target, start) && !isSameDay(target, start)) {
    return false;
  }

  // 2. After end date (if exists)
  if (habit.endDate) {
    const end = startOfDay(new Date(habit.endDate));
    if (isAfter(target, end)) {
      return false;
    }
  }

  // 3. Daily frequency
  if (habit.frequency === 'daily') {
    const diffDays = differenceInCalendarDays(target, start);
    return diffDays % (habit.everyNDays || 1) === 0;
  }

  // 4. Weekly frequency
  if (habit.frequency === 'weekly') {
    // Check week interval repeat
    const diffWeeks = differenceInCalendarWeeks(target, start, { weekStartsOn: 1 });
    const isTargetWeek = diffWeeks % (habit.repeatEveryNWeeks || 1) === 0;
    
    if (!isTargetWeek) {
      return false;
    }

    // Check specific days of week
    if (habit.daysOfWeek && habit.daysOfWeek.length > 0) {
      const dayName = getDayAbbr(targetDate);
      return habit.daysOfWeek.includes(dayName);
    }

    // If no specific days are set, it's active every day of that repeating week
    return true;
  }

  return false;
};

// Calculate current streak, longest streak, and total completions
export const calculateStreakStats = (completions, startDate, targetTimes = 1) => {
  // completions is a map or object: { "YYYY-MM-DD": count }
  const completionsObj = completions instanceof Map 
    ? Object.fromEntries(completions) 
    : completions || {};

  const datesWithCompletions = Object.keys(completionsObj)
    .filter(dateStr => completionsObj[dateStr] >= targetTimes)
    .sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)

  if (datesWithCompletions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompletions: 0 };
  }

  // Calculate total completions (sum of counts)
  let totalCompletions = 0;
  Object.values(completionsObj).forEach(val => {
    totalCompletions += val;
  });

  const todayStr = formatDateKey(new Date());
  const yesterdayStr = formatDateKey(addDays(new Date(), -1));

  // Determine current streak
  let currentStreak = 0;
  let hasToday = completionsObj[todayStr] >= targetTimes;
  let hasYesterday = completionsObj[yesterdayStr] >= targetTimes;

  // Streak continues if completed today or yesterday
  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date() : addDays(new Date(), -1);
    let checkStr = formatDateKey(checkDate);

    while (completionsObj[checkStr] >= targetTimes) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
      checkStr = formatDateKey(checkDate);
    }
  }

  // Determine longest streak
  // Sort dates ascending
  const sortedDates = Object.keys(completionsObj)
    .filter(dateStr => completionsObj[dateStr] >= targetTimes)
    .map(dStr => new Date(dStr))
    .sort((a, b) => a - b);

  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const diff = differenceInCalendarDays(currentDate, lastDate);
      if (diff === 1) {
        tempStreak++;
      } else if (diff > 1) {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
    lastDate = currentDate;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalCompletions
  };
};
