const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorDetailModel");
const { createToken } = require("../middleware/jwtMiddleware"); // Import the createToken function

// Register a new doctor
const registerDoctor = asyncHandler(async (req, res) => {
    const { name, email, speciality, phoneNumber, experience, address } = req.body;

    if (!name || !email || !speciality || !phoneNumber || !experience || !address) {
        res.status(400);
        throw new Error("Please provide all fields");
    }

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
        return res.status(400).json({ message: "Doctor already exists" });
    }

    const doctor = await Doctor.create({
        name,
        email,
        speciality,
        phoneNumber,
        experience,
        address
    });

    // Generate token after successful registration
    const token = createToken({ id: doctor._id, name: doctor.name, email: doctor.email });

    res.status(201).json({
        message: "Doctor registered successfully",
        doctor,
        token // Send the token in the response
    });
});

// Get all doctors (secured route)
const getAllDoctors = asyncHandler(async (req, res) => {
    try {
        // Only proceed if the token is valid
        // You can implement the validateJwtToken middleware in the route

        const doctors = await Doctor.find({}); // Exclude password from response
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving doctors", error });
    }
});

module.exports = {
    registerDoctor,
    getAllDoctors
};