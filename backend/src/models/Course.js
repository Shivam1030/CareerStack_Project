import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    price: { type: Number, default: 0 },
    image: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },

    // Added for skill-based recommendations
    skills: { type: [String], default: [] },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);