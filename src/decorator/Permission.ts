import { Request, Response } from "express";
import { handleException } from "../controller/common";
import UserImpl from "../dao/impl/UserImpl";
import ProjectPermissionImpl from "../dao/impl/ProjectPermissionImpl"
import { HttpError } from "../model/Response";
import { getProjectIdFromRequest, getUserIdFromRequest } from "./common";

export function Permission() {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (args[0] && args[1]) {
                let req = args[0] as unknown as Request;
                let res = args[1] as unknown as Response;
                try {
                    const userId = getUserIdFromRequest(req);
                    const projectId = getProjectIdFromRequest(req);
                    const userDao = new UserImpl();
                    const projectPermissionDao = new ProjectPermissionImpl();
                    const token = req.headers['x-access-token'] as string;
                    if (!token) 
                        throw new HttpError(511, "Authentication Required");

                    if (token !== (await userDao.getUser(userId)).token) {
                        throw new HttpError(401, "Unauthorized");
                    }
                    let permission = await projectPermissionDao.getPermission(projectId, userId);
                    if (permission.permission < 0) {
                        throw new HttpError(403, "Permission Denied")
                    }    
                    original.apply(this, args);
                } catch (err) {
                    handleException(res, err);
                }
            }
        }
    }
}