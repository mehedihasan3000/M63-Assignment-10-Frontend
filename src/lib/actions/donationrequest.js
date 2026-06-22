import { serverMutation, serverQuery } from "../core/server";

export const donationRequest = async (donationData) => {
    // console.log("donation data from action", donationData);
    return await serverMutation("/api/create-donation-request", donationData);
}

export const updateDonationStatus = async (id, donationStatus) => {
    const result = serverMutation(`/api/donation-request/${id}`, donationStatus, 'PATCH');
    return result;
}

export const updateDonationRequests = async (id, donationData) => {
    const result = await serverMutation(`/api/donation-request/${id}`, donationData, 'PATCH');
    return result;
}