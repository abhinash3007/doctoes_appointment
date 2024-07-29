const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const User=require("../models/userSchema");
const {ErrorHandler}=require("../middlewares/errorMiddleware");
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;

module.exports.registeredUser=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,dob,aadhar_card_no,gender,password,role}=req.body;
    if(!firstName || !lastName || !email || !phone || !dob || !aadhar_card_no || !gender || !password || !role){
        return next(new ErrorHandler('Please fill the full form!', 400));
    }
    const userExits=await User.findOne({email});
    if(userExits){
        return next(new ErrorHandler("User already exits!",400));
    }
    const user=await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        aadhar_card_no,
        gender,
        password,
        role
    })
    sendToken(user, 201, res);
})
module.exports.userLogin=catchAsyncErrors(async(req,res,next)=>{
    const {email,password,role}=req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler('Please provide the full details!', 400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",400));
    }
    const isPasswordMatched=await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",400));
    }
    if(role!=user.role){
        return next(new ErrorHandler("User with role not found!",400));
    }
    sendToken(user, 201, res);
})

const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    const cookieName=user.role=="Admin"?"adminToken" :"patientToken";
    res.status(statusCode).cookie(cookieName,token,{
        expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true,
    }).json({
        success:true,
        user,
        token
    }); 
}
module.exports.addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, dob, aadhar_card_no, gender, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !dob || !aadhar_card_no || !gender || !password) {
        return next(new ErrorHandler('Please fill the full form!', 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role } already exists with this email!`, 200));
    }
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        aadhar_card_no,
        gender,
        password,
        role: "Admin"
    });
    res.status(200).json({
        success: "true",
        message: "New Admin Registered"
    });
});
module.exports.getAllDoctors=catchAsyncErrors(async(req,res,next)=>{
    const doctor=await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctor
    })
});
module.exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    })
});
module.exports.logoutAdmin=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"Admin logged out succesfully",
    })
});

module.exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "User logged out successfully",
    });
});
module.exports.addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || !req.files.docAvatar) {
      return next(new ErrorHandler("Doctor avatar is required!", 400));
    }
  
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File format not supported!", 400));
    }
  
    const { firstName, lastName, email, phone, password, dob, aadhar_card_no, gender, doctorDepartment } = req.body;
    if (!firstName || !lastName || !email || !phone || !dob || !aadhar_card_no || !gender || !password || !doctorDepartment) {
      return next(new ErrorHandler("Please provide the full details!", 400));
    }
  
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
    }
  
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath, {
      folder: "doctor_avatars",
    });
  
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error:", cloudinaryResponse.error || "unknown error");
      return next(new ErrorHandler("Failed to upload doctor avatar to Cloudinary", 500));
    }
  
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      aadhar_card_no,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
  
    res.status(200).json({
      success: true,
      message: "New Doctor Registered",
      doctor,
    });
  });
