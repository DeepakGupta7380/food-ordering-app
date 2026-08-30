import express from "express";
import multer from "multer";


import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";

import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// ===============================
// Image Storage
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ===============================
// Multer Upload
// ===============================
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ===============================
// Food Routes
// ===============================

// Add Food
foodRouter.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  addFood
);

// Get All Foods
foodRouter.get(
  "/list",
  listFood
);

// Remove Food
foodRouter.post(
  "/remove",
  authMiddleware,
  removeFood
);

export default foodRouter;


