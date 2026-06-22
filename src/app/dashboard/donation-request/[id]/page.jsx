import React from 'react';
import { getDonationRequestById } from '@/lib/api/donations';
import { getUserSession } from '@/lib/core/session';
import Link from 'next/link';
import DonationDetailsPanel from '../DonationDetailPanel';

const DonationRequestDetailsPage = async ({ params }) => {
    
    const { id } = await params;

    // Fetch matching data logs directly on the server level
    const donationRequestDetails = await getDonationRequestById(id);
    const loggedInUser = await getUserSession();
    
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            {/* Header Directory Path */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/dashboard/donation-requests" 
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    ← Back to all requests
                </Link>
            </div>

            {/* Mount Client Panel passing Server Context seamlessly */}
            <DonationDetailsPanel 
                request={donationRequestDetails} 
                user={loggedInUser} 
            />
        </div>
    );
};

export default DonationRequestDetailsPage;