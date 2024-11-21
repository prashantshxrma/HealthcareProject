const express = require("express");
const router = express.Router();

const { registerDoctor, getAllDoctors } = require("../controllers/doctorDetailController");
const { createToken } = require("../middleware/jwtMiddleware");
const { validateJwtToken } = require("../middleware/jwtMiddleware");

// Route for registering a doctor
router.post("/register", registerDoctor, createToken);

// Route for getting all doctors
router.get("/alldoctors", validateJwtToken,getAllDoctors);

module.exports = router;