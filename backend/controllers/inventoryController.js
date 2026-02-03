const InventoryItem = require('../models/InventoryItem');

// @desc    Get all inventory items for logged in user
// @route   GET /api/inventory
// @access  Private
const getItems = async (req, res, next) => {
    try {
        const items = await InventoryItem.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user owns the item
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(item);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
const createItem = async (req, res, next) => {
    try {
        const { name, description, quantity, price, category, sku } = req.body;

        const item = await InventoryItem.create({
            name,
            description,
            quantity,
            price,
            category,
            sku,
            user: req.user.id
        });

        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
const updateItem = async (req, res, next) => {
    try {
        let item = await InventoryItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user owns the item
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(item);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user owns the item
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await item.deleteOne();

        res.json({ message: 'Item removed', id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
};
