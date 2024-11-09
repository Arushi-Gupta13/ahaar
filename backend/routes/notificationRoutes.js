const express = require('express');
const { startNotificationScheduler } = require('../services/notificationService');
const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    await startNotificationScheduler();
    res.status(200).json({ message: 'Notification scheduler started.' });
  } catch (error) {
    console.error('Error starting notification scheduler:', error);
    res.status(500).json({ error: 'Failed to start notification scheduler' });
  }
});

module.exports = router;