import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ===============================
// Place Order
// ===============================
orderRouter.post(
  "/place",
  authMiddleware,
  placeOrder
);

// ===============================
// Verify Payment
// ===============================
orderRouter.post(
  "/verify",
  verifyOrder
);

// ===============================
// Update Order Status - Admin
// ===============================
orderRouter.post(
  "/status",
  authMiddleware,
  updateStatus
);

// ===============================
// Get User Orders
// ===============================
orderRouter.post(
  "/userorders",
  authMiddleware,
  userOrders
);

// ===============================
// Get All Orders - Admin
// ===============================
orderRouter.get(
  "/list",
  authMiddleware,
  listOrders
);

export default orderRouter;