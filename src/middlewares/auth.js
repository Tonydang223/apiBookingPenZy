
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
async function authVerify(req,res,next){
    try {
        const token = req.header("Authorization")
        console.log(req.header)
        // Bearer + token send from client
         console.log(token)
        if(!token) return res.status(401).send({message:"Unauthorized"})
     
        jwt.verify(token,process.env.TOKEN_SECRET,function(error,data){
            console.log(error,data);
            if(error) return res.status(403).send({message:error})
            req.user = data
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Server error",error})
    }
}

async function verifyEmailMiddleWare(req,res,next){
    try {
        const user = await User.findOne({email:req.body.email})
        if(user.isVerified){
            next()
        }else{
            res.status(400).send({message:"You need you verify your email account!!!"})
        }
    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
}

async function isAdmin(req,res,next){
    try {
        const user = await User.findOne({_id:req.user.id})
        if(user.role !== 1) return res.status(400).send({message:"Admin resource . Access denied!!!"})
        next()

    } catch (err) {
        res.status(500).send({message:"Server error"})
    }
}
module.exports = {authVerify,verifyEmailMiddleWare, isAdmin}