import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';

dotenv.config();

const seedDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding demo data');

        // 1. Create Demo Admin
        const demoAdminEmail = 'demoadmin@example.com';
        let demoAdmin = await User.findOne({ email: demoAdminEmail });
        if (!demoAdmin) {
            const hashedPassword = await bcrypt.hash('demo123', 10);
            demoAdmin = new User({
                name: 'Demo Admin',
                email: demoAdminEmail,
                password: hashedPassword,
                role: 'admin',
                isDemo: true
            });
            await demoAdmin.save();
            console.log('✅ Demo Admin created');
        } else {
            console.log('ℹ️ Demo Admin already exists');
        }

        // 2. Create Demo Employee
        const demoEmployeeEmail = 'demoemployee@example.com';
        let demoEmployee = await User.findOne({ email: demoEmployeeEmail });
        if (!demoEmployee) {
            const hashedPassword = await bcrypt.hash('demo123', 10);
            demoEmployee = new User({
                name: 'Demo Employee',
                email: demoEmployeeEmail,
                password: hashedPassword,
                role: 'employee',
                isDemo: true
            });
            await demoEmployee.save();
            console.log('✅ Demo Employee created');
        } else {
            console.log('ℹ️ Demo Employee already exists');
        }

        // 3. Create Demo Leads
        const demoLeads = [
            {
                name: 'John Doe (Demo)',
                email: 'john.demo@example.com',
                phone: '1234567890',
                source: 'Demo Source',
                courseName: 'Web Development',
                collegeName: 'Demo University',
                notes: 'This is a demo lead for John Doe.',
                isDemo: true,
                assignedTo: demoAdmin._id,
                addedBy: demoAdmin._id
            },
            {
                name: 'Jane Smith (Demo)',
                email: 'jane.demo@example.com',
                phone: '0987654321',
                source: 'Demo Source',
                courseName: 'Data Science',
                collegeName: 'Demo Institute',
                notes: 'This is a demo lead for Jane Smith.',
                isDemo: true,
                assignedTo: demoEmployee._id,
                addedBy: demoAdmin._id
            },
            {
                name: 'Robert Brown (Demo)',
                email: 'robert.demo@example.com',
                phone: '5556667777',
                source: 'Landing Page',
                courseName: 'Cyber Security',
                collegeName: 'Demo College',
                notes: 'Unassigned demo lead.',
                isDemo: true,
                addedBy: demoAdmin._id
            }
        ];

        for (const leadData of demoLeads) {
            const existingLead = await Lead.findOne({ email: leadData.email });
            if (!existingLead) {
                const lead = new Lead(leadData);
                await lead.save();
                console.log(`✅ Demo Lead created: ${leadData.name}`);
            } else {
                console.log(`ℹ️ Demo Lead already exists: ${leadData.name}`);
            }
        }

        console.log('🏁 Demo data seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDemoData();
