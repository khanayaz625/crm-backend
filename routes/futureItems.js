import express from 'express';
import FutureItem from '../models/FutureItem.js';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await FutureItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create item
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newItem = new FutureItem({ title, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete item
router.delete('/:id', async (req, res) => {
    try {
        await FutureItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
