import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
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
    // Check Bearer Token
    // ===============================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format",
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // ===============================
    // Verify Token
    // ===============================
    const token_decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ===============================
    // Set User ID
    // ===============================
    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;