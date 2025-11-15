const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./src/models/user.model');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'admin@alumni.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
            await mongoose.connection.close();
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            role: 'admin',
            name: 'Admin User',
            email: 'admin@alumni.com',
            password: hashedPassword,
        });

        console.log('Admin user created: admin@alumni.com / admin123');
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding admin:', err);
        await mongoose.connection.close();
    }
}

seedAdmin();
