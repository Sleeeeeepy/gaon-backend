import { ProjectInvite } from "../model/Model"

export default interface IProjectInviteDAO {
    createInvite(projectInvite: ProjectInvite): Promise<ProjectInvite>;
    deleteInvite(id: number): Promise<void>;
    updateInvite(projectInvite: ProjectInvite): Promise<void>;
    getInvite(param: string | number): Promise<ProjectInvite>;
    getInviteList(projectId: number): Promise<Array<ProjectInvite>>;
}