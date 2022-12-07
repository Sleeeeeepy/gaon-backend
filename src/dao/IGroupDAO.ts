import { Group } from "../model/Model"

export default interface IGroupDAO {
    createGroup(group: Group): Promise<Group>;
    getGroup(groupId: number): Promise<Group>;
    updateGroup(groupId: number, groupName: string): Promise<void>;
    deleteGroup(groupId: number): Promise<void>;
    getGroupList(projectId: number): Promise<Array<Group>>;
}