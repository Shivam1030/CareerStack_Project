import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import incomeRoutes from "./routes/income.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import seedAdmin from "./utils/seedAdmin.js";

dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "*",
    credentials: true,  
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await seedAdmin();
  } catch (err) {
    console.error("Admin seed failed:", err.message);
  }
});