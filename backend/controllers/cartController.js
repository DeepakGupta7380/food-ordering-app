import userModel from "../models/userModel.js";

// ===============================
// Add Item to Cart
// ===============================
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Check required fields
    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "userId and itemId are required",
      });
    }

    // Find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get cart data
    const cartData = userData.cartData || {};

    // Add item
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    // Update cart
    await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Added to Cart",
      cartData,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error adding item to cart",
    });
  }
};

// ===============================
// Remove Item from Cart
// ===============================
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Check required fields
    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "userId and itemId are required",
      });
    }

    // Find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get cart data
    const cartData = userData.cartData || {};

    // Check item exists
    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Decrease quantity
    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId];
    }

    // Update cart
    await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Removed from Cart",
      cartData,
    });
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error removing item from cart",
    });
  }
};

// ===============================
// Get User Cart
// ===============================
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    return res.status(200).json({
      success: true,
      cartData,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching cart",
    });
  }
};

export { addToCart, removeFromCart, getCart };