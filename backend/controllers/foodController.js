import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs/promises";
import path from "path";


// =====================================================
// ADD FOOD
// =====================================================

const addFood = async (req, res) => {
    try {
        console.log("=================================");
        console.log("ADD FOOD REQUEST");
        console.log("User ID:", req.userId);
        console.log("Body:", req.body);
        console.log("File:", req.file);
        console.log("=================================");


        // =================================================
        // Get User ID
        // =================================================
        // Different middleware versions may store the ID
        // in different places, so support all common cases.

        const userId =
            req.userId ||
            req.body?.userId ||
            req.user?.id;


        // =================================================
        // Get Food Data
        // =================================================

        const name =
            typeof req.body?.name === "string"
                ? req.body.name.trim()
                : "";

        const description =
            typeof req.body?.description === "string"
                ? req.body.description.trim()
                : "";

        const price =
            req.body?.price;

        const category =
            typeof req.body?.category === "string"
                ? req.body.category.trim()
                : "";


        // =================================================
        // Check User ID
        // =================================================

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "User ID missing. Please login again",
            });
        }


        // =================================================
        // Check Food Name
        // =================================================

        if (!name) {
            return res.status(400).json({
                success: false,
                message:
                    "Food name is required",
            });
        }


        // =================================================
        // Check Description
        // =================================================

        if (!description) {
            return res.status(400).json({
                success: false,
                message:
                    "Food description is required",
            });
        }


        // =================================================
        // Check Price
        // =================================================

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Food price is required",
            });
        }


        const foodPrice = Number(price);


        if (
            !Number.isFinite(foodPrice) ||
            foodPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid food price",
            });
        }


        // =================================================
        // Check Category
        // =================================================

        if (!category) {
            return res.status(400).json({
                success: false,
                message:
                    "Food category is required",
            });
        }


        // =================================================
        // Check Image
        // =================================================

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Food image is required",
            });
        }


        // =================================================
        // Find User
        // =================================================

        const userData =
            await userModel.findById(userId);


        if (!userData) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }


        // =================================================
        // Check Admin
        // =================================================

        if (userData.role !== "admin") {
            return res.status(403).json({
                success: false,
                message:
                    "Only admin can add food items",
            });
        }


        // =================================================
        // Create Food
        // =================================================

        const food = new foodModel({
            name: name,
            description: description,
            price: foodPrice,
            category: category,
            image: req.file.filename,
        });


        // =================================================
        // Save Food
        // =================================================

        await food.save();


        // =================================================
        // Success Response
        // =================================================

        return res.status(201).json({
            success: true,
            message:
                "Food Added Successfully",
            data: food,
        });


    } catch (error) {

        console.error(
            "Add Food Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Error adding food",
        });
    }
};



// =====================================================
// LIST ALL FOODS
// =====================================================

const listFood = async (req, res) => {
    try {

        const foods =
            await foodModel
                .find({})
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({
            success: true,
            data: foods,
        });


    } catch (error) {

        console.error(
            "List Food Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Error fetching foods",
        });
    }
};



// =====================================================
// REMOVE FOOD
// =====================================================

const removeFood = async (req, res) => {
    try {

        // =================================================
        // Get User ID
        // =================================================

        const userId =
            req.userId ||
            req.body?.userId ||
            req.user?.id;


        // =================================================
        // Get Food ID
        // =================================================

        const id =
            req.body?.id ||
            req.body?.foodId;


        // =================================================
        // Check User ID
        // =================================================

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "User ID missing. Please login again",
            });
        }


        // =================================================
        // Check Food ID
        // =================================================

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Food id is required",
            });
        }


        // =================================================
        // Find User
        // =================================================

        const userData =
            await userModel.findById(userId);


        if (!userData) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }


        // =================================================
        // Check Admin
        // =================================================

        if (userData.role !== "admin") {
            return res.status(403).json({
                success: false,
                message:
                    "Only admin can remove food items",
            });
        }


        // =================================================
        // Find Food
        // =================================================

        const food =
            await foodModel.findById(id);


        if (!food) {
            return res.status(404).json({
                success: false,
                message:
                    "Food not found",
            });
        }


        // =================================================
        // Delete Image
        // =================================================

        if (food.image) {

            try {

                const imagePath =
                    path.join(
                        process.cwd(),
                        "uploads",
                        food.image
                    );


                await fs.unlink(
                    imagePath
                );


                console.log(
                    "Food image deleted:",
                    imagePath
                );


            } catch (fileError) {

                // If image does not exist,
                // don't stop food deletion.

                if (
                    fileError.code ===
                    "ENOENT"
                ) {

                    console.log(
                        "Image already deleted or not found"
                    );

                } else {

                    console.log(
                        "Image delete warning:",
                        fileError.message
                    );
                }
            }
        }


        // =================================================
        // Delete Food
        // =================================================

        await foodModel.findByIdAndDelete(
            id
        );


        // =================================================
        // Success Response
        // =================================================

        return res.status(200).json({
            success: true,
            message:
                "Food Removed Successfully",
        });


    } catch (error) {

        console.error(
            "Remove Food Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Error removing food",
        });
    }
};



// =====================================================
// EXPORT
// =====================================================

export {
    addFood,
    listFood,
    removeFood,
};