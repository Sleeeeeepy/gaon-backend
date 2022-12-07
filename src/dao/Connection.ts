import mysql from 'mysql2/promise';
import * as config from './dbconfig.json';

export default class Connection {
    private static pool = mysql.createPool({
        host: config.host,
        user: config.user,
        database: config.database,
        password: config.password,
        port: config.port,
        connectionLimit: config.connectionLimit
    });

    public static async getConnection() {
        return this.pool.getConnection();
    }
}