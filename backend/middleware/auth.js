

import jwt from "jsonwebtoken";

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authMiddleware = (req, res, next) => {
    try {

        // =================================================
        // 1. Check JWT Secret
        // =================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing in environment variables"
            );

            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured on server",
            });
        }


        // =================================================
        // 2. Get Authorization Header
        // =================================================

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please Login Again",
            });
        }


        // =================================================
        // 3. Check Bearer Format
        // =================================================

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid Authorization Format. Use Bearer Token",
            });
        }


        // =================================================
        // 4. Get Token
        // =================================================

        const token = authHeader.slice(7).trim();

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Token is missing. Please login again",
            });
        }


        // =================================================
        // 5. Verify JWT Token
        // =================================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // =================================================
        // 6. Validate Decoded Token
        // =================================================

        if (!decoded || typeof decoded !== "object") {

            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }


        // =================================================
        // 7. Check User ID
        // =================================================

        if (!decoded.id) {

            console.error(
                "Invalid JWT Payload:",
                decoded
            );

            return res.status(401).json({
                success: false,
                message: "User ID not found in token",
            });
        }


        // =================================================
        // 8. Store User ID in Request
        // =================================================

        req.userId = decoded.id;


        // =================================================
        // 9. Store Decoded User Data
        // =================================================

        req.user = decoded;


        // =================================================
        // 10. Authentication Successful
        // =================================================

        console.log(
            "Authentication successful. User ID:",
            req.userId
        );


        // =================================================
        // 11. Continue
        // =================================================

        next();

    } catch (error) {

        console.error(
            "Auth Middleware Error:",
            error.name,
            error.message
        );


        // =================================================
        // Token Expired
        // =================================================

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again",
            });
        }


        // =================================================
        // Invalid Token
        // =================================================

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again",
            });
        }


        // =================================================
        // Token Not Active
        // =================================================

        if (error.name === "NotBeforeError") {

            return res.status(401).json({
                success: false,
                message: "Token is not active yet",
            });
        }


        // =================================================
        // Other Authentication Error
        // =================================================

        return res.status(401).json({
            success: false,
            message:
                "Authentication failed. Please login again",
        });
    }
};

export default authMiddleware;