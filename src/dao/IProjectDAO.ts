import { Project } from "../model/Model"

export default interface IProjectDAO {
    createProject(project: Project): Promise<Project>
    deleteProject(id: number): Promise<void>
    updateProject(project: Project): Promise<void>
    getProject(id: number): Promise<Project>
    getProjectList(userId: number): Promise<Array<Project>>
    getProjectRecursive(id: number): Promise<Project>
}