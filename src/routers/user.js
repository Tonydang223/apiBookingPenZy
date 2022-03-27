const express = require('express')


const router = express.Router()
const userContr = require('../controller/userController')
const {authVerify,isAdmin} = require('../middlewares/auth')

router.post('/uploadImg',authVerify,userContr.uploadImg)
router.get('/getInfoUser',authVerify,userContr.getInfoUser)
router.post('/update',authVerify,userContr.updateProfile)
router.get('/allInfo',authVerify,isAdmin,userContr.getAllInfoUser)
router.post('/deleteUser',authVerify,isAdmin,userContr.deleteUser)
router.post('/handleAction',authVerify,isAdmin,userContr.handleActionForm)
router.post('/changePassword',authVerify,userContr.changePassword)


module.exports = router

