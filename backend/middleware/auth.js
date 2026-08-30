
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ===============================
    // Get Authorization Header
    // ===============================
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please Login Again",
      });
    }

    // ===============================
    // Check Bearer Format
    // ===============================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format",
      });
    }

    // ===============================
    // Get Token
    // ===============================
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // ===============================
    // Check JWT Secret
    // ===============================
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    // ===============================
    // Verify Token
    // ===============================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ===============================
    // Set User ID
    // ===============================
    req.userId = decoded.id;

    // ===============================
    // Continue
    // ===============================
    next();

  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error.name,
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again",
    });
  }
};

export default authMiddleware;

