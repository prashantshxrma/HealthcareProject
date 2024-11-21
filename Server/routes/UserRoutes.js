const { createToken } = require("../middleware/jwtMiddleware");
const { validateJwtToken } = require("../middleware/jwtMiddleware");
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser, createToken);
router.get("/myaccount",validateJwtToken,getUserProfile);
router.patch("/myaccount",validateJwtToken,updateUserProfile);
module.exports = router;