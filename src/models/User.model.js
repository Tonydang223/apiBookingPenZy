const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = new Schema({
    name:{
        type:String,
        required:true,
        minlength:6,
        maxlength:100,
        trim:true
    },
    email:{
         type:String,
         required:true,
         unique:true,
         minlength:6,
         maxlength:200,
         trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    address:{
        type:String,
    },
    city:{
        type:String
    },
    country:{
       type:String
    },
    role:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean
    },
    avatar:{
        type:String,
        default:'https://res.cloudinary.com/dipro/image/upload/v1645001565/avatar/default-avatar-profile-icon-vector-social-media-user-portrait-176256935_f2t2yd.jpg'
    },
    phoneNumber:{
        type:String,
    }
},{timestamps:true})


UserModel.pre('save',async function(next){
   try {
       const salt = await bcrypt.genSalt(10)
       const hashPassword = await bcrypt.hash(this.password,salt)
       this.password = hashPassword
    return next()
   } catch (err) {
       next(err)
   }
})

// UserModel.methods.isValidPassword = async function (password) {
//     try {
//         return await bcrypt.compare(password,this.password)
//     } catch (error) {
//         throw error
//     }
// }
const UserSchema = mongoose.model('users',UserModel)

module.exports = UserSchema