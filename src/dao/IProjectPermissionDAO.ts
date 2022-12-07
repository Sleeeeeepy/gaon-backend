import { ProjectPermission } from "../model/Model";

export default interface IProjectPermissionDAO {
    setPermission(projectId: number, userId: number, permission: number): Promise<void>;
    updatePermission(projectId: number, userId: number, permission: number): Promise<void>
    deletePermission(projectId: number, userId: number): Promise<void>;
    getPermission(projectId: number, userId: number): Promise<ProjectPermission>;
} 