export class SuccessResponse {
    public code: number;
    public message: string;

    public constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class ErrorResponse {
    public errorNo: number;
    public message: string;

    public constructor(errorNo: number, message: string) {
        this.errorNo = errorNo;
        this.message = message;
    }
}

export class TokenResponse {
    public id: number
    public userId: string;
    public token: string;
    
    public constructor(id: number, userId: string, token: string) {
        this.id = id;
        this.userId = userId;
        this.token = token;
    }
}

export class Token {
    public id: number;
    public userId: string;
    public token: string;
    
    public constructor(id: number, userId: string, token: string) {
        this.id = id;
        this.userId = userId;
        this.token = token;
    }

    public static fromUser(user: User) {
        return new Token(user.id, user.userId, user.token);
    }
}

export class UserResponse {
    public id: number;
    public userId: string;
    public username: string;
    public email: string;
    public name: string;
    public status: string;
    public job: string;

    public constructor(id: number, userId: string, username: string, email: string, name: string, status: string, job: string) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.name = name;
        this.status = status;
        this.job = job;
    }

    public static fromUser(user: User): UserResponse {
        return new UserResponse(user.id, user.userId, user.username, user.email, user.name, user.status, user.job);
    }
}

export class User {
    public id: number;
    public userId: string;
    public username: string;
    public password: string
    public email: string;
    public name: string;
    public birth: number;
    public status: string;
    public token: string;
    public job: string;

    public constructor(id: number, userId: string, username: string, password: string, email: string, name: string, birth: number, status: string, token: string, job: string) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.birth = birth;
        this.status = status;
        this.token = token;
        this.job = job;
    }
}

export class UserSummary {
    public id: number;
    public name: string;

    public constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class Group {
    public id: number;
    public projectId: number;
    public name: string;
    public createdBy: number;
    public invisibleDefault: boolean = true;
    public channels?: Array<Channel>

    public constructor(id: number, projectId: number, name: string, createdBy: number, channels?: Array<Channel>, invisibleDefault?: boolean) {
        this.id = id;
        this.projectId = projectId;
        this.name = name;
        this.createdBy = createdBy;
        this.channels = channels
        if (!invisibleDefault) {
            this.invisibleDefault = false;
        }
    }
}

export class Channel {
    public id: number;
    public projectId: number;
    public groupId: number;
    public name: string;
    public type: string;
    public createdBy: number;
    public bitRate: number;
    public maxConnect: number;

    public constructor(id: number, projectId: number, groupId: number, name: string, type: string, createdBy: number, bitRate: number, maxConnect: number) {
        this.id = id;
        this.projectId = projectId;
        this.groupId = groupId;
        this.name = name;
        this.type = type;
        this.createdBy = createdBy;
        this.bitRate = bitRate;
        this.maxConnect = maxConnect;
    }
}

export class ProjectInvite {
    public id: number;
    public code: string;
    public projectId: number;
    public userId?: number;
    public expired?: number;

    public constructor(id: number, projectId: number,  code: string, expired?: number, userId?: number) {
        this.id = id;
        this.projectId = projectId;
        this.code = code;
        this.userId = userId;
        this.expired = expired;
    }
}

export class Project {
    public id: number;
    public name: string;
    public createdBy: number;
    public groups?: Array<Group>

    public constructor(id: number, name: string, createdBy: number, groups?: Array<Group>) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.groups = groups;
    }
}

export class ProjectPermission {
    public id: number;
    public projectId: number;
    public userId: number;
    public permission: number;

    public constructor(id: number, projectId: number, userId: number, permission: number) {
        this.id = id;
        this.projectId = projectId;
        this.userId = userId;
        this.permission = permission;
    }
}