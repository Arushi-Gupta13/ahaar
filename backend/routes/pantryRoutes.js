const express = require('express');
const { addItem, updateItem, deleteItem, getItems } = require('../controllers/pantryController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addItem);
router.get('/', authMiddleware, getItems);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;
