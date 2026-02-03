const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

// Validation middleware for creating/updating items
const validateItem = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    body('category')
        .isIn(['Electronics', 'Clothing', 'Food', 'Furniture', 'Tools', 'Other'])
        .withMessage('Invalid category'),
    body('sku').trim().notEmpty().withMessage('SKU is required')
];

// Validation error handler
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// All routes are protected
router.use(protect);

// Routes
router.route('/')
    .get(getItems)
    .post(validateItem, handleValidation, createItem);

router.route('/:id')
    .get(getItem)
    .put(validateItem, handleValidation, updateItem)
    .delete(deleteItem);

module.exports = router;
