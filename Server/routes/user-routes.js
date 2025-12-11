const express = require('express');
const router = express.Router();
const UserModel = require("../models/user-models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/index.js");;

router.post('/register', async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        await UserModel.create(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post('/login',async (req,res) => {
    try{
        // Validate JWT_SECRET exists
        if(!process.env.JWT_SECRET){
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured. Please set it in your .env file.",
            })
        }

        const user = await UserModel.findOne({email : req.body.email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        const isPasswordvalid = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordvalid){
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }
        
        if(user.role !== req.body.role){
            return res.status(400).json({
                success: false,
                message: `You do not have ${req.body.role} access`,
            })
        }
        
        const token = jwt.sign(
            {userId: user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: token,
            role: user.role,
        })

    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred during login",
        })
    }
});

router.get('/get-logged-in-user', middleware,async (req,res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put('/update-profile', middleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;

        // Check if email is already in use by another user
        if (email) {
            const existingUser = await UserModel.findOne({
                email: email,
                _id: { $ne: userId }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use",
                });
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put('/change-password', middleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required",
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;