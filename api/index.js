import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Routes
import authRoutes from "../routes/auth.js";
import leadRoutes from "../routes/leads.js";
import futureItemRoutes from "../routes/futureItems.js";

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://clientdesk.vercel.app",
            "https://my-crm-ten-tan.vercel.app"
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
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
app.use("/api/future", futureItemRoutes);

/* ---------- MongoDB Connection ---------- */
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

export default app;
