import express from 'express';
import GroupService from '../controller/groupService';

const groupRouter = express.Router();
const service = new GroupService();
groupRouter.get("/:groupId", service.getGroup);
groupRouter.post("/", service.addGroup);
groupRouter.delete("/:groupId", service.deleteGroup);
groupRouter.put("/:groupId", service.updateGroup);
groupRouter.get("/list/:projectId", service.getGroupList);
//groupRouter.get("/permission/:groupId");

export = groupRouter;