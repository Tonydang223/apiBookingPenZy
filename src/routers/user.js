const express = require('express')


const router = express.Router()
const userContr = require('../controller/userController')
const {authVerify,isAdmin} = require('../middlewares/auth')
router.post('/uploadImg',authVerify,userContr.uploadImg)
router.post('/getInfoUser',authVerify,userContr.getInfoUser)
router.post('/update',authVerify,userContr.updateProfile)
router.post('/allInfo',authVerify,isAdmin,userContr.getAllInfoUser)


module.exports = router