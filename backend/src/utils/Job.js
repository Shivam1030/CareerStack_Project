import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "Remote", trim: true },
    salary: { type: String, default: "", trim: true },
    type: { type: String, default: "Full-time", trim: true },
    description: { type: String, default: "", trim: true },
    skills: { type: [String], default: [] },
    applyUrl: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);