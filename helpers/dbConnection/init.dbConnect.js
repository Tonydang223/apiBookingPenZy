

const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION,{
            dbName:process.env.DB_NAME
        });
        console.log('connect ok!')
    } catch (error) {
        console.log('connect fail')
    }
}
module.exports = {connect}