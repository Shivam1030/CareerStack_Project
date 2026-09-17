import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    source: { type: String, required: true, trim: true },

    amount: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: ["freelance", "internship", "part-time", "stipend", "other"],
      default: "other",
    },

    note: { type: String, default: "", trim: true, maxlength: 300 },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Income", incomeSchema);