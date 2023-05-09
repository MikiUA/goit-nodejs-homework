const express = require('express');
const { login, register, logout, getCurrentUser, patchUser, getNewToken } = require('../../controllers/users');
const { authentificateUser } = require('../../middleware/authentificateUser');
const router = express.Router()

router.post("/register",login)
router.post("/login",register)
router.post("/logout",logout)
router.get("/newToken",getNewToken)
router.post("/current",authentificateUser,getCurrentUser)
router.patch("/",authentificateUser,patchUser)

module.exports=router