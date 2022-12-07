import { OkPacket, RowDataPacket } from "mysql2";
import { User } from "../../model/Model";
import Connection from "../Connection";
import IUserDAO from "../IUserDAO";
import { userTable } from "./DBConstants";
import { HttpError } from '../../model/Response';

export default class UserImpl implements IUserDAO {
    async getUser(id: number): Promise<User>;
    async getUser(userId: string): Promise<User>;
    async getUser(param: number | string): Promise<User> {
        if (typeof param === "string") {
            return this.getUserByUserId(param);
        }

        return this.getUserById(param);
    }
    
    public async getUserByToken(token: string) {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${userTable} WHERE token=?`;
        try {
            let [result, _] = await conn.query(query, token);
            let res = result as RowDataPacket[];
            let user = res[0];
            if (res.length <= 0) {
                throw new Error("no user");
            }
            return new User(user.id, user.userId, user.username, user.password, user.email, user.name, user.birthday, user.status, user.token, user.job);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    private async getUserById(id: number): Promise<User> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${userTable} WHERE id=?`;
        try {
            let [result, _] = await conn.query(query, id);
            let res = result as RowDataPacket[];
            let user = res[0];
            if (res.length <= 0) {
                throw new Error("no user");
            }
            return new User(user.id, user.userId, user.username, user.password, user.email, user.name, user.birthday, user.status, user.token, user.job);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    public async getUserByUserId(userId: string): Promise<User> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${userTable} WHERE userId=?`;
        try {
            let [result, _] = await conn.query(query, userId);
            let res = result as RowDataPacket[];
            let user = res[0];
            if (res.length <= 0) {
                throw new HttpError(401, "Can't find such user: " + userId);
            }
            return new User(user.id, user.userId, user.username, user.password, user.email, user.name, user.birthday, user.status, user.token, user.job);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async addUser(user: User): Promise<User> {
        const conn = await Connection.getConnection();
        let query = `INSERT INTO ${userTable}(userId, username, name, birthday, password, email, job, status, token) VALUES (?,?,?,?,?,?,?,?,?)`;
        try {
            let [result, _] = await conn.query(query, [user.userId, user.username, user.name, user.birth, user.password, user.email, user.job, user.status, user.token]);
            let res = result as OkPacket;
            return new User(res.insertId, user.userId, user.username, user.password, user.email, user.name, user.birth, user.status, user.token, user.job);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async updateUser(user: User): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `UPDATE ${userTable} SET username=?, password=?, email=?, name=?, birthday=?, status=?, token=?, job=? WHERE id=?`;
        try {
            await conn.query(query, [user.username, user.password, user.email, user.name, user.birth, user.status, user.token, user.job, user.id]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async deleteUser(id: string): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `DELETE FROM ${userTable} WHERE id=?`;
        try {
            await conn.query(query, id);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}