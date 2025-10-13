import mongoose, { Schema } from "mongoose";
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
