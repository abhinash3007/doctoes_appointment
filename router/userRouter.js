const express=require("express");
const {registeredUser,userLogin,addNewAdmin, getAllDoctors, getUserDetails, logoutAdmin, logoutUser, addNewDoctor}=require("../controller/userController");
const router = express.Router();
const {isAuthenticatedAdmin,isAuthenticatedPatient}=require("../middlewares/auth")

router.post("/doctor/add", isAuthenticatedAdmin, addNewDoctor);

router.post("/register" ,registeredUser);
router.post("/login" ,userLogin);
router.post("/admin",isAuthenticatedAdmin,addNewAdmin);
router.get("/doctor" ,getAllDoctors);
router.get("/admin/me",isAuthenticatedAdmin,getUserDetails);
router.get("/register/me",isAuthenticatedPatient,getUserDetails);
router.get("/admin/logout",isAuthenticatedAdmin,logoutAdmin);
router.get("/register/logout" ,isAuthenticatedPatient,logoutUser);



module.exports=router;