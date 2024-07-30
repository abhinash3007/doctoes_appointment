const express = require('express');
const { sendMessage,getAllMessage } = require('../controller/messageController');
const router = express.Router();
const {isAuthenticatedAdmin}=require("../middlewares/auth")

router.post('/send', sendMessage);
router.get("/get/message",isAuthenticatedAdmin,getAllMessage)

module.exports = router;
