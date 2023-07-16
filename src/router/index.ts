import express from "express";

export interface AppConfig {
    port: number;
}

const startRouter = (
    appConfig: AppConfig,
): Promise<void> => {
    const app = express();

    //enabling body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //TODO implement authentication
    // app.post("/identify", (req, res) => {})

    app.use('*', (_, res) => res.status(404).json({ message: 'invalid route' }));

    return new Promise((resolve) => {
        app.listen(appConfig.port, () => resolve());
    });
};

export default startRouter;