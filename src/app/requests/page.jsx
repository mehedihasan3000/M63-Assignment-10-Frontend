import React from 'react';
import { getPendingDonationRequests } from '@/lib/api/donations';
import DonationRequestCard from './DonationRequestCard';

const PendingRequestsPage = async () => {
    // Fetch all donation requests with pending status from the API route layer
    const pendingDonationRequests = await getPendingDonationRequests() || [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            {/* Section Summary Module Header */}
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pending Blood Donations
                </h1>
                <p className="text-sm text-slate-500">
                    There are currently <span className="font-semibold text-rose-600">{pendingDonationRequests.length}</span> open matches looking for immediate donor tracking availability.
                </p>
            </div>

            {/* Dynamic Result Render State Mapping Matrix */}
            {pendingDonationRequests.length === 0 ? (
                <div className="w-full py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-sm text-slate-400 font-medium">No pending requests found at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingDonationRequests.map((requestItem) => {
                        const keyString = requestItem?._id?.$oid || requestItem?._id;
                        return (
                            <DonationRequestCard 
                                key={keyString} 
                                request={requestItem} 
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PendingRequestsPage;