require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected: ✅'))
  .catch(err => {
      console.error('MongoDB connection error: ❌', err);
      process.exit(1);
  });

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('Task Manager API is running!');
});

// Generic 404 handler for routes not caught by others
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}. Route not found.` });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
