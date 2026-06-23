// import { redirect } from "next/navigation";
import { getUserSession } from "./session";
import { getUserToken } from "./token";

export const authHeader = async () => {
    const token = await getUserToken();
    const header = {
        authorization: `Bearer ${token}`
    }
    return token ? header : {};
}

export const serverMutation = async (url, donationData, method = 'POST') => {
    try {
        const user = await getUserSession();
        if (user?.status === 'blocked') {
            throw new Error('You are blocked');
            // return;
            // redirect('/dashboard/not-access');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ... await authHeader(),
            },
            body: JSON.stringify(donationData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server mutation:', error);
        throw error;
    }
}

export const serverQuery = async (url) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ... await authHeader(),
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server query:', error);
        throw error;
    }
}

export const unprotectedServerQuery = async (url) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server query:', error);
        throw error;
    }
}

export const serverDelete = async (url) => {
    const user = await getUserSession();
    if (user?.status === 'blocked') {
        throw new Error('You are blocked');
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ... await authHeader(),
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server delete:', error);
        throw error;
    }
}