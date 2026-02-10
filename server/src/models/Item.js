const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, index: true },
    description: { type: String },
    slug: { type: String, unique: true, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// Simple text index for MongoDB text search
itemSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Item", itemSchema);

