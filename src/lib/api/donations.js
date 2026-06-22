import { serverDelete, serverQuery } from "../core/server";

export const getDonationRequests = async (email) => {
    return await serverQuery(`/api/donation-requests/recent?email=${email}`);
}

export const getAllDonationRequests = async () => {
    return await serverQuery(`/api/all-blood-donation-requests`);
}

export const deleteDonationRequest = async (id) => {
    return await serverDelete(`/api/donations/${id}`);
}

export const getDonationRequestById = async (id) => {
    return await serverQuery(`/api/donation-request/${id}`);
}