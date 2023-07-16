
//load env variables from .env
import { config } from 'dotenv';
import { toNumber } from './utils/conversions';
config();

const port = toNumber(process.env.PORT ?? '80') ?? 80;

const configJSON = {
    app: {
        port,
    },
    database : {
        host : process.env.HOST ?? "",
        username : process.env.USERNAME ?? "",
        password : process.env.PASSWORD ?? "",
        database : process.env.DATABASE ?? ""
    }
}

export default configJSON