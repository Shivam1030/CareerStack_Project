import express from "express";
import Income from "../models/Income.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/income
router.get("/", protect, async (req, res, next) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    const total = incomes.reduce((sum, item) => sum + item.amount, 0);

    res.json({ success: true, incomes, total });
  } catch (error) {
    next(error);
  }
});

// POST /api/income
router.post("/", protect, async (req, res, next) => {
  try {
    const { source, amount, category, note, date } = req.body;

    if (!source || amount === undefined || amount === null) {
      return res
        .status(400)
        .json({ success: false, message: "Source and amount are required" });
    }

    const income = await Income.create({
      user: req.user._id,
      source: source.trim(),
      amount: Number(amount),
      category: category || "other",
      note: note || "",
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, income });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/income/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income entry not found" });
    }

    await income.deleteOne();

    res.json({ success: true, message: "Income entry deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;