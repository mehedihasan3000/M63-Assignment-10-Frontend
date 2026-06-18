import { serverMutation, serverQuery } from "../core/server";

export const donationRequest = async (donationData) => {
    // console.log("donation data from action", donationData);
    return await serverMutation("/api/create-donation-request", donationData);
}

export const getDonationRequests = async () => {
    return await serverQuery("get-donation-requests");
}
