const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const RefreshToken = require('../models/refreshToken')
const httpErr = require('http-errors')
const jwt = require('jsonwebtoken')
const {registerSchema,loginSchema} = require('../../helpers/validation/validation.userSchema')
const  authController ={
   signUp:async function(req,res,next){
       try {
        const userRegister  = req.body
        const {error} = registerSchema(userRegister)
        if (error) return res.status(400).send({...error?.details[0],status:400})

        const chẹckExist = await User.findOne({email:userRegister.email})
        if(chẹckExist) {
           return res.status(409).send({error:{message:"Email is existed!!!"},status:409})
        }
        const user =  new User({
            name:userRegister.name,
            email:userRegister.email,
            address:userRegister.address,
            phoneNumber:userRegister.phoneNumber,
            password:userRegister.password,
            role:userRegister.role
        })
        const userSaved = await user.save()
        res.json({user:userSaved,status:200,success:{message:'Register successfully!!!'}})
       } catch (error) {
           next(error)
       }
    },
    login: async function(req,res,next){
       try {
        const userLogin  = req.body
        const {error} = loginSchema(userLogin)
        if (error) return res.status(400).send({...error?.details[0],status:400})

        const user = await User.findOne({email:userLogin.email})
        if(!user) {
           return res.status(409).send({error:{message:"Email is not existed!!!"},status:409})
        }
        const {password,...userObj} = user._doc
        const isValidatePassword = await bcrypt.compare(userLogin.password,user.password)
        if(!isValidatePassword){
            return res.status(409).send({error:{message:"Invalid Password!!!"},status:409})
        }
       const accessToken = jwt.sign({id:user._doc._id},process.env.TOKEN_SECRET,{
           expiresIn:'1d'
       })
       const refreshToken = jwt.sign({id:user._doc._id},process.env.REFRESH_TOKEN_SECRET)
       // set cookies
       await res.cookie("refreshToken",refreshToken,{
           httpOnly:true,
           path:'/auth/refreshToken',
           maxAge:90 * 24 * 60 * 60 * 1000 // 3 months
       });
        res.json({
            message:'Sign In successfully!!!',
            data:userObj,
            accessToken,
            refreshToken,
            status:200
        })
       } catch (error) {
           next(error)
       }
    },
    generatorAccessToken: async function(req,res,next){
         const token = req.cookies.refreshToken
         console.log(token)
         if(!token) return res.status(401).send({message:"Unauthorization"});
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET, async function(error,data){
            if(error) return res.status(403).send({message:error})
            const user = await User.findOne({_id:data.id}).select("-password")
            console.log(user);
            const accessToken = jwt.sign({id:data.id},process.env.TOKEN_SECRET,{
                expiresIn:'1d'
            })
            res.status(200).send({
                message:'Sign In successfully!!!',
                accessToken,
                user,
                status:200
            })
            // next()
        })
    }
}


module.exports = authController