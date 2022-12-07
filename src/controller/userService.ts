import { Request, Response } from 'express';
import UserImpl from '../dao/impl/UserImpl';
import * as crypto from 'crypto';
import { User, UserResponse } from '../model/Model';
import { handleException, success } from './common';
import { HttpError } from '../model/Response';
import { Authentication } from '../decorator/Auth';
import { Permission } from '../decorator/Permission';
import ProjectPermissionImpl from '../dao/impl/ProjectPermissionImpl';

export default class UserService {
    private static uDao = new UserImpl();
    private static ppDao = new ProjectPermissionImpl();

    public async signup(req: Request, res: Response) {
        let userId = req.body.userId as string;
        let password = req.body.password as string;
        let username = req.body.username as string;
        let birthday = Number.parseInt(req.body.birth as string);
        let email = req.body.email as string;
        let name = req.body.name as string;

        try {
            if (!password) {
                throw new Error("Failed to signup. no password");
            }
            let pw_hash = crypto.createHash("sha256").update(password).digest("hex");
            console.log("new user pw", password, pw_hash);
            let randomToken = crypto.randomBytes(64).toString();
            let user = new User(0, userId, username, pw_hash, email, name, birthday, "offline", randomToken, "Person");
            let new_user = await UserService.uDao.addUser(user);
            new_user.token = "";
            res.json(new_user);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async checkId(req: Request, res: Response) {
        let userId = req.body.userId;
    
        try {
            let user = await UserService.uDao.getUser(userId);
            if (!user) {
                res.json(success);
            }
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getProfile(req: Request, res: Response) {
        let userId: string = req.params.userId as string;

        try {
            let user = await UserService.uDao.getUser(userId);
            if (!user) {
                throw new HttpError(404, "no such user");
            }
            res.json(UserResponse.fromUser(user));
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Authentication()
    public async updateUser(req: Request, res: Response) {
        let userId = req.body.id as string;
        let username = req.body.username;
        let name = req.body.name;
        let birthday = req.body.birth;
        let email = req.body.email;
    
        try {
            let user = await UserService.uDao.getUser(userId);
            if (username) {
                user.username = username;
            }
    
            if (name) {
                user.name = name;
            }
    
            if (birthday) {
                user.birth = birthday;
            }
    
            if (email) {
                // TODO: 이메일 인증 추가
                user.email = email;
            }
    
            await UserService.uDao.updateUser(user);
            res.json(user);
        } catch (err) {
            handleException(res, err);
        }
    }

    public async getPermission(req: Request, res: Response) {
        let projectId = Number.parseInt(req.query.projectId as string);
        let userId = Number.parseInt(req.query.userId as string);
    
        try {
            let perm = await UserService.ppDao.getPermission(projectId, userId);
            res.json(perm);
        } catch (err) {
            handleException(res, err);
        }
    }

    public async listPermission(req: Request, res: Response) {
        let projectId = Number.parseInt(req.query.projectId as string);

        try {
            let perm = await UserService.ppDao.listPermission(projectId);
            res.json(perm);
        } catch (err) {
            handleException(res, err);
        }
    }

    @Permission()
    public async addPermission(req: Request, res: Response) {
        let newAdminUsername = req.body.newAdminUsername as string;
        let projectId = Number.parseInt(req.body.projectId as string);
    
        try {
            let user = await UserService.uDao.getUser(newAdminUsername)
            await UserService.ppDao.updatePermission(projectId, user.id, 1);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async deletePermission(req: Request, res: Response) {
        let deleteAdminUserId = req.body.deleteAdminUserId as string;
        let projectId = Number.parseInt(req.body.projectId as string);
    
        try {
            let user = await UserService.uDao.getUser(deleteAdminUserId)
            await UserService.ppDao.updatePermission(projectId, user.id, 0);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    // 강퇴
    @Permission()
    public async ban(req: Request, res: Response) {
        let targetId = Number.parseInt(req.query.targetId as string);
        let projectId = Number.parseInt(req.query.projectId as string);
    
        try {
            await UserService.ppDao.deletePermission(projectId, targetId);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
}
