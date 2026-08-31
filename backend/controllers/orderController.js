import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


// Stripe Configuration


if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not configured");
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;


// Frontend URL


const frontend_url =
  "https://food-ordering-app-virid-six.vercel.app";



// Place Order


const placeOrder = async (req, res) => {
  try {

    // =================================================
    // Get authenticated User ID
    // =================================================

    const userId = req.userId;

    const {
      items,
      amount,
      address,
    } = req.body;


    // =================================================
    // Authentication Check
    // =================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    // =================================================
    // Check Items
    // =================================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }


    // =================================================
    // Check Amount
    // =================================================

    if (
      amount === undefined ||
      amount === null ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid order amount is required",
      });
    }


    // =================================================
    // Check Address
    // =================================================

    if (
      !address ||
      typeof address !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }


    // =================================================
    // Required Address Fields
    // =================================================

    const requiredAddressFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];


    for (const field of requiredAddressFields) {

      if (
        !address[field] ||
        String(address[field]).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }


    // =================================================
    // Check Stripe Configuration
    // =================================================

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured",
      });
    }


    // =================================================
    // Check User
    // =================================================

    const userData =
      await userModel.findById(userId);


    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // =================================================
    // Validate Order Items
    // =================================================

    for (const item of items) {

      if (
        !item._id ||
        !item.name ||
        item.price === undefined ||
        item.quantity === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order item details",
        });
      }


      if (
        Number(item.price) < 0 ||
        Number(item.quantity) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid item price or quantity",
        });
      }
    }


    // =================================================
    // Calculate Item Total
    // =================================================

    const itemsTotal = items.reduce(
      (total, item) => {
        return (
          total +
          Number(item.price) *
          Number(item.quantity)
        );
      },
      0
    );


    // =================================================
    // Delivery Fee
    // =================================================

    const deliveryFee = 2;


    const calculatedAmount =
      itemsTotal + deliveryFee;


    // =================================================
    // Check Amount
    // =================================================

    if (
      Math.abs(
        Number(amount) - calculatedAmount
      ) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: "Order amount is incorrect",
      });
    }


    // =================================================
    // Create Order
    // =================================================

    const newOrder = new orderModel({
      userId: userId,
      items: items,
      amount: calculatedAmount,
      address: address,
    });


    await newOrder.save();


    console.log(
      "Order Created:",
      newOrder._id
    );


    // =================================================
    // Create Stripe Line Items
    // =================================================

    const line_items = items.map((item) => {

      const price =
        Math.round(
          Number(item.price) * 100
        );


      return {
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
          },

          unit_amount: price,
        },

        quantity:
          Number(item.quantity),
      };
    });


    // =================================================
    // Add Delivery Charges
    // =================================================

    line_items.push({
      price_data: {
        currency: "usd",

        product_data: {
          name: "Delivery Charges",
        },

        unit_amount: 200,
      },

      quantity: 1,
    });


    // =================================================
    // Create Stripe Checkout Session
    // =================================================

    const session =
      await stripe.checkout.sessions.create({
        line_items: line_items,

        mode: "payment",

        success_url:
          `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

        cancel_url:
          `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });


    // =================================================
    // Clear User Cart
    // =================================================

    await userModel.findByIdAndUpdate(
      userId,
      {
        cartData: {},
      }
    );


    // =================================================
    // Success Response
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Order placed successfully",

      session_url:
        session.url,

      orderId:
        newOrder._id,
    });

  } catch (error) {

    console.error(
      "Place Order Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error placing order",
    });
  }
};


// =====================================================
// Verify Order
// =====================================================

const verifyOrder = async (req, res) => {
  try {

    const {
      orderId,
      success,
    } = req.body;


    // =================================================
    // Check Required Data
    // =================================================

    if (
      !orderId ||
      success === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "orderId and success are required",
      });
    }


    // =================================================
    // Payment Successful
    // =================================================

    if (
      success === true ||
      success === "true"
    ) {

      const order =
        await orderModel.findByIdAndUpdate(
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


    // =================================================
    // Payment Failed
    // =================================================

    await orderModel.findByIdAndDelete(
      orderId
    );


    return res.status(200).json({
      success: false,
      message: "Not Paid",
    });

  } catch (error) {

    console.error(
      "Verify Order Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error verifying order",
    });
  }
};


// =====================================================
// User Orders
// =====================================================

const userOrders = async (req, res) => {
  try {

    // User ID comes from auth middleware
    const userId = req.userId;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    const orders =
      await orderModel
        .find({
          userId: userId,
        })
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {

    console.error(
      "User Orders Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error fetching orders",
    });
  }
};


// =====================================================
// List Orders - Admin
// =====================================================

const listOrders = async (req, res) => {
  try {

    // Admin ID from auth middleware
    const userId = req.userId;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    // =================================================
    // Check Admin
    // =================================================

    const userData =
      await userModel.findById(userId);


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


    // =================================================
    // Get All Orders
    // =================================================

    const orders =
      await orderModel
        .find({})
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {

    console.error(
      "List Orders Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error fetching orders",
    });
  }
};


// =====================================================
// Update Order Status - Admin
// =====================================================

const updateStatus = async (req, res) => {
  try {

    const {
      orderId,
      status,
    } = req.body;


    // Admin ID from auth middleware
    const userId = req.userId;


    // =================================================
    // Check User
    // =================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    // =================================================
    // Check Required Fields
    // =================================================

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message:
          "orderId and status are required",
      });
    }


    // =================================================
    // Check Admin
    // =================================================

    const userData =
      await userModel.findById(userId);


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


    // =================================================
    // Check Order
    // =================================================

    const order =
      await orderModel.findById(orderId);


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    // =================================================
    // Update Status
    // =================================================

    order.status = status;

    await order.save();


    return res.status(200).json({
      success: true,

      message:
        "Status Updated Successfully",

      data: order,
    });

  } catch (error) {

    console.error(
      "Update Status Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error updating status",
    });
  }
};


// =====================================================
// Export Controllers
// =====================================================

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};