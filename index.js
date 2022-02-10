const express = require('express')

const app = express()
const routers = require('./src/routers/index')
const CookiesParser = require('cookie-parser')
const PORT = process.env.PORT || 3000
const morgan = require('morgan')
const dbConnection = require('./helpers/dbConnection/init.dbConnect')
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(CookiesParser())
app.use(morgan('dev'))
app.get('/',(req,res)=>{
    res.send('gone in')
})
dbConnection.connect()
routers(app)


app.listen(PORT,()=>console.log(`Server is running at: http://localhost:${PORT}`))


