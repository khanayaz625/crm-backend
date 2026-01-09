import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true, required: true },
    source: { type: String, default: 'Landing Page' },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'], default: 'New' },
    notes: { type: String },
    courseName: { type: String, required: true },
    collegeName: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDemo: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', leadSchema);
