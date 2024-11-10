const nodeCron = require('node-cron');
const PantryItem = require('../models/PantryItem.js');
const { sendEmail } = require('../utils/emailService');

const EXPIRY_NOTIFICATION_THRESHOLD_DAYS = process.env.EXPIRY_THRESHOLD_DAYS || 3; // Set default threshold if not in env
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *'; // Default to every minute for testing

// Function to check for expiring items
const checkForExpiringItems = async () => {
    try {
        const currentDate = new Date();
        const notificationDate = new Date();
        notificationDate.setDate(currentDate.getDate() + EXPIRY_NOTIFICATION_THRESHOLD_DAYS);

        // Find pantry items expiring within the threshold
        const expiringItems = await PantryItem.find({
            expiryDate: { $lte: notificationDate, $gte: currentDate }
        }).populate('owner');

        // For each expiring item, send a reminder email
        expiringItems.forEach(item => {
            sendExpiryReminder(item.owner.email, item.name, item.expiryDate);
        });
    } catch (error) {
        console.error('Error checking for expiring items:', error);
    }
};

// Function to send expiry reminder email
const sendExpiryReminder = (userEmail, itemName, expiryDate) => {
    const message = `
        Hello,
        Just a reminder that your item "${itemName}" is expiring on ${expiryDate.toDateString()}.
        Please use it soon to avoid food waste!
    `;

    // Check if we're in development or production environment
    if (process.env.NODE_ENV === 'development') {
        // For testing in development, send emails to your personal email
        sendEmail("arushigarg1344@gmail.com", 'Item Expiry Reminder', message);
    } else {
        // In production, send to the user's email address
        sendEmail(userEmail, 'Item Expiry Reminder', message);
    }
};

// Schedule the notification job (frequency set by CRON_SCHEDULE)
const startNotificationScheduler = () => {
    nodeCron.schedule(CRON_SCHEDULE, async () => {
        console.log('Running notification job...');
        await checkForExpiringItems();
    });
};

module.exports = { startNotificationScheduler, checkForExpiringItems };
