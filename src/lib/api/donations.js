import { serverQuery } from "../core/server";

export const getDonationRequests = async (email) => {
    return await serverQuery(`/api/donation-requests/recent?email=${email}`);
}