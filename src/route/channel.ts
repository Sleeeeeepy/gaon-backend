import express from 'express';
import ChannelService from '../controller/channelService';

const channelRouter = express.Router();
const service = new ChannelService();
channelRouter.get("/:channelId", service.getChannel);
channelRouter.post("/", service.addChannel);
channelRouter.delete("/:channelId", service.deleteChannel);
channelRouter.put("/:channelId", service.updateChannel);
channelRouter.get("/list/:groupId", service.getChannelList);

export = channelRouter;