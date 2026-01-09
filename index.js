// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ⚠ uploads folder is NOT persistent on Vercel
// // app.use("/uploads", express.static("uploads"));

// // MongoDB connection (cached)
// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     isConnected = true;
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB error:", err);
//   }
// };

// // Ensure DB is connected before routes
// app.use(async (req, res, next) => {
//   await connectDB();
//   next();
// });

// // Routes
// import authRoutes from "./routes/auth.js";
// import leadRoutes from "./routes/leads.js";
// import futureItemRoutes from "./routes/futureItems.js";

// app.get("/", (req, res) => {
//   res.send("CRM Backend is running on Vercel");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/leads", leadRoutes);
// app.use("/api/future", futureItemRoutes);

// // ❌ NO app.listen()
// // ✅ Export app
// export default app;


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://clientdesk.vercel.app",
            "https://my-crm-ten-tan.vercel.app"
        ];
        // Allow requests with no origin (like mobile apps or curl) 
        // or if origin is in the list or ends with .vercel.app
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('CRM Backend is running');
});

// Import Routes
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import futureItemRoutes from './routes/futureItems.js';

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/future', futureItemRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
