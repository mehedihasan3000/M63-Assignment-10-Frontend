import { serverQuery } from "../core/server"

export const getAllUsers = async () => {
    const users = await serverQuery("/api/all-users");
    return users;
}