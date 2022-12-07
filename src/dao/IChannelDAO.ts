import { Channel } from "../model/Model"

export default interface IChannelDAO {
    createChannel(channel: Channel): Promise<Channel>;
    getChannel(channelId: number): Promise<Channel>;
    updateChannel(channel: Channel): Promise<Channel>;
    deleteChannel(channelId: number): Promise<void>;
    getChannelList(groupId: number): Promise<Array<Channel>>;
}