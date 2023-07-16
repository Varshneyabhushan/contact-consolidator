
//loading config variables
import config from './config';
import DatabaseConnection from './database';

//router
import startRouter from './router';

init();

async function init() {
    //init database service

    const connection = new DatabaseConnection(config.database)
    try {
        await connection.onConnect
        console.log("database connection successful")
    }
    catch(e) {
        console.log("error while connecting to database : ", e)
        return
    }
    
    // init router
    await startRouter(config.app)
    console.log('started listening on port : ', config.app.port);
}

async function dispose() {
    console.log('disposed services');
}

const shutDown = (msg: string) => {
    console.log('shutting down : ', msg);
    return dispose();
};

//app termination
process.on('SIGINT', () => {
    shutDown('app termination').then(() => process.exit());
});

//nodemon restart
process.once('SIGUSR2', () => {
    shutDown('nodemon restart').then(() => process.kill(process.pid, 'SIGUSR2'));
});