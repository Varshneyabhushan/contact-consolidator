import mysql from 'mysql'
import { DatabaseError } from './databaseError';

interface DbConfig {
    host: string;
    username: string;
    password: string;
    database: string;
}

export default class DatabaseConnection {
    pool: mysql.Pool;

    constructor(config: DbConfig) {
        this.pool = mysql.createPool({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        })
    }

    private query<T>(sql: string, values?: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async createTableIfNotExists(tableName: string, columns: string): Promise<void> {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

        try {
            await this.query<void>(createTableQuery);
            console.log(`Table ${tableName} created successfully.`);
        } catch (err: any) {
            throw new DatabaseError(`Error creating table ${tableName}: ${err.message}`);
        }
    }

    async insert(table: string, data: any): Promise<number> {
        const sql = `INSERT INTO ${table} SET ?`;
        const result = await this.query<{ insertId: number }>(sql, data);
        return result.insertId;
    }

    async select<T>(table: string, conditions: any = {}): Promise<T[]> {
        const sql = `SELECT * FROM ${table} WHERE ?`;
        return this.query<T[]>(sql, conditions);
    }

    async update(table: string, data: any, conditions: any): Promise<number> {
        const sql = `UPDATE ${table} SET ? WHERE ?`;
        const result = await this.query<{ affectedRows: number }>(sql, [data, conditions]);
        return result.affectedRows;
    }
}