import mongoose from "mongoose";

// ===============================
// Food Schema
// ===============================
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// Food Model
// ===============================
const foodModel =
  mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;