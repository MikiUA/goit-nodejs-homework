const express = require('express');
const { login, register, logout, getCurrentUser, patchUserSubscription, getNewToken } = require('../../controllers/users');
const { authentificateUser } = require('../../middleware/authentificateUser');
const router = express.Router()

router.post("/register",login)
router.post("/login",register)
router.post("/logout",logout)
router.get("/newToken",getNewToken)
router.post("/current",authentificateUser,getCurrentUser)
router.patch("/",authentificateUser,patchUserSubscription)

module.exports=router