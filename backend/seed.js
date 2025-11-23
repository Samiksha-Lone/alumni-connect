const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./src/models/user.model');

async function ensureAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Main Admin';

    if (!adminEmail || !adminPassword) {
        return;
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) return;

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
            role: 'admin',
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
        });
    } catch (err) {
        console.error('Error ensuring admin user:', err);
    }
}

module.exports = { ensureAdmin };
