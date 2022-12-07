import { Request, Response } from 'express';
import ProjectInviteImpl from '../dao/impl/ProjectInviteImpl';
import ProjectPermissionImpl from '../dao/impl/ProjectPermissionImpl';
import { randomBytes } from 'crypto';
import { ProjectInvite } from '../model/Model';
import ProjectImpl from '../dao/impl/ProjectImpl';
import { handleException, success } from './common';
import { Permission } from '../decorator/Permission';
import { Authentication } from '../decorator/Auth';
import UserImpl from '../dao/impl/UserImpl';

export default class InviteService {
    private static pDao = new ProjectImpl();
    private static ppDao = new ProjectPermissionImpl();
    private static iDao = new ProjectInviteImpl();
    private static uDao = new UserImpl();

    @Permission()
    public async doInvite(req: Request, res: Response) {
        let userId = Number.parseInt(req.body.userId);
        let projectId = Number.parseInt(req.body.projectId);
        let code = randomBytes(16).toString('base64url');
        let expired: number | undefined = Number.parseInt(req.body.expired);
        let userToInvite: string = req.body.userToInvite;
    
        if (!expired || expired == 0) {
            expired = undefined;
        }
    
        if (!userToInvite) {
            throw new Error("Failed to invite");
        }
    
        try {
            let user = await InviteService.uDao.getUser(userToInvite);
            let invite = new ProjectInvite(0, projectId, code, expired, user.id);
            let ret = await InviteService.iDao.createInvite(invite);
            res.json(ret);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Authentication()
    public async acceptInvite(req: Request, res: Response) {
        let code = req.params.code as string;
        let accept = req.headers['accept'] as string === 'true';
        let token = req.headers['x-access-token'] as string;
    
        try {
            let user_info = await InviteService.uDao.getUserByToken(token);
            let invite = await InviteService.iDao.getInvite(code);
            if (invite.userId && invite.userId !== user_info.id) {
                throw new Error("You aren't invited.");
            }
    
            await InviteService.iDao.deleteInvite(invite.id);
            if (accept) {
                await InviteService.ppDao.setPermission(invite.projectId, user_info.id, 0);
            }
    
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async cancelInvite(req: Request, res: Response) {
        let inviteId = Number.parseInt(req.query.inviteId as string);
        try {
            await InviteService.iDao.deleteInvite(inviteId);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getInvites(req: Request, res: Response) {
        let projectId = Number.parseInt(req.query.projectId as string);
    
        try {
            let invites = await InviteService.iDao.getInviteList(projectId);
            res.json(invites);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getInviteProjectInfo(req: Request, res: Response) {
        let code = req.params.code as string;
    
        try {
            let invite = await InviteService.iDao.getInvite(code);
            let project = await InviteService.pDao.getProject(invite.projectId);
            res.json(project);
        } catch (err) {
            handleException(res, err);
        }
    }
}