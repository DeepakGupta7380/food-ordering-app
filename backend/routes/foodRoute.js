import express from "express";
import multer from "multer";
import path from "path";

import {
    addFood,
    listFood,
    removeFood,
} from "../controllers/foodController.js";

import authMiddleware from "../middleware/auth.js";


const foodRouter = express.Router();


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },


    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, uniqueName);
    },

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];


    if (
        allowedTypes.includes(file.mimetype)
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};


// =====================================================
// MULTER UPLOAD
// =====================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});


// =====================================================
// ADD FOOD
// =====================================================

foodRouter.post(
    "/add",

    // 1. Check JWT
    authMiddleware,

    // 2. Upload image + parse FormData
    upload.single("image"),

    // 3. Controller
    addFood
);


// =====================================================
// LIST ALL FOOD
// =====================================================

foodRouter.get(
    "/list",
    listFood
);


// =====================================================
// REMOVE FOOD
// =====================================================

foodRouter.post(
    "/remove",

    // Check JWT
    authMiddleware,

    // Remove food
    removeFood
);


// =====================================================
// MULTER ERROR HANDLER
// =====================================================

foodRouter.use(
    (error, req, res, next) => {

        console.error(
            "Food Route Error:",
            error
        );


        // File too large
        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code === "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Image size must be less than 5MB",
                });

            }


            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Image upload error",
            });
        }


        // Invalid file type
        if (error) {

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "File upload error",
            });
        }


        next();
    }
);


// =====================================================
// EXPORT
// =====================================================

export default foodRouter;