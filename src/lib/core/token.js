'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { getUserSession } from "./session";
import { redirect } from "next/navigation";

export const getUserToken = async () => {
    const { token } = await auth.api.getToken({
        headers: await headers()
    });
    return token || null;
}

export const requireRole = async (role) => {
    const user = await getUserSession();
    if (!user) {
        redirect("/login");
    }
    if (user?.role !== role) {
        redirect("/unauthorized");
    }
    return user;
}