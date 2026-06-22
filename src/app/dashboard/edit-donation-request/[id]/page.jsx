import React from 'react';
import { getDonationRequestById } from '@/lib/api/donations';
import EditDonationForm from '../EditDonationForm';

const EditDonationRequest = async ({ params }) => {
    
    const { id } = await params;

    // Fetch matching data logs directly from database layer
    const donationRequestDetails = await getDonationRequestById(id);
    
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 relative">
            <EditDonationForm initialData={donationRequestDetails} />
        </div>
    );
};

export default EditDonationRequest;