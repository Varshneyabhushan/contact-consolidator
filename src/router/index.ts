import express from "express";
import makeConsolidateRoute from "./consolidate";
import DatabaseConnection from "../database";

export interface AppConfig {
    port: number;
}

export interface RouterError {
    message : string;
    payload : any;
    type : string;
}

const startRouter = (
    appConfig: AppConfig,
    databaseConnection : DatabaseConnection,
): Promise<void> => {
    const app = express();

    //enabling body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //TODO implement authentication
    app.post("/identify", makeConsolidateRoute(databaseConnection))

    app.use('*', (_, res) => res.status(404).json({ message: 'invalid route' }));

    return new Promise((resolve) => {
        app.listen(appConfig.port, () => resolve());
    });
};

export default startRouter;