// import jwt from "jsonwebtoken";


// // ===============================
// // Authentication Middleware
// // ===============================

// const authMiddleware = (req, res, next) => {
//     try {

//         // ===============================
//         // Get Authorization Header
//         // ===============================

//         const authHeader = req.headers.authorization;


//         if (!authHeader) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Not Authorized. Please Login Again",
//             });
//         }


//         // ===============================
//         // Check Bearer Format
//         // ===============================

//         if (!authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid Authorization Format",
//             });
//         }


//         // ===============================
//         // Get Token
//         // ===============================

//         const token = authHeader.substring(7).trim();


//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token is missing",
//             });
//         }


//         // ===============================
//         // Check JWT Secret
//         // ===============================

//         if (!process.env.JWT_SECRET) {

//             console.error(
//                 "JWT_SECRET is missing"
//             );

//             return res.status(500).json({
//                 success: false,
//                 message: "JWT_SECRET is not configured",
//             });
//         }


//         // ===============================
//         // Verify Token
//         // ===============================

//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );


//         // ===============================
//         // Check User ID
//         // ===============================

//         if (!decoded || !decoded.id) {

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token payload",
//             });
//         }


//         // ===============================
//         // Set User ID
//         // ===============================

//         req.userId = decoded.id;


//         // ===============================
//         // Debug
//         // ===============================

//         console.log(
//             "Authenticated User ID:",
//             req.userId
//         );


//         // ===============================
//         // Continue
//         // ===============================

//         next();

//     } catch (error) {

//         console.error(
//             "Auth Middleware Error:",
//             error.name,
//             error.message
//         );


//         // ===============================
//         // Token Expired
//         // ===============================

//         if (error.name === "TokenExpiredError") {

//             return res.status(401).json({
//                 success: false,
//                 message: "Token expired. Please login again",
//             });
//         }


//         // ===============================
//         // Invalid JWT
//         // ===============================

//         if (error.name === "JsonWebTokenError") {

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token. Please login again",
//             });
//         }


//         // ===============================
//         // Other Authentication Error
//         // ===============================

//         return res.status(401).json({
//             success: false,
//             message: "Authentication failed. Please login again",
//         });
//     }
// };


// export default authMiddleware;




import jwt from "jsonwebtoken";


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authMiddleware = (req, res, next) => {
    try {

        // =================================================
        // Get Authorization Header
        // =================================================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message:
                    "Not Authorized. Please Login Again",
            });
        }


        // =================================================
        // Check Bearer Format
        // =================================================

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid Authorization Format. Use Bearer Token",
            });
        }


        // =================================================
        // Get Token
        // =================================================

        const token =
            authHeader.slice(7).trim();


        if (!token) {

            return res.status(401).json({
                success: false,
                message:
                    "Token is missing. Please login again",
            });
        }


        // =================================================
        // Check JWT Secret
        // =================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "ERROR: JWT_SECRET is missing in environment variables"
            );

            return res.status(500).json({
                success: false,
                message:
                    "JWT_SECRET is not configured on server",
            });
        }


        // =================================================
        // Verify JWT Token
        // =================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =================================================
        // Check Decoded Token
        // =================================================

        if (!decoded) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid token",
            });
        }


        // =================================================
        // Check User ID
        // =================================================

        if (!decoded.id) {

            console.error(
                "Invalid JWT Payload:",
                decoded
            );

            return res.status(401).json({
                success: false,
                message:
                    "User ID not found in token",
            });
        }


        // =================================================
        // Set User ID
        // =================================================

        req.userId = decoded.id;


        // =================================================
        // Store Decoded User Data
        // =================================================

        req.user = decoded;


        // =================================================
        // Debug Information
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "AUTHENTICATION SUCCESS"
        );

        console.log(
            "User ID:",
            req.userId
        );

        console.log(
            "================================="
        );


        // =================================================
        // Continue to Next Middleware
        // =================================================

        next();


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "AUTH MIDDLEWARE ERROR"
        );

        console.error(
            "Error Name:",
            error.name
        );

        console.error(
            "Error Message:",
            error.message
        );

        console.error(
            "================================="
        );


        // =================================================
        // Token Expired
        // =================================================

        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Token expired. Please login again",
            });
        }


        // =================================================
        // Invalid Token
        // =================================================

        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid token. Please login again",
            });
        }


        // =================================================
        // JWT Not Active
        // =================================================

        if (
            error.name === "NotBeforeError"
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Token is not active yet",
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