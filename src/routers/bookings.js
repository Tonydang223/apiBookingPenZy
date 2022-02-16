const express = require('express')


const router = express.Router()
const bookingContrl = require('../controller/bookingController')
const {authVerify} = require('../middlewares/auth')
router.get('/booking',bookingContrl.allBooking)

module.exports = router