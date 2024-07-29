const { catchAsyncErrors } = require("./catchAsyncErrors");
const { ErrorHandler } = require("./errorMiddleware");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

module.exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler('You need to be logged in as admin to access this resource', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== 'Admin') {
        return next(new ErrorHandler(`Access denied, not an ${req.user.role}`, 403));
    }
    next();
});

module.exports.isAuthenticatedPatient = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== 'Patient') {
        return next(new ErrorHandler('Access denied, not an ${req.user.role}', 403));
    }
    next();
})