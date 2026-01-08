import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true }, // Sparse allows null/undefined to be non-unique (if not provided/legacy)
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
