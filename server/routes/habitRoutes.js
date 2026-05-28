const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getHabits,
  createHabit,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
} = require('../controllers/habitController');

// All routes are protected by authMiddleware
router.use(authMiddleware);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .get(getHabitById)
  .put(updateHabit)
  .delete(deleteHabit);

router.patch('/:id/complete', completeHabit);

module.exports = router;
