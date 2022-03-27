

const Hotels = require('../models/Hotel.model')
const {cloudinary}= require('../../utils/cloudinary')
const propertyController = {
    createHotel:async (req,res,next)=>{
       try {
        console.log(req.body)
        // const checkName = await Hotels.findOne({hotel_name:req.body.hotel_name})
        // if(checkName) return res.status(400).json({messgae:'Name of hotel is existed!'})
        // const uploadImgs = await cloudinary.uploader.upload(imgs,{upload_preset:'hotels'})
        // const hotels = new Hotels({...req.body});
        // const savedHotels = await hotels.save()
        res.status(200).json({message:'alo'})
       } catch (error) {
           res.status(500).json({message:error.message})
       }
    }
}

module.exports = propertyController