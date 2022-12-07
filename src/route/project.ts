import express from 'express';
import ProjectService from '../controller/projectService';

const projectRouter = express.Router();
const service = new ProjectService();
projectRouter.get('/:projectId', service.getProject);
projectRouter.post('/', service.addProject);
projectRouter.delete('/:projectId', service.deleteProject);
projectRouter.put('/:projectId', service.updateProject);
projectRouter.get('/list/:userId', service.getProjectList);

export = projectRouter;