const {catchAsyncErrors}=require("../middlewares/catchAsyncErrors");
const Message = require('../models/messageSchema');

const { ErrorHandler } = require('../middlewares/errorMiddleware');

module.exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler('Please fill the full form!', 400));
    }
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
        success: true,
        message: 'Message Sent!',
    });
});
