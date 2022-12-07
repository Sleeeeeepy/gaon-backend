import { Request, Response } from 'express';
import UserImpl from '../dao/impl/UserImpl';
import * as crypto from "crypto";
import * as config from "../serverconfig.json";
import { handleException } from './common';
import { Token } from '../model/Model';
import { Authentication } from '../decorator/Auth';

export default class AuthService {
    private static userDAO = new UserImpl();
    public async login(req: Request, res: Response) {
        let uid = req.body.userId as string;
        let upw = req.body.password;
        let expire = new Date();
        expire.setMinutes(expire.getMinutes() + 30);
        if (!upw) {
            throw new Error("no password");
        }

        upw = crypto.createHash("sha256").update(upw).digest("hex");
        try {
            let user = await AuthService.userDAO.getUser(uid);
            let password = user.password;
            console.log(upw, password, upw === password);
            if (password === upw) {
                user.token = makeToken(user.userId, req.ip, expire.getMilliseconds());
                user.status = "online";
                await AuthService.userDAO.updateUser(user);
                res.json(Token.fromUser(user));
            } else {
                throw new Error("Failed to login.");
            }
        } catch (err) {
            handleException(res, err);
        }

        function makeToken(id: string, ip: string, time: number, secret: string = config.secret) {
            let str = `${id}${secret}${time}${ip}`;
            let hash = crypto.createHash("sha256").update(str).digest("hex");
            return hash;
        }
    }
    
    @Authentication()
    public async logout(req: Request, res: Response) {
        const token = req.headers['x-access-token'] as string;
        // let uid = Number.parseInt(req.body.userId as string);
        try {
            let user = await AuthService.userDAO.getUserByToken(token);
            user.token = crypto.randomBytes(64).toString();
            user.status = "offline";
            await AuthService.userDAO.updateUser(user);
            res.json({message: "bye"});
        } catch (err) {
            handleException(res, err);
        }
    }
}
