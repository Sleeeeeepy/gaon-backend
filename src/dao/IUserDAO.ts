import { User } from "../model/Model";

export default interface IUserDAO {
    getUser(id: number): Promise<User>;
    getUser(userId: string): Promise<User>;
    addUser(user: User): Promise<User>;
    updateUser(user: User): Promise<void>;
    deleteUser(id: string): Promise<void>;
}