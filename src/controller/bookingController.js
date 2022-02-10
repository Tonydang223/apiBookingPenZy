

class bookingController{
     async allBooking(req,res,next){
        const booking =[
            {
                id:1,
                property:"villa",
                name_property:"kopi",
                location:"23 sol",
                service:[],
                price:"450",
            },
            {
                id:2,
                property:"apartment",
                name_property:"loice",
                location:"23 jiop",
                service:[],
                price:"236",
            }
        ]
        res.status(200).send({status:200,success:{message:''},data:booking})
     }
}
module.exports = new bookingController()