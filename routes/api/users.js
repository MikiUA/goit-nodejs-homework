const express = require('express');
const { login, register, logout, getCurrentUser, patchUserSubscription, getNewToken, verifyEmail, resendEmail, patchUserAvatar } = require('../../controllers/users');
const { authentificateUser } = require('../../middleware/authentificateUser');
const router = express.Router();
const getValidAvatar = require('../../middleware/getValidAvatar');


router.post("/register",register)
router.get("/verifyEmail",verifyEmail)
router.post("/verifyEmail",resendEmail)
router.post("/verify",resendEmail)
router.post("/login",login)
router.post("/logout",logout)
router.get("/newToken",getNewToken)
router.post("/current",authentificateUser,getCurrentUser)
router.patch("/",authentificateUser,patchUserSubscription)
router.patch("/avatar",authentificateUser,getValidAvatar,patchUserAvatar)
// router.patch("/avatar",authentificateUser,patchUserAvatar)

module.exports=router