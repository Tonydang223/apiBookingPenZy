const { isEmpty, configValidates } = require("../../helpers/validation/validation.userSchema");
const { cloudinary } = require("../../utils/cloudinary");
const User = require("../models/User.model");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const userController = {
  uploadImg: async function (req, res, next) {
    try {
      const { avatar } = req.body;
      console.log(req.user);
      const uploadAvatar = await cloudinary.uploader.upload(avatar, {
        upload_preset: "avatar",
        width: 150,
        height: 150,
        crop: "fill",
      });
      console.log(uploadAvatar);
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { avatar: uploadAvatar.url } },
        { new: true }
      );
      res
        .status(200)
        .json({
          url: uploadAvatar.url,
          message: "You update the image successfully!!!",
        });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  getInfoUser: async function (req, res, next) {
    try {
      console.log(req.user.id);
      const userInfo = await User.findOne({ _id: req.user.id }).select(
        "-password"
      );
      res
        .status(200)
        .json({ user: userInfo, message: "Get user info successfully" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  updateProfile: async function (req, res, next) {
    try {
      const { email, country, address, phoneNumber, name, city } = req.body;

      const currentUser = await User.findOne({ _id: req.user.id });
      console.log(currentUser.email);
      const checkMail = await User.findOne({ email });
      console.log(checkMail);
      if (currentUser.email !== email && checkMail)
        return res.status(400).json({ message: "Email is existed!!!" });
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $set: {
            email: email ? email : currentUser.email,
            address: address ? address : currentUser.address,
            phoneNumber: phoneNumber?phoneNumber:currentUser.phoneNumber,
            name:name?name:currentUser.name,
            city:city?city:currentUser.city,
            country:country?country:currentUser.country,
          },
        },
        { new: true }
      );
      return res.status(200).json({ mgs: "ok" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  getAllInfoUser: async function (req, res, next) {
    try {
      console.log(req.user);
      const users = await User.find().select("-password");
      res.status(200).send({ message: "get users oke", data: users });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  deleteUser:async function(req,res,next){
    try {
      if(isEmpty(req.body.id)) return res.status(400).json({message:"You can not be empty data"})
      const user = await User.findOne({_id:req.body.id})
      if(!user) return res.status(400).json({message:"User can be removed or not existed!!!"})
      await User.deleteOne({_id:req.body.id})
      res.status(200).json({message:"delete ok!!"})
      console.log(error)
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  //admin delete selected users
  handleActionForm:async function(req,res,next){
     try {
        const {action,userIds} = req.body
        switch (action) {
          case "delete":
             if(Array.isArray(userIds) && userIds.length > 0){
              await User.deleteMany({_id:{$in:userIds}})
              return res.status(200).json({message:"Delete selected users ok !!!"})
             }
             res.status(400).json({message:"userIds is not array or not having value"})
            break;
          default:
            return res.status(400).json({msg:"Action is invalid!"})
        }

     } catch (error) {
      return res.status(500).json({ mgs: error.message });
     }
  },
  changePassword:async function(req,res,next){
       const {password,oldPassword} = req.body
       if(isEmpty(password) || isEmpty(oldPassword)) return res.status(400).json({message:"Can not be empty"})
       const {error} = Joi.object({password:configValidates.password}).validate({password})
       if( error ) return res.status(400).json({message:error})
       const user = await User.findOne({_id:req.user.id})
       const isValidatePass = await bcrypt.compare(oldPassword,user.password)
       console.log(isValidatePass)
       if(!isValidatePass) return res.status(400).json({message:"Password is not right"})
       
       const salt = await bcrypt.genSalt(10);
      const hashPasswordChange = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate({_id:req.user.id},{$set:{password:hashPasswordChange}},{new:true})
       res.status(200).json({message:"Change password successfully!!!"})
  }
};
module.exports = userController;
