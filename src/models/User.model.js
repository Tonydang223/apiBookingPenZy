const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = new Schema({
    name:{
        type:String,
        required:true,
        minlength:6,
        maxlength:100
    },
    email:{
         type:String,
         required:true,
         unique:true,
         minlength:6,
         maxlength:200
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:8
    },
    address:{
        type:String,
        minlength:6,
        maxlength:200,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    phoneNumber:{
        type:String,
        required:true,
        length:14
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