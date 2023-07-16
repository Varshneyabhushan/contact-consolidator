
//load env variables from .env
import { config } from 'dotenv';
import { toNumber } from './utils/conversions';
config();

const port = toNumber(process.env.PORT ?? '80') ?? 80;

const configJSON = {
    app: {
        port,
    }
}

export default configJSON