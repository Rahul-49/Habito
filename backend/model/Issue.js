import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["fraud", "incorrect_info", "duplicate_listing", "offensive_content"],
      required: true,
    },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "under_review", "resolved"],
      default: "pending",
      index: true,
    },
    notes: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Issue", IssueSchema);
