const { cloudinary } = require("../../utils/cloudinary");
const User = require("../models/User.model");
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
            city:city?city:"",
            country:country?country:"",
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
      
    } catch (error) {
      
    }
  }
};
module.exports = userController;
