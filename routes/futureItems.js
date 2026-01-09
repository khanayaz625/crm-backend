import express from 'express';
import FutureItem from '../models/FutureItem.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all items
router.get('/', verifyToken, async (req, res) => {
    try {
        const query = { isDemo: req.user.isDemo || false };
        const items = await FutureItem.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create item
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newItem = new FutureItem({ title, description, isDemo: req.user.isDemo || false });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete item
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const item = await FutureItem.findOneAndDelete({ _id: req.params.id, isDemo: req.user.isDemo || false });
        if (!item) return res.status(404).json({ message: 'Item not found or access denied' });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
