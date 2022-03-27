const mongoose = require('mongoose')
const geocoder = require('../../utils/geo')
const Schema = mongoose.Schema

const HotelModel = new Schema({
   hotel_name:{
       type:String,
       trim:true,
       unique:true,
       required:true
   },
   address:{
       type:String,
       required:true,
       trim:true
   },
   location:{
       type:{
           type:String,
           enum:['Point']
       },
       coordinates:{
           type:[Number],
           index:'2dsphere'
       },
       formattedAddress:String
   },
   owner:{
       type:String
   },
   imgs:{
       type:Array
   }
},{timestamps:true})

// HotelModel.pre('save',async function(req,res,next){
//     try {
//        const loc = await geocoder.geocode(this.address);
//         console.log(loc)
//     } catch (error) {
//         next(error)
//     }
// })

const HotelSchema = mongoose.model('hotels',HotelModel);

module.exports = HotelSchema