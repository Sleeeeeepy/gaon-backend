import { Group } from "../../model/Model";
import IGroupDAO from "../IGroupDAO";
import Connection from "../Connection";
import { OkPacket, RowDataPacket } from "mysql2";
import { groupTable, projectTable } from "./DBConstants";

export default class GroupImpl implements IGroupDAO {
    async createGroup(group: Group): Promise<Group> {
        const conn = await Connection.getConnection();
        let insertGroupSQL = `INSERT INTO ${groupTable}(projectId, name, createdBy) VALUES(?,?,?)`;
        try {
            var [result, _] = await conn.query(insertGroupSQL, [group.projectId, group.name, group.createdBy]);
            let id = (result as OkPacket).insertId
            return new Group(id, group.projectId, group.name, group.createdBy);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
    
    async getGroup(groupId: number): Promise<Group> {
        const conn = await Connection.getConnection();

        try {
            let [result, _] = await conn.query(`SELECT * FROM ${groupTable} WHERE id=?`, groupId);
            let res = result as RowDataPacket[];
            return new Group(res[0].id, res[0].projectId, res[0].name, res[0].createdBy);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async updateGroup(groupId: number, groupName: string): Promise<void> {
        const conn = await Connection.getConnection();

        try {
            await conn.query(`UPDATE ${groupTable} SET name=? WHERE id=?`, [groupName, groupId]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async deleteGroup(groupId: number): Promise<void> {
        const conn = await Connection.getConnection();

        try {
            await conn.query(`DELETE FROM ${groupTable} WHERE id=?`, groupId);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
    
    async getGroupList(projectId: number): Promise<Array<Group>> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${groupTable} WHERE projectId=?`;
        try {
            let [result, _] = await conn.query(query, projectId);
            let res = result as RowDataPacket[];
            let ret = new Array<Group>();
            for (let i = 0; i < res.length; i++) {
                let group = new Group(res[i].id, res[i].projectId, res[i].name, res[i].createdBy)
                ret.push(group);
            }
            return ret;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}