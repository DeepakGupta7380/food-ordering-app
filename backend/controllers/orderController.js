import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// ===============================
// Stripe Configuration
// ===============================
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not configured");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Frontend URL
const frontend_url =
  process.env.FRONTEND_URL || "https://tomato-mern-stack.vercel.app";

// ===============================
// Place Order
// ===============================
const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      amount,
      address,
    } = req.body;

    // Check required fields
    if (!userId || !items || !items.length || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "All order details are required",
      });
    }

    // Check user
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create order
    const newOrder = new orderModel({
      userId,
      items,
      amount: Number(amount),
      address,
    });

    await newOrder.save();

    // Create Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity),
    }));

    // Delivery charges
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",

      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Clear cart
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    return res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error placing order",
    });
  }
};

// ===============================
// Verify Order
// ===============================
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!orderId || success === undefined) {
      return res.status(400).json({
        success: false,
        message: "orderId and success are required",
      });
    }

    // Payment successful
    if (success === "true" || success === true) {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        {
          payment: true,
        },
        {
          new: true,
        }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Paid",
      });
    }

    // Payment failed/cancelled
    await orderModel.findByIdAndDelete(orderId);

    return res.status(200).json({
      success: false,
      message: "Not Paid",
    });
  } catch (error) {
    console.error("Verify Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error verifying order",
    });
  }
};

// ===============================
// User Orders
// ===============================
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("User Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
};

// ===============================
// List Orders - Admin
// ===============================
const listOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Check admin
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not admin",
      });
    }

    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("List Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
};

// ===============================
// Update Order Status - Admin
// ===============================
const updateStatus = async (req, res) => {
  try {
    const {
      userId,
      orderId,
      status,
    } = req.body;

    if (!userId || !orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId, orderId and status are required",
      });
    }

    // Check admin
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }

    // Check order
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error updating status",
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};