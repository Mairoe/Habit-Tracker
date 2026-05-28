const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Habit Tracker API is running' });
});

// Database Connection and Server Startup
const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;
  
  // Try connecting to standard MONGO_URI first. If it fails, or if it's local, we can fall back to in-memory.
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log('Local MongoDB connection failed. Starting in-memory MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${inMemoryUri}`);
      
      await mongoose.connect(inMemoryUri);
      console.log('Successfully connected to in-memory MongoDB.');
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (inMemErr) {
      console.error('Failed to start in-memory MongoDB:', inMemErr.message);
      process.exit(1);
    }
  }
};

startServer();
