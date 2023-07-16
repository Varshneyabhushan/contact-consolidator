import mysql from 'mysql'

interface DbConfig {
    host: string;
    username: string;
    password: string;
    database: string;
}

export default class DatabaseConnection {
    onConnect: Promise<void>;
    connection : mysql.Connection;

    constructor(config: DbConfig) {
        // write in .env
        this.connection = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        })

        this.onConnect = new Promise((resolve, reject) => {
            this.connection.connect(
                (err, args) => {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve()
                }
            )
        })
    }
}