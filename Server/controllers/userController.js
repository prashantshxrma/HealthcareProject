const asyncHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const User=require("../models/userModel");
require("dotenv").config();
const { createToken } = require("../middleware/jwtMiddleware");

const registerUser =asyncHandler(async(req,res)=>{
    const{name,email,password,phoneNumber}=req.body;


    if(!name || !email || !password || !phoneNumber){
        res.status(400);
        throw new Error("Please provide all fields");
    }

    const userExists=await User.findOne({email});
    if(userExists){
        return res.status(400).json({message : "User already exists"});
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const user=await User.create({
        name,
        email,
        phoneNumber,
        password:hashedPassword,
    });

    res.status(201).json({message:"user registered successfully",user})
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Password did not match" });
    }

    // Generate the token after successful login
    const token = createToken({ id: user._id, name: user.name, email: user.email });

    // Send response with user data and the token
    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
        },
        token, // Include the token in the response
    });
});
const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const email=req.body;
        const data = await User.findOne({ email });

        if (!data) {
            return res.status(401).json({ message: "User not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name,email, phoneNumber,password } = req.body;

    try {
        const user = await User.findOne(email);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!name || !email || !password || !phoneNumber) {
            res.status(400);
            throw new Error("Please provide all fields");
        }

        user.name = name;
        user.phoneNumber = phoneNumber;
        user.email=email;
        user.password=password;

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports={
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
}
