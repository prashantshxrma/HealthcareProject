const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "please add your name"],
        },
        email: {
            type: String,
            require: [true, "please add your Email"],
        },
        speciality: {
            type: String,
            require: [true, "please add your speciality"],
        },
        phoneNumber: {
            type: String,
            require: [true, "please add your Phone Numbeer"],
        },
        experience: {
            type: String,
            require: [true, "please add your experience"],
        },
        address: {
            type: String,
            require: [true, "please add your address"],
        },
    },
    {
        timestamps: true,
    }
); 
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;