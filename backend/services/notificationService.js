const nodeCron = require('node-cron');
const PantryItem = require('../models/PantryItem');  // assuming this model contains pantry items with expiry dates
const { sendEmail } = require('../utils/emailService');  // utility to send emails or push notifications

// Define the threshold in days for notifying users (e.g., 3 days before expiry)
const EXPIRY_NOTIFICATION_THRESHOLD_DAYS = 3;
const checkForExpiringItems = async () => {
    try {
      // Get the current date and the threshold date for notifications
      const currentDate = new Date();
      const notificationDate = new Date();
      notificationDate.setDate(currentDate.getDate() + EXPIRY_NOTIFICATION_THRESHOLD_DAYS);
  
      // Find items where expiryDate is within the threshold
      const expiringItems = await PantryItem.find({
        expiryDate: { $lte: notificationDate, $gte: currentDate }
      }).populate('owner');  // assuming each PantryItem has an 'owner' field that references a User
  
      // Send notifications for each item found
      expiringItems.forEach(item => {
        sendExpiryReminder(item.owner.email, item.name, item.expiryDate);
      });
    } catch (error) {
      console.error('Error checking for expiring items:', error);
    }
  };
  const sendExpiryReminder = (userEmail, itemName, expiryDate) => {
    const message = `
      Hello,
      Just a reminder that your item "${itemName}" is expiring on ${expiryDate.toDateString()}.
      Please use it soon to avoid food waste!
    `;
    sendEmail(userEmail, 'Item Expiry Reminder', message);
  };
  const startNotificationScheduler = () => {
    nodeCron.schedule('* * * * *', async () => {
        console.log('Running notification job every minute for testing...');
        await checkForExpiringItems();
      });
      
  };
  
  module.exports = { startNotificationScheduler };
      