import { OkPacket, RowDataPacket } from "mysql2";
import { ProjectInvite } from "../../model/Model";
import Connection from "../Connection";
import IProjectInviteDAO from "../IProjectInviteDAO";
import { projectInviteTable } from "./DBConstants";

export default class ProjectInviteImpl implements IProjectInviteDAO {
    async getInviteList(projectId: number): Promise<Array<ProjectInvite>> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${projectInviteTable} WHERE projectId=?`;
        try {
            let [result, _] = await conn.query(query, projectId);
            let res = result as RowDataPacket[];
            if (res.length <= 0) {
                throw new Error();
            }
            
            let ret = new Array<ProjectInvite>();
            for(let i = 0; i < res.length; i++) {
                ret.push(new ProjectInvite(res[i].id, res[i].projectId, res[i].code, res[i].expired, res[i].userId))
            }
            return ret;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async createInvite(projectInvite: ProjectInvite): Promise<ProjectInvite> {
        const conn = await Connection.getConnection();
        let query = `INSERT INTO ${projectInviteTable}(projectId, userId, code, expired) VALUES(?,?,?,?)`;
        try {
            let [result, _] = await conn.query(query, [projectInvite.projectId, projectInvite.userId, projectInvite.code, projectInvite.expired]);
            let res = result as OkPacket;
            return new ProjectInvite(res.insertId, projectInvite.projectId, projectInvite.code, projectInvite.expired, projectInvite.userId);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async deleteInvite(id: number): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `DELETE FROM ${projectInviteTable} WHERE id=?`;
        try {
            await conn.query(query, id);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
    
    async updateInvite(projectInvite: ProjectInvite): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `UPDATE ${projectInviteTable} SET projectId=?, userId=?, code=?, expired=?`;
        try {
            await conn.query(query, [projectInvite.projectId, projectInvite.userId, projectInvite.code, projectInvite.expired]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
    
    async getInvite(code: string): Promise<ProjectInvite>
    async getInvite(id: number): Promise<ProjectInvite>
    async getInvite(param: string | number) {
        if (typeof param == "string") {
            return await this.getInviteByCode(param);
        } else {
            return await this.getInviteById(param);
        }

    }

    private async getInviteByCode(code: string) {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${projectInviteTable} WHERE code=?`;
        try {
            let [result, _] = await conn.query(query, code);
            let res = result as RowDataPacket[];
            if (res.length <= 0) {
                throw new Error();
            }
            return new ProjectInvite(res[0].id, res[0].projectId, res[0].code, res[0].expired, res[0].userId);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    private async getInviteById(id:number) {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${projectInviteTable} WHERE id=?`;
        try {
            let [result, _] = await conn.query(query, id);
            let res = result as RowDataPacket[];
            if (res.length <= 0) {
                throw new Error();
            }
            return new ProjectInvite(res[0].id, res[0].projectId, res[0].code, res[0].expired, res[0].userId);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}