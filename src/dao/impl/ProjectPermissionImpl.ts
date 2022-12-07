import { RowDataPacket } from "mysql2/promise";
import { ProjectPermission, UserSummary } from '../../model/Model';
import Connection from "../Connection";
import IProjectPermissionDAO from "../IProjectPermissionDAO";
import { projectPermissionTable } from "./DBConstants";

export default class ProjectPermissionImpl implements IProjectPermissionDAO {
    async setPermission(projectId: number, userId: number, permission: number): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `INSERT INTO ${projectPermissionTable}(projectId, userId, permission) VALUES(?,?,?)`
        try {
            await conn.query(query, [projectId, userId, permission]); 
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async updatePermission(projectId: number, userId: number, permission: number): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `UPDATE ${projectPermissionTable} SET permission=? WHERE projectId=? AND userId=?`;
        try {
            await conn.query(query, [permission, projectId, userId]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async deletePermission(projectId: number, userId: number): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `DELETE FROM ${projectPermissionTable} WHERE projectId=? AND userId=?`;
        try {
            await conn.query(query, [projectId, userId]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getPermission(projectId: number, userId: number): Promise<ProjectPermission> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${projectPermissionTable} WHERE projectId=? AND userId=?`;
        try {
            let [result, _] = await conn.query(query, [projectId, userId]);
            let res = result as RowDataPacket[];
            if (res.length <= 0) {
                throw new Error("There is no such permission.");
            }
            return new ProjectPermission(res[0].id, res[0].projectId, res[0].userId, res[0].permission);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async listPermission(projectId: number): Promise<UserSummary[]> {
        const conn = await Connection.getConnection();
        let query = `SELECT name, p.userId 
                    FROM project_permission p 
                    JOIN user u ON p.userId = u.id 
                    WHERE projectId=? AND permission > 0`;
        try {
            let [result, _] = await conn.query(query, projectId);
            let res = result as RowDataPacket[];
            return res.map(row => new UserSummary(row.userId, row.name));
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}