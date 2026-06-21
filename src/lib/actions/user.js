import { serverMutation } from "../core/server";

export const updateUser = async (id, data) => {
    const result = serverMutation(`/api/user/${id}`, data, 'PATCH');
    // revalidatePath('/dashboard/admin/companies');
    return result;
}