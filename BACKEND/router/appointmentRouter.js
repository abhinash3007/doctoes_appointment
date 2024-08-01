const express=require("express");
const router=express.Router();
const {isAuthenticatedAdmin,isAuthenticatedPatient}=require("../middlewares/auth")
const {createAppointment,getAllApponitments,updateApppointment, deleteAppointment}=require("../controller/appointmentController");

router.post("/post",isAuthenticatedPatient,createAppointment);
router.get("/get/appointment",isAuthenticatedAdmin,getAllApponitments);
router.put("/update/:id",isAuthenticatedAdmin,updateApppointment);
router.delete("/delete/:id",deleteAppointment);

module.exports=router;