const express = require('express')


const router = express.Router()
const authContr = require('../controller/authController')

router.post('/register',authContr.signUp);
router.post('/login',authContr.login);
router.post('/refreshToken',authContr.generatorAccessToken)




module.exports = router

