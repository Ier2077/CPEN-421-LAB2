require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        console.log('=== ALL USERS ===');
        const users = await User.find({}, 'name email');
        users.forEach(u => console.log(`${u.name} - ${u.email} (ID: ${u._id})`));

        console.log('\n=== ALL INVENTORY ITEMS ===');
        const items = await InventoryItem.find({});
        if (items.length === 0) {
            console.log('No items found in database');
        } else {
            items.forEach(i => console.log(`${i.name} | SKU: ${i.sku} | Qty: ${i.quantity} | User: ${i.user}`));
        }

        console.log('\n=== SUMMARY ===');
        console.log(`Total Users: ${users.length}`);
        console.log(`Total Items: ${items.length}`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
