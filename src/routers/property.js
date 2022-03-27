const express = require('express')


const router = express.Router()
const propertyContrl = require('../controller/propertyController')


router.post('/createHotel',propertyContrl.createHotel);


module.exports = router