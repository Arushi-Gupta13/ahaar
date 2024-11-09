require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const { startNotificationScheduler } = require('./services/notificationService');

// Start the notification scheduler
startNotificationScheduler();

// ... existing code ...

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy. Trying ${PORT + 1}`);
      server.listen(PORT + 1);
    } else {
      console.error('Server error:', err);
    }
  });