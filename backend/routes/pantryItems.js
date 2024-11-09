const express = require('express');
const router = express.Router();
const PantryItem = require('../models/PantryItem');

// GET all items
router.get('/', async (req, res) => {
    try {
        const items = await PantryItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new item
router.post('/', async (req, res) => {
    const item = new PantryItem({
        name: req.body.name,
        expiryDate: req.body.expiryDate,
        quantity: req.body.quantity
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});