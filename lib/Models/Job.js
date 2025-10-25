import mongoose, { Schema } from "mongoose";
const JobSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    experience: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
