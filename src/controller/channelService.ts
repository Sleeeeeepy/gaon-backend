import ChannelImpl from "../dao/impl/ChannelImpl";
import { Request, Response } from "express";
import { Channel } from "../model/Model";
import { handleException, success } from "./common";
import { Permission } from "../decorator/Permission";

export default class ChannelService {
    private static channelDao = new ChannelImpl();

    @Permission()
    public async deleteChannel(req: Request, res: Response) {
        let channelId = Number.parseInt(req.params.channelId as string);
        let userId = Number.parseInt(req.query.userId as string);
        let groupId = Number.parseInt(req.query.groupId as string);
    
        try {
            let channel = await ChannelService.channelDao.getChannel(channelId);
            if (channel.groupId != groupId) {
               throw new Error(`Invalid behavior: channel ${channel.groupId} but ${groupId}`);
            }
            await ChannelService.channelDao.deleteChannel(channelId);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async addChannel(req: Request, res: Response) {
        let projectId = Number.parseInt(req.body.projectId as string);
        let groupId = Number.parseInt(req.body.groupId as string);
        let userId = Number.parseInt(req.body.userId as string);
        let name = req.body.name as string;
        let type = req.body.type as string;
        let createdBy = userId;
    
        try {
            let channel = new Channel(0, projectId, groupId, name, type, createdBy, 64, 20);
            let response = await ChannelService.channelDao.createChannel(channel);
            res.json(response);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async updateChannel(req: Request, res: Response) {
        let channelId = Number.parseInt(req.params.channelId as string);
        let userId = Number.parseInt(req.body.userId as string);
        let groupId = Number.parseInt(req.body.groupId as string);
        let new_name = req.body.name as string;
        let new_type = req.body.type as string;
    
        try {
            let channel = await ChannelService.channelDao.getChannel(channelId);
            if (channel.groupId != groupId) 
                throw new Error("Invalid groupId");
    
            if (new_name) {
                channel.name = new_name;
            }
    
            if (new_type) {
                channel.type = new_type;
            }
    
            let update = await ChannelService.channelDao.updateChannel(channel);
            res.json(update);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getChannel(req: Request, res: Response) {
        let channelId = Number.parseInt(req.params.channelId as string);
        
        try {
            let response = await ChannelService.channelDao.getChannel(channelId);
            res.json(response);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getChannelList(req: Request, res: Response) {
        let groupId = Number.parseInt(req.params.groupId as string);
    
        try {
            let cList = await ChannelService.channelDao.getChannelList(groupId);
            res.json(cList);
        } catch (err) {
            handleException(res, err);
        }
    }
}
