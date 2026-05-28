const Habit = require('../models/Habit');

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Server error, failed to fetch habits' });
  }
};

// @desc    Get single habit by ID
// @route   GET /api/habits/:id
// @access  Private
exports.getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Error fetching habit detail:', error);
    res.status(500).json({ message: 'Server error, failed to fetch habit details' });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
exports.createHabit = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      frequency,
      everyNDays,
      daysOfWeek,
      timesPerDay,
      repeatEveryNWeeks,
      endDate,
      timeOfDay,
      reminderEnabled,
      reminderTime,
    } = req.body;

    if (!name || !frequency) {
      return res.status(400).json({ message: 'Habit name and frequency are required' });
    }

    const habit = new Habit({
      userId: req.user.id,
      name,
      description,
      startDate,
      frequency,
      everyNDays,
      daysOfWeek,
      timesPerDay,
      repeatEveryNWeeks,
      endDate,
      timeOfDay,
      reminderEnabled,
      reminderTime,
      completions: {}, // Starts empty
    });

    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error, failed to create habit', error: error.message });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
exports.updateHabit = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      frequency,
      everyNDays,
      daysOfWeek,
      timesPerDay,
      repeatEveryNWeeks,
      endDate,
      timeOfDay,
      reminderEnabled,
      reminderTime,
    } = req.body;

    let habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    // Update fields
    if (name !== undefined) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (startDate !== undefined) habit.startDate = startDate;
    if (frequency !== undefined) habit.frequency = frequency;
    if (everyNDays !== undefined) habit.everyNDays = everyNDays;
    if (daysOfWeek !== undefined) habit.daysOfWeek = daysOfWeek;
    if (timesPerDay !== undefined) habit.timesPerDay = timesPerDay;
    if (repeatEveryNWeeks !== undefined) habit.repeatEveryNWeeks = repeatEveryNWeeks;
    if (endDate !== undefined) habit.endDate = endDate;
    if (timeOfDay !== undefined) habit.timeOfDay = timeOfDay;
    if (reminderEnabled !== undefined) habit.reminderEnabled = reminderEnabled;
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Server error, failed to update habit', error: error.message });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    res.json({ message: 'Habit deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server error, failed to delete habit' });
  }
};

// @desc    Update completion count for a date
// @route   PATCH /api/habits/:id/complete
// @access  Private
exports.completeHabit = async (req, res) => {
  try {
    const { date, count } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required (YYYY-MM-DD)' });
    }

    if (count === undefined || typeof count !== 'number') {
      return res.status(400).json({ message: 'Count must be a number' });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    // Update completions map
    if (count <= 0) {
      habit.completions.delete(date);
    } else {
      habit.completions.set(date, count);
    }

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ message: 'Server error, failed to update completion count', error: error.message });
  }
};
