const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
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
            validator: function(v) {
                return /^\d{10}$/.test(v); // Check if phone number has 10 digits
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
            validator: function(v) {
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
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must contain at least 8 characters"],
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient","Doctor"],
    },
    doctorDepartment: {
        type: String,
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);
