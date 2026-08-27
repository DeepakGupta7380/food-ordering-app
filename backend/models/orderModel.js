import mongoose from "mongoose";

// ===============================
// Order Schema
// ===============================
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    items: {
      type: Array,
      required: true,
      default: [],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Food Processing",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Food Processing",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    payment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// Order Model
// ===============================
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;