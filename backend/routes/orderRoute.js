import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
} from "../controllers/orderController.js";


const orderRouter = express.Router();


// ======================================================
// PLACE ORDER
// POST /api/order/place
// ======================================================

orderRouter.post(
    "/place",
    authMiddleware,
    placeOrder
);


// ======================================================
// VERIFY PAYMENT
// POST /api/order/verify
//
// Stripe payment के बाद verification के लिए
// ======================================================

orderRouter.post(
    "/verify",
    verifyOrder
);


// ======================================================
// GET USER ORDERS
// POST /api/order/userorders
// ======================================================

orderRouter.post(
    "/userorders",
    authMiddleware,
    userOrders
);


// ======================================================
// GET ALL ORDERS - ADMIN
// GET /api/order/list
// ======================================================

orderRouter.get(
    "/list",
    authMiddleware,
    listOrders
);


// ======================================================
// UPDATE ORDER STATUS - ADMIN
// POST /api/order/status
// ======================================================

orderRouter.post(
    "/status",
    authMiddleware,
    updateStatus
);


// ======================================================
// EXPORT
// ======================================================

export default orderRouter;