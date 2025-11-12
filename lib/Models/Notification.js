import mongoose, { models, model, Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    from: { type: String, required: false },
    to: { type: String, required: false },
    msg: { type: String, required: false },
    isRead: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

export default models.Notification || model("Notification", NotificationSchema);
