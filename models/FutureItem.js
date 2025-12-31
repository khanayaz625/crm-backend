import mongoose from 'mongoose';

const FutureItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FutureItem', FutureItemSchema);
