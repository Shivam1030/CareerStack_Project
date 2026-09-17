import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// GET /api/courses?skill=...
router.get("/", async (req, res, next) => {
  try {
    const { skill } = req.query;
    const filter = {};

    if (skill) {
      filter.skills = { $in: [new RegExp(`^${skill}$`, "i")] };
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
});

export default router;