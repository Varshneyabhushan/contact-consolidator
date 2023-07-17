import express from "express";
import makeConsolidateRoute from "./consolidate";
import DatabaseConnection from "../database";
import rateLimit from "express-rate-limit"

export interface AppConfig {
    port: number;
    requestsPerMinute : number;
}

export interface RouterError {
    message: string;
    payload: any;
    type: string;
}

const startRouter = (
    appConfig: AppConfig,
    databaseConnection: DatabaseConnection,
): Promise<void> => {
    const app = express();

    //enabling body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rate limiter configuration: requests per minute
    const minute = 60* 1000
    const limiter = rateLimit({
        windowMs: minute,
        max: appConfig.requestsPerMinute, // Limit each IP to 100 requests per minute
    });

    //TODO implement authentication
    app.post("/identify", limiter, makeConsolidateRoute(databaseConnection))

    app.use('*', (_, res) => res.status(404).json({ message: 'invalid route' }));

    return new Promise((resolve) => {
        app.listen(appConfig.port, () => resolve());
    });
};

export default startRouter;