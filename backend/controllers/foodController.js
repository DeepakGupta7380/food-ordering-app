import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs/promises";

// ===============================
// Add Food
// ===============================
const addFood = async (req, res) => {
    try {
        const { userId, name, description, price, category } = req.body;

        // Check required fields
        if (!userId || !name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Food image is required",
            });
        }

        // Check admin
        const userData = await userModel.findById(userId);

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

        // Create food
        const food = new foodModel({
            name,
            description,
            price: Number(price),
            category,
            image: req.file.filename,
        });

        await food.save();

        return res.status(201).json({
            success: true,
            message: "Food Added",
            data: food,
        });
    } catch (error) {
        console.error("Add Food Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Error adding food",
        });
    }
};

// ===============================
// List All Foods
// ===============================
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: foods,
        });
    } catch (error) {
        console.error("List Food Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching foods",
        });
    }
};

// ===============================
// Remove Food
// ===============================
const removeFood = async (req, res) => {
    try {
        const { userId, id } = req.body;

        if (!userId || !id) {
            return res.status(400).json({
                success: false,
                message: "userId and food id are required",
            });
        }

        // Check admin
        const userData = await userModel.findById(userId);

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

        // Find food
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found",
            });
        }

        // Delete image
        try {
            await fs.unlink(`uploads/${food.image}`);
        } catch (fileError) {
            console.log("Image delete warning:", fileError.message);
        }

        // Delete food
        await foodModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Food Removed",
        });
    } catch (error) {
        console.error("Remove Food Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Error removing food",
        });
    }
};

export { addFood, listFood, removeFood };



