import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('CRM Backend is running');
});

// Import Routes
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import futureItemRoutes from './routes/futureItems.js';

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/future', futureItemRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
