import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: { type: String, default: 'Landing Page' }, // e.g., 'Landing Page', 'Manual'
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'], default: 'New' },
    notes: { type: String },
    courseName: { type: String },
    collegeName: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', leadSchema);
