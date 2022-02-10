const express = require('express')


const router = express.Router()
const authContr = require('../controller/authController')

router.post('/register',authContr.signUp);
router.post('/login',authContr.login);
router.post('/logout',authContr.logout);
router.post('/refreshToken',authContr.generatorAccessToken);
router.post('/resetPassword',authContr.resetPassword);





module.exports = router

