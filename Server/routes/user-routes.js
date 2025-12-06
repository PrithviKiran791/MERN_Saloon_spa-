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
        const userId = req.userId;
        const user = await UserModel.findOne({email : req.body.email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        const isPasswordvald = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordvalid){
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }
        // Jwt token generation can be added here for session managamenet 
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

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
});

router.get('get-logged-in-user', middleware,async (req,res) => {
    try {
        const userId = req.body.userId;
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
            data: user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})
module.exports = router;