import express from 'express';
import InviteService from '../controller/inviteService';

const inviteRouter = express.Router();
const service = new InviteService();
inviteRouter.get('/project/:projectId', service.getInvites);
inviteRouter.get('/accept/:code', service.acceptInvite);
inviteRouter.get('/:code', service.getInviteProjectInfo);
inviteRouter.post('/', service.doInvite);
inviteRouter.delete('/:inviteId', service.cancelInvite);

export = inviteRouter;