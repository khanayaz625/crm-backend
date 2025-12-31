import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const admin = await User.findOne({ email: 'admin@crm.com' });
        if (admin) {
            console.log('✅ Admin user found:', admin.email);
        } else {
            console.log('❌ Admin user NOT found');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
