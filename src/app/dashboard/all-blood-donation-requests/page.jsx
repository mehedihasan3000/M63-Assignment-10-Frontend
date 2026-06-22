import { getAllDonationRequests } from '@/lib/api/donations';
import React from 'react';
import DonationRequestsTable from './DonationRequestsTable';
import { getUserSession } from '@/lib/core/session';

const AllBloodDonationRequests = async () => {
    // Read historical logs directly from MongoDB on the server-side architecture
    const donationRequests = await getAllDonationRequests();
    const user = await getUserSession();

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Blood Donation Requests Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                    Manage and overview all historical logs. Total active records: <span className="font-semibold text-slate-800">{donationRequests.length}</span>
                </p>
            </div>

            {/* Passes fetched initial MongoDB payload into the clean table context */}
            <DonationRequestsTable initialRequests={donationRequests} user={user} />
        </div>
    );
};

export default AllBloodDonationRequests;