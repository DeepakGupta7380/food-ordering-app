import express from "express";

import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

// ===============================
// Add Item to Cart
// ===============================
cartRouter.post(
  "/add",
  authMiddleware,
  addToCart
);

// ===============================
// Remove Item from Cart
// ===============================
cartRouter.post(
  "/remove",
  authMiddleware,
  removeFromCart
);

// ===============================
// Get User Cart
// ===============================
cartRouter.post(
  "/get",
  authMiddleware,
  getCart
);

export default cartRouter;