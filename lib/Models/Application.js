import mongoose, { model, models, Schema } from "mongoose";
const ApplicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Job",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  uploadedResume: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "under review", "shortlisted", "rejected", "withdrawn"],
    defualt: "applied",
  },
});

export default models.Application || model("Application", ApplicationSchema);
