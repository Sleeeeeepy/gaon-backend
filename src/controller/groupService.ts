import { Request, Response } from 'express';
import GroupImpl from '../dao/impl/GroupImpl';
import { Permission } from '../decorator/Permission';
import { Group } from '../model/Model';
import { HttpError } from '../model/Response';
import { handleException, success } from './common';

export default class GroupService {
    private static gDao = new GroupImpl();
    
    public async getGroupList(req: Request, res: Response) {
        let projectId = req.params.projectId;
        let id = Number.parseInt(projectId as string);
    
        try {
            let cList = await GroupService.gDao.getGroupList(id);
            res.json(cList);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getGroup(req: Request, res: Response) {
        let groupId = Number.parseInt(req.params.groupId as string);
    
        try {
            let group = await GroupService.gDao.getGroup(groupId);
            res.json(group);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    // 인증 필요
    @Permission()
    public async addGroup(req: Request, res: Response) {
        let name = req.body.name as string;
        let projectId = Number.parseInt(req.body.projectId as string);
        let createdBy = Number.parseInt(req.body.userId as string);

        if (!createdBy) {
            throw new HttpError(500, "Internal Server Error");
        }
    
        try {
            let group = new Group(0, projectId, name, createdBy)
            let result = await GroupService.gDao.createGroup(group);
            res.json(result);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async deleteGroup(req: Request, res: Response) {
        let groupId = Number.parseInt(req.params.groupId as string);

        try {
            if (!groupId) {
                throw new HttpError(404, "groupId");
            }
    
            await GroupService.gDao.deleteGroup(groupId);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async updateGroup(req: Request, res: Response) {
        let groupId = Number.parseInt(req.params.groupId as string);
        let name = req.body.name as string;

        try {
            let group = await GroupService.gDao.getGroup(groupId);
            if (name) {
                group.name = name;
            }
    
            await GroupService.gDao.updateGroup(group.id, group.name);
            res.json(group);
        } catch (err) {
            handleException(res, err);
        }
    }
}
