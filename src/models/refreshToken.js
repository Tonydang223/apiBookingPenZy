const mongoose = require('mongoose')

const refreshToken = new mongoose.Schema({
    refreshToken:{
        type:String
    }
})

const refreshTokenSchema = mongoose.model("refreshToken",refreshToken)

module.exports = refreshTokenSchema