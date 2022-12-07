import { OkPacket, RowDataPacket } from 'mysql2';
import { Channel, Group, Project } from '../../model/Model';
import Connection from '../Connection';
import IProjectDAO from '../IProjectDAO';
import { channelTable, groupTable, projectPermissionTable, projectTable } from './DBConstants';

export default class ProjectImpl implements IProjectDAO {
    // createProject
    // 1. 프로젝트를 만듭니다.
    // 2. user_project_map에 만든 사람을 등록합니다.
    async createProject(project: Project): Promise<Project> {
        const conn = await Connection.getConnection();
        let query = `INSERT INTO ${projectTable}(name, createdBy) VALUES (?,?)`;
        let mapQuery = `INSERT INTO ${projectPermissionTable}(projectId, userId, permission) VALUES (?,?,?)`;

        try {
            await conn.beginTransaction();
            let [result, _] = await conn.query(query, [project.name, project.createdBy]);
            let id = (result as OkPacket).insertId;
            await conn.query(mapQuery, [id, project.createdBy, 1]);
            await conn.commit();
            return new Project(id, project.name, project.createdBy);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    async deleteProject(id: number): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `DELETE FROM ${projectTable} WHERE id=?`;
        try {
            await conn.query(query, id);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async updateProject(project: Project): Promise<void> {
        const conn = await Connection.getConnection();
        let query = `UPDATE ${projectTable} SET name=? WHERE id=?`;
        try {
            await conn.query(query, [project.name, project.id]);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getProject(id: number): Promise<Project> {
        const conn = await Connection.getConnection();
        let query = `SELECT * FROM ${projectTable} WHERE id=?`;
        try {
            let result = await conn.query(query, id);
            let res = result as RowDataPacket[];
            if (res.length <= 0) {
                throw new Error('There is no such project.');
            }
            let ret = new Project(res[0][0].id, res[0][0].name, res[0][0].createdBy);
            return ret;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getProjectList(userId: number): Promise<Array<Project>> {
        if(isNaN(userId)){
            throw new Error("UserId is NaN")
        }

        const conn = await Connection.getConnection();
        let query = `SELECT t.* FROM ${projectPermissionTable} m JOIN ${projectTable} t ON m.projectId = t.id WHERE m.userId=?`;

        try {
            let [result, _] = await conn.query(query, userId);
            let res = result as RowDataPacket[];
            let ret = new Array<Project>();
            for (let i = 0; i < res.length; i++) {
                ret.push(new Project(res[i].id, res[i].name, res[i].createdBy));
            }
            return ret;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getProjectRecursive(id: number): Promise<Project> {
        const conn = await Connection.getConnection();
        let group_query = `SELECT * FROM ${groupTable} WHERE projectId=?`;
        let channel_query = `SELECT * FROM ${channelTable} WHERE groupId=?`;
        let project_query = `SELECT * FROM ${projectTable} WHERE id=?`;

        try {
            conn.beginTransaction();
            let [project_result, _] = await conn.query(project_query, id);
            let project_row = project_result as RowDataPacket[];
            if (project_row.length <= 0) {
                throw new Error("No project.");
            }

            let project = new Project(project_row[0].id, project_row[0].name, project_row[0].createdBy);
            let [group_result, __] = await conn.query(group_query, project_row[0].id);
            let group_row = group_result as RowDataPacket[];
            if (group_row.length <= 0) {
                return project;
            }

            let groups = new Array<Group>();
            for (let i = 0; i < group_row.length; i++) {
                let [channel_result, ___] = await conn.query(channel_query, group_row[i].id);
                let channel_row = channel_result as RowDataPacket[];
                let group = new Group(group_row[i].id, group_row[i].projectId, group_row[i].name, group_row[i].createdBy);
                if (channel_row.length <= 0) {
                    groups.push(group);
                    continue;    
                }

                let channels = new Array<Channel>();
                for (let j = 0; j < channel_row.length; j++) {
                    channels.push(new Channel(channel_row[j].id, channel_row[j].projectId, channel_row[j].groupId, channel_row[j].name, channel_row[j].type, channel_row[j].createdBy, channel_row[j].bitRate, channel_row[j].maxConnect));
                }
                group.channels = channels;
            }

            project.groups = groups;
            conn.commit();
            return project;
        } catch (err) {
            conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}