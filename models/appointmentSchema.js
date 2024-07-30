const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); 
            },
            message: "Phone number must contain 10 digits",
        },
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"],
    },
    aadhar_card_no: {
        type: String,
        required: [true, "AADHAR number is required"],
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v);
            },
            message: "AADHAR number must contain 12 digits",
        },
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    appointment_date: {
        type: String,
        required: true,
    },
    doctor: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    department: {
        type: String,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    hasVisited: {
        type: Boolean,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
