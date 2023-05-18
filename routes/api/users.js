const express = require('express');
const { login, register, logout, getCurrentUser, patchUserSubscription, getNewToken, verifyEmail, resendEmail } = require('../../controllers/users');
const { authentificateUser } = require('../../middleware/authentificateUser');
const router = express.Router()


router.post("/register",register)
router.get("/verifyEmail",verifyEmail)
router.post("/verifyEmail",resendEmail)
router.post("/verify",resendEmail)
router.post("/login",login)
router.post("/logout",logout)
router.get("/newToken",getNewToken)
router.post("/current",authentificateUser,getCurrentUser)
router.patch("/",authentificateUser,patchUserSubscription)

module.exports=router