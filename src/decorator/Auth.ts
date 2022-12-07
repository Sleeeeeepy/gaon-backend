import { Request, Response } from "express";
import { handleException } from "../controller/common";
import UserImpl from "../dao/impl/UserImpl";
import { HttpError } from "../model/Response";
import { getUserIdFromRequest } from "./common";

export function Authentication() {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (args[0] && args[1]) {
                let req = args[0] as unknown as Request;
                let res = args[1] as unknown as Response;
                
                try {
                    const userId = getUserIdFromRequest(req);
                    const dao = new UserImpl();
                    const token = req.headers['x-access-token'] as string;
                    if (!token) {
                        throw new HttpError(511, "Authentication Required");
                    }
                    
                    if (token !== (await dao.getUser(userId)).token) {
                        throw new HttpError(401, "Unauthorized");
                    }
                    original.apply(this, args);
                } catch (err) {
                    handleException(res, err);
                }
            }
        }
    }
}