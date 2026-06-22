import { serverMutation } from "../core/server";

export const updateUser = async (id, data) => {
    const result = serverMutation(`/api/user/${id}`, data, 'PATCH');
    return result;
}

export const updateUserRoleStatus = async (id, data) => {
    const result = serverMutation(`/api/user/role-status/${id}`, data, 'PATCH');
    return result;
}