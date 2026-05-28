import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all habits
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch habits';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single habit
  const fetchHabitById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/habits/${id}`);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch habit details';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new habit
  const addHabit = async (habitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/habits', habitData);
      setHabits((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create habit';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Update a habit
  const updateHabit = async (id, habitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/habits/${id}`, habitData);
      setHabits((prev) => prev.map((h) => (h._id === id ? response.data : h)));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update habit';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Delete a habit
  const deleteHabit = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete habit';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Update completion count for a date
  const updateCompletion = async (id, date, count) => {
    setError(null);
    try {
      const response = await api.patch(`/habits/${id}/complete`, { date, count });
      // Update local state
      setHabits((prev) => prev.map((h) => (h._id === id ? response.data : h)));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update completion count';
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    habits,
    loading,
    error,
    fetchHabits,
    fetchHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    updateCompletion,
  };
};

export default useHabits;
