
//load env variables from .env
import { config } from 'dotenv';
import { toNumber } from './utils/conversions';
config();

const port = toNumber(process.env.PORT ?? '80') ?? 80;
const requestsPerMinute = toNumber(process.env.REQUESTS_PER_MINUTE ?? '100') ?? 100; 

const configJSON = {
    app: {
        port,
        requestsPerMinute,
    },
    database : {
        host : process.env.HOST ?? "",
        username : process.env.USERNAME ?? "",
        password : process.env.PASSWORD ?? "",
        database : process.env.DATABASE ?? ""
    }
}

export default configJSON