import { Request, Response } from 'express';
import ProjectImpl from '../dao/impl/ProjectImpl';
import ProjectPermissionImpl from '../dao/impl/ProjectPermissionImpl';
import UserImpl from '../dao/impl/UserImpl';
import { Authentication } from '../decorator/Auth';
import { Permission } from '../decorator/Permission';
import { Project } from '../model/Model';
import { handleException, success } from './common';

export default class ProjectService {
    private static pDao = new ProjectImpl();
    private static ppDao = new ProjectPermissionImpl();
    private static uDao = new UserImpl();

    @Authentication()
    public async addProject(req: Request, res: Response) {
        let userId = Number.parseInt(req.body.userId as string);
        let name = req.body.name as string;
    
        let project = new Project(0, name, userId);
    
        try {
            let response = await ProjectService.pDao.createProject(project);
            res.json(response);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async deleteProject(req: Request, res: Response) {
        let userId = Number.parseInt(req.query.userId as string);
        let projectId = Number.parseInt(req.params.projectId);
        
        try {
            await ProjectService.pDao.deleteProject(projectId);
            res.json(success);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    @Permission()
    public async updateProject(req: Request, res: Response) {
        let name = req.body.name as string;
        let projectId = Number.parseInt(req.params.projectId);
    
        try {
            let project = await ProjectService.pDao.getProject(projectId);
            if (name) {
                project.name = name;
            }
            await ProjectService.pDao.updateProject(project);
            res.json(project);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getProject(req: Request, res: Response) {
        let projectId = Number.parseInt(req.params.projectId);
    
        try {
            let project = await ProjectService.pDao.getProject(projectId);
            res.json(project);
        } catch (err) {
            handleException(res, err);
        }
    }
    
    public async getProjectList(req: Request, res: Response) {
        let userId = Number.parseInt(req.params.userId);
    
        try {
            let list = await ProjectService.pDao.getProjectList(userId);
            res.json(list);
        } catch (err) {
            handleException(res, err);
        }
    }
}
