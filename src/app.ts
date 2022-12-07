import express from 'express';
import { rateLimit } from 'express-rate-limit';
import * as config from './serverconfig.json';
import userRouter from './route/user';
import authRouter from './route/auth';
import channelRouter from './route/channel';
import groupRouter from './route/group';
import projectRouter from './route/project';
import inviteRouter from './route/invite';
import Connection from './dao/Connection'

run();

export function run(port: number = config.port) {
    const app = express();
    const limit = rateLimit({ // 100 requests per 60 seconds
        windowMs: 60 * 1000,
        max: 100
    });

    app.use(limit);
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/user', userRouter);
    app.use('/auth', authRouter);
    app.use('/channel', channelRouter);
    app.use('/group', groupRouter);
    app.use('/project', projectRouter);
    app.use('/invite', inviteRouter);

    app.listen(port, () => {
        console.log(`The server is listening on port ${port}.`);
    });
}