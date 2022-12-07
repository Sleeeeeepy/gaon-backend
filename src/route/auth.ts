import express from 'express';
import AuthService from '../controller/authService';

const authRouter = express.Router();
const service = new AuthService();
authRouter.post("/login", service.login);
authRouter.post("/logout", service.logout);

export = authRouter;