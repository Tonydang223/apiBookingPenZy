
const jwt = require('jsonwebtoken')

async function authVerify(req,res,next){
    try {
        const authorizationHeaders = req.header("Authorization")
        // Bearer + token send from client
        const token = authorizationHeaders.split(' ')[1]
        console.log(token);
        if(!token) return res.status(401).send({message:"Unauthorized"})
     
        jwt.verify(token,process.env.TOKEN_SECRET,function(error,data){
            console.log(error,data);
            if(error) return res.status(403).send({message:error})
            next()
        })
    } catch (error) {
        res.status(500).send({message:"Server error"})
    }
}
module.exports = authVerify