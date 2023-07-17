import { Handler } from "express";
import makeContactIdentifier from "../contacts/identify";
import validate from "../contacts/identify/validation";
import DatabaseConnection from "../database";

export default function makeConsolidateRoute(databaseConnection: DatabaseConnection): Handler {
    const identify = makeContactIdentifier(databaseConnection)
    return async (req, res) => {
        try {
            let request = await validate(req.body)
            let contact = await identify(request)
            res.json({ contact })
            return
        }

        catch (e: any) {
            res.status(400).json({ ...e })
        }
    }
}