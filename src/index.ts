
//loading config variables
import config from './config';

//router
import startRouter from './router';

init();

async function init() {
    //init database service

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