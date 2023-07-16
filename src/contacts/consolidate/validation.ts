import Joi from "joi";

const consolidationRequestSchema = Joi.object({
    email : Joi.string,
    phoneNumber : Joi.string,
})

export default consolidationRequestSchema