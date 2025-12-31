import express from "express";
import mongoose from "mongoose";
import cors from "cors";

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
    "https://my-crm-ten-tan.vercel.app"
  ],
  credentials: true
}));

/* ---------- Root Test Route ---------- */
app.get("/", (req, res) => {
  res.send("CRM Backend is running");
});

/* ---------- API Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/* ---------- MongoDB Connection ---------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

export default app;
