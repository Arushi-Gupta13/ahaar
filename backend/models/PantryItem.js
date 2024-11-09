const mongoose = require('mongoose');

// Define the schema
const pantryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

// Create and export the model
const PantryItem = mongoose.model('PantryItem', pantryItemSchema);

// Optional: Function to seed initial data
async function seedPantryItems() {
    const initialItems = [
        // Your items here
    ];

    try {
        await PantryItem.insertMany(initialItems);
        console.log('Initial pantry items seeded');
    } catch (error) {
        console.error('Error seeding pantry items:', error);
    }
}

// Export only the model
module.exports = PantryItem;
