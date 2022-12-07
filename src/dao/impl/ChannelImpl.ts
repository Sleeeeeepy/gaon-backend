import { OkPacket, RowDataPacket } from "mysql2";
import { Channel } from "../../model/Model";
import Connection from "../Connection";
import IChannelDAO from "../IChannelDAO";

export default class ChannelImpl implements IChannelDAO {
    private static table = "channel";

    async createChannel(channel: Channel): Promise<Channel> {
        const conn = await Connection.getConnection();
        let query = `INSERT INTO ${ChannelImpl.table}(projectId, groupId, name, type, createdBy, bitRate, maxConnect) VALUES (?,?,?,?,?,?,?)`
        try {
            let [result, _] = await conn.query(query, [channel.projectId, channel.groupId, channel.name, channel.type, channel.createdBy, channel.bitRate, channel.maxConnect]);
            let res = result as OkPacket;
            return new Channel(res.insertId, channel.projectId, channel.groupId, channel.name, channel.type, channel.createdBy, channel.bitRate, channel.maxConnect);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getChannel(channelId: number): Promise<Channel> {
        const conn = await Connection.getConnection();

        try {
            let [result, _] = await conn.query(`SELECT * FROM ${ChannelImpl.table} WHERE id=?`, channelId);
            let res = result as RowDataPacket[];
            let r = res[0];
            return new Channel(r.id, r.projectId, r.groupId, r.name, r.type, r.createdBy, r.bitRate, r.maxConnect);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async updateChannel(channel: Channel): Promise<Channel> {
        const conn = await Connection.getConnection();

        try {
            await conn.query(`UPDATE ${ChannelImpl.table} SET name=?, projectId=?, groupId=?, type=?, createdBy=?, bitRate=?, maxConnect=? WHERE id=?`, [channel.name, channel.projectId, channel.groupId, channel.type, channel.createdBy, channel.bitRate, channel.maxConnect, channel.id]);
            return channel;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async deleteChannel(channelId: number): Promise<void> {
        const conn = await Connection.getConnection();

        try {
            await conn.query(`DELETE FROM ${ChannelImpl.table} WHERE id=?`, channelId);
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }

    async getChannelList(groupId: number): Promise<Channel[]> {
        const conn = await Connection.getConnection();

        try {
            let [result, _] = await conn.query(`SELECT * FROM ${ChannelImpl.table} WHERE groupId=?`, groupId);
            let res = result as RowDataPacket[];
            let ret = new Array<Channel>();
            for (let i = 0; i < res.length; i++) {
                let current = res[i];
                ret.push(new Channel(current.id, current.projectId, current.groupId, current.name, current.type, current.createdBy, current.bitRate, current.maxConnect));
            }
            return ret;
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}