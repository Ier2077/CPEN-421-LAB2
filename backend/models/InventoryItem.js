const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true,
        enum: {
            values: ['Electronics', 'Clothing', 'Food', 'Furniture', 'Tools', 'Other'],
            message: '{VALUE} is not a valid category'
        }
    },
    sku: {
        type: String,
        required: [true, 'Please add a SKU'],
        trim: true,
        uppercase: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
inventoryItemSchema.index({ user: 1, name: 1 });
inventoryItemSchema.index({ user: 1, sku: 1 }, { unique: true }); // SKU unique per user

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
