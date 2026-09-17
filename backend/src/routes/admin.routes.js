import express from "express";
import User from "../models/User.js";
import Job from "../utils/Job.js";
import Course from "../models/Course.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);

// GET /api/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const [usersCount, jobsCount, coursesCount] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Course.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        users: usersCount,
        jobs: jobsCount,
        courses: coursesCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Optional backward compatibility
router.get("/dashboard", async (req, res, next) => {
  try {
    const [usersCount, jobsCount, coursesCount] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Course.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        users: usersCount,
        jobs: jobsCount,
        courses: coursesCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =====================
// JOBS ADMIN CRUD
// =====================

// GET /api/admin/jobs
router.get("/jobs", async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/jobs
router.post("/jobs", async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      type,
      description,
      skills,
      applyUrl,
    } = req.body;

    if (!title || !company) {
      return res
        .status(400)
        .json({ success: false, message: "Title and company are required" });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location || "Remote",
      salary: salary || "",
      type: type || "Full-time",
      description: description || "",
      skills: Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      applyUrl: applyUrl || "",
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    next(error);
  }
});

// =====================
// COURSES ADMIN CRUD
// =====================

// GET /api/admin/courses
router.get("/courses", async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/courses
router.post("/courses", async (req, res, next) => {
  try {
    const {
      title,
      provider,
      category,
      price,
      image,
      link,
      description,
      skills,
      level,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Course title is required" });
    }

    const course = await Course.create({
      title: title.trim(),
      provider: provider || "",
      category: category || "",
      price: Number(price) || 0,
      image: image || "",
      link: link || "",
      description: description || "",
      skills: Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      level: level || "beginner",
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/courses/:id
router.delete("/courses/:id", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await course.deleteOne();

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;