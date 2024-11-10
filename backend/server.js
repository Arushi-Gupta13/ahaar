require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const pantryItemsRouter = require('./routes/pantryItems');
const { startNotificationScheduler } = require('./services/notificationService');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection
const connectToDatabase = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Call the database connection function
connectToDatabase();

// Port setup
const PORT = process.env.PORT || 5000;

// Route setup
app.use('/api/notifications', notificationRoutes);
app.use('/api/pantry-items', pantryItemsRouter);

// Start server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

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

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0); // Exit with success
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0); // Exit with success
    });
});

// Start the notification scheduler
startNotificationScheduler();
