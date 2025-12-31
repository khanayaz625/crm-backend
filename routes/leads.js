import express from 'express';
import Lead from '../models/Lead.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get All Leads (Filtered by role)
router.get('/', verifyToken, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user.id;
        }

        const leads = await Lead.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Lead (Public for Landing Page)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, source, courseName, collegeName } = req.body;
        const lead = new Lead({ name, email, phone, source, courseName, collegeName });
        await lead.save();
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Lead Status
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign Leads to Employee (Admin Only)
router.post('/assign', verifyAdmin, async (req, res) => {
    try {
        const { leadIds, userId } = req.body;
        if (!leadIds || (userId === undefined)) {
            return res.status(400).json({ message: 'Lead IDs are required' });
        }

        const updateValue = userId === '' || userId === null ? null : userId;

        await Lead.updateMany(
            { _id: { $in: leadIds } },
            { $set: { assignedTo: updateValue } }
        );

        res.json({ message: 'Leads assigned successfully' });
    } catch (error) {
        console.error('Assignment Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Lead Details
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, email, phone, notes, courseName, collegeName } = req.body;
        const lead = await Lead.findByIdAndUpdate(req.params.id, { name, email, phone, notes, courseName, collegeName }, { new: true });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Lead
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Only admin or the assigned user can delete? 
        // For now, let's stick to the existing logic but add verifyToken.
        // Usually only admins delete.
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
