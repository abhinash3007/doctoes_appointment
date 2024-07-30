const Appointment = require("../models/appointmentSchema");
const User = require("../models/userSchema");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");

module.exports.createAppointment = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, dob, aadhar_card_no, gender, appointment_date, doctor_firstName, doctor_lastName, department, hasVisited, address } = req.body;

    if (!firstName || !lastName || !email || !phone || !dob || !aadhar_card_no || !gender || !appointment_date || !doctor_firstName || !doctor_lastName || !department || !address) {
        return next(new ErrorHandler("Please fill the full form!", 400));
    }

    const doctor = await User.findOne({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if (!doctor) {
        return next(new ErrorHandler("Doctor not found", 400));
    }

    const patientId = req.user._id;
    const doctorId = doctor._id;

    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        aadhar_card_no,
        gender,
        appointment_date,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        department,
        doctorId,
        patientId,
        hasVisited,
        address,
    });

    res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        appointment,
    });
});
module.exports.getAllApponitments=catchAsyncErrors(async(req,res,next)=>{
    const appointments=await Appointment.find();
    res.status(200).json({
        success:true,
        appointments,
    });
});

module.exports.updateApppointment=catchAsyncErrors(async(req,res,next)=>{
    let appointment=await Appointment.findById(req.params.id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found",400));
    }
    appointment=await Appointment.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
        message:"Appointment updated successfully",
        appointment,
    });
});

