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

// GET single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await PantryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await PantryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    try {
        await PantryItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;