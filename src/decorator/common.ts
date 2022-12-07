import { Request } from "express";
import { HttpError } from "../model/Response";

export function getUserIdFromRequest(req: Request) {
    let userId = 0;
    switch (req.method) {
        case "GET":
        case "DELETE":
            let params = req.params.userId;
            if (!params || params.length == 0) {
                userId = Number.parseInt(req.query.userId as string);
                break;
            }
            userId = Number.parseInt(params);
            break;
        case "POST":
        default:
            userId = Number.parseInt(req.body.userId as string);
            break;
    }
    
    if (isNaN(userId) || userId === 0) 
        throw new HttpError(404, "There is no such user");
    
    return userId;
}

export function getProjectIdFromRequest(req: Request) {
    let projectId = 0;
    switch (req.method) {
        case "GET":
        case "DELETE":
            let params = req.params.projectId;
            if (!params || params.length == 0) {
                projectId = Number.parseInt(req.query.projectId as string);
                break;
            }
            projectId = Number.parseInt(params);
            break;
        case "POST":
        default:
            projectId = Number.parseInt(req.body.projectId as string);
            break;
    }

    if (isNaN(projectId) || projectId === 0) 
        throw new HttpError(404, "There is no such project");

    return projectId;
}