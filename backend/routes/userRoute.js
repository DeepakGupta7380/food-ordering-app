import express from "express";

import {
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// ===============================
// User Registration
// ===============================
userRouter.post("/register", registerUser);

// ===============================
// User Login
// ===============================
userRouter.post("/login", loginUser);

export default userRouter;