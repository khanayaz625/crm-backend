import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Routes
import authRoutes from "../routes/auth.js";
import leadRoutes from "../routes/leads.js";

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://my-crm-ten-tan.vercel.app",
        "https://my-b33cf45nv-ayaz-khans-projects-ebbf8d73.vercel.app",
        "https://my-awei378g0-ayaz-khans-projects-ebbf8d73.vercel.app",
        "https://my-6g1kd70v-ayaz-khans-projects-ebbf8d73.vercel.app",
        "https://crm-backend-m1f3.onrender.com"
    ],
    credentials: true
}));

/* ---------- Root Test Route ---------- */
app.get("/", (req, res) => {
    res.send("CRM Backend is running");
});

/* ---------- One-Time Setup Route ---------- */
app.get("/setup-admin", async (req, res) => {
    try {
        const email = 'admin@crm.com';
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: 'Admin user already exists', email });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = new User({
            name: 'Admin User',
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await user.save();
        res.json({ message: '✅ Admin user created successfully!', email, password: 'admin123' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ---------- API Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/* ---------- MongoDB Connection ---------- */
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

export default app;
