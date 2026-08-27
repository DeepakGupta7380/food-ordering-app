import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// ===============================
// Create JWT Token
// ===============================
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Create token
    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login Error",
    });
  }
};

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
    }

    // Validate email
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check existing user
    const exists = await userModel.findOne({
      email: cleanEmail,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Salt rounds
    const saltRounds = Number(process.env.SALT) || 10;

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    // Create user
    const newUser = new userModel({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    const user = await newUser.save();

    // Create token
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration Error",
    });
  }
};

export { loginUser, registerUser };