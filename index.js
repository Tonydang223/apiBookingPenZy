const express = require('express')
const cors = require('cors')
const app = express()
const routers = require('./src/routers/index')
const CookiesParser = require('cookie-parser')
const PORT = process.env.PORT || 5000
const morgan = require('morgan')
const dbConnection = require('./helpers/dbConnection/init.dbConnect')
require('dotenv').config()
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({
    extended:true,
    limit:'50mb'
}))
app.use(cors())
app.use(CookiesParser())
app.use(morgan('dev'))
app.get('/',(req,res)=>{
    res.send('gone in')
})
dbConnection.connect()
routers(app)


app.listen(PORT,()=>console.log(`Server is running at: http://localhost:${PORT}`))


