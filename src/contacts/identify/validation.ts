import Joi from "joi";
import { ConsolidationRequest } from ".";
import { RouterError } from "../../router";

const consolidationRequestSchema = Joi.object({
    email : Joi.string().email().allow(null),
    phoneNumber : Joi.string().allow(null),
})

export default function validate(payload : any) : Promise<ConsolidationRequest> {
    const validationResult = consolidationRequestSchema.validate(payload)
    if(validationResult.error) {
        const firstError = validationResult.error.details[0]
        const error : RouterError = {
            message : firstError.message,
            payload : {
                keys : [firstError.context?.key ?? ""],
            },
            type : "validation"
        }

        return Promise.reject(error)
    }

    let validated = validationResult.value as ConsolidationRequest
    if(!validated.email && !validated.phoneNumber) {
        const error : RouterError = {
            message : "both phoneNumber and email should not be empty",
            type : "validation",
            payload : null,
        }

        return Promise.reject(error)
    }

    return Promise.resolve(validationResult.value)
}