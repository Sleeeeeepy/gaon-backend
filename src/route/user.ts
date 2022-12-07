import express from 'express';
import UserService from '../controller/userService';

const userRouter = express.Router();
const service = new UserService();
userRouter.get("/:userId", service.getProfile);
userRouter.post("/", service.signup);
userRouter.patch("/", service.updateUser);
userRouter.get('/admin/permission', service.getPermission);
userRouter.get('/admin/permission/list', service.listPermission);
userRouter.post('/admin/permission', service.addPermission);
// 권한 제거
userRouter.put('/admin/permission', service.deletePermission);
//강퇴
userRouter.delete('/admin/permission', service.ban)
//router.post("/user/password-reset", );
//router.get("/image/avatar", );

export = userRouter;