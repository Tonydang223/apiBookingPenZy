const express = require('express')


const router = express.Router()
const authContr = require('../controller/authController')
const {verifyEmailMiddleWare,authVerify} = require('../middlewares/auth')
router.post('/register',authContr.signUp);
router.post('/login',verifyEmailMiddleWare,authContr.login);
router.post('/logout',authContr.logout);
router.post('/verify-email',authContr.verifyEmail);
router.post('/refreshToken',authContr.generatorAccessToken);
router.post('/forgotPass',authContr.forgotPass)
router.post('/resetPass',authContr.resetPassword);
router.post('/resetLink',authContr.resetLink)
router.post('/googleLogin',authContr.loginWithGoogle)





module.exports = router

