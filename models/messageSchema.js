const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: [true, "Message is required"],
    }
});

module.exports = mongoose.model('Message', messageSchema);
