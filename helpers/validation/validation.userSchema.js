const Joi = require('joi')

const registerSchema = (data)=>{
    const registerJoiSchema = Joi.object({
        name:Joi.string().min(6).max(100).required(),
        email:Joi.string().min(6).max(200).email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),
        password:Joi.string().min(6).max(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        address:Joi.string().min(6).max(250),
        phoneNumber:Joi.string().length(10).regex(/^\d+$/),
        role:Joi.number().required()
    })
    return registerJoiSchema.validate(data)
}
const loginSchema = (data)=>{
    const loginJoiSchema = Joi.object({
        email:Joi.string().min(6).max(200).email({minDomainSegments:2,tlds:{allow:['com','net']}}),
        password:Joi.string().min(6).max(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })
    return loginJoiSchema.validate(data)
}

module.exports= {registerSchema,loginSchema}
