import express from "express";
import Job from "../utils/Job.js";

const router = express.Router();

// GET /api/jobs?search=...&skill=...
router.get("/", async (req, res, next) => {
  try {
    const { search, skill } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (skill) {
      filter.skills = { $in: [new RegExp(`^${skill}$`, "i")] };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
});

export default router;