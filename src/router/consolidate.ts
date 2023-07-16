import { Handler } from "express";
import makeConsolidator from "../contacts/consolidate";
import validate from "../contacts/consolidate/validation";

export default function makeConsolidateRoute() : Handler {
    const consolidate = makeConsolidator()
    return async (req, res) => {
        try {
            let request = await validate(req.body)
            let contact = await consolidate(request) 
            res.json({ contact })
            return
        }

        catch(e : any) {
            res.status(400).json({ ...e })
        }
    }
}