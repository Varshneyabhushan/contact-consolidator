import { Handler } from "express";
import makeConsolidator, { ConsolidationRequest } from "../contacts/consolidate";
import contactPayloadSchema from "../contacts/consolidate/validation";

export default function makeConsolidateRoute() : Handler {
    const consolidate = makeConsolidator()
    return async (req, res) => {
        let validationResult = contactPayloadSchema.validate(req.body)
        if(validationResult.error) {
            res.status(400).json({ error : validationResult.error })
            return
        }

        let request : ConsolidationRequest = validationResult.value
        try {
            let contact = await consolidate(request) 
            res.json({ contact })
            return
        }

        catch(e : any) {
            res.status(400).json({ ...e })
        }
    }
}