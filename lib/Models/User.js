import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    resume: { type: String, required: false },
    companyDetails: {
      type: {
        name: { type: String },
        registeredYear: { type: String },
        size: { type: String },
        address: { type: String },
        landMark: { type: String },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
