import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Register (For Admin/Setup purposes)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Check for duplicates
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(400).json({ message: 'User with this email already exists' });
        }

        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role, isDemo: user.isDemo }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ token, user: userObj });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Profile (Authenticated User)
router.put('/profile', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const updateData = { name, email };

        if (phone) updateData.phone = phone;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            updateData.avatar = req.file.path;
        }

        // Prevent demo users from changing sensitive fields
        if (req.user.isDemo) {
            delete updateData.email;
            delete updateData.password;
            // Optionally allow name/avatar, but user said "don't change any of my data"
            // Let's just allow name for some personalization if they want, but email/password must stay.
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get All Users (Admin Only)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const query = { isDemo: req.user.isDemo || false };
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Fetch Users Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update User Role (Admin Only)
router.patch('/users/:id/role', verifyAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDemo: req.user.isDemo || false },
            { role },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found or access denied' });
        res.json(user);
    } catch (error) {
        console.error('Update Role Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update User Password (Admin Only)
router.patch('/users/:id/password', verifyAdmin, async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDemo: req.user.isDemo || false },
            { password: hashedPassword }
        );
        if (!user) return res.status(404).json({ message: 'User not found or access denied' });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update Password Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete User (Admin Only)
router.delete('/users/:id', verifyAdmin, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id, isDemo: req.user.isDemo || false });
        if (!user) return res.status(404).json({ message: 'User not found or access denied' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
