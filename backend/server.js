require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const pantryItemsRouter = require('./routes/pantryItems'); // Add this line
const { startNotificationScheduler } = require('./services/notificationService');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Call the database connection function
connectToDatabase();

// Port setup
const PORT = process.env.PORT || 3000;

// Route setup
app.use('/api/notifications', notificationRoutes);
app.use('/api/pantry-items', pantryItemsRouter); // Add this line

// Notification scheduler
startNotificationScheduler();

// Start server with dynamic port fallback if the port is in use
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Start the server
startServer(PORT);

module.exports = app;