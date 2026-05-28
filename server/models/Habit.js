const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true,
  },
  everyNDays: {
    type: Number,
    default: 1,
  },
  daysOfWeek: {
    type: [String],
    default: [], // e.g. ["Mon", "Wed", "Fri"]
  },
  timesPerDay: {
    type: Number,
    default: 1,
  },
  repeatEveryNWeeks: {
    type: Number,
    default: 1,
  },
  endDate: {
    type: Date,
  },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Anytime'],
    default: 'Anytime',
  },
  reminderEnabled: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: String, // e.g. "08:30"
  },
  completions: {
    type: Map,
    of: Number,
    default: new Map(), // e.g. { "2026-05-25": 1 }
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Habit', HabitSchema);
