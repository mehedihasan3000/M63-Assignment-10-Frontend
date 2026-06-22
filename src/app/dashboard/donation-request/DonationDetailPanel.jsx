'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDonationStatus } from '@/lib/actions/donationrequest';

const DonationDetailsPanel = ({ request, user }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(request?.donationStatus || 'pending');

    const idString = request?._id?.$oid || request?._id;

    // Helper to extract nextUI custom calendar dates format
    const formatCustomDate = (dateObj) => {
        if (!dateObj || !dateObj.year) return 'N/A';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${dateObj.day} ${months[dateObj.month - 1]}, ${dateObj.year}`;
    };

    // Submits the volunteer request form to your API layer
    const handleConfirmDonation = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // const res = await fetch(`http://localhost:8000/api/donation-request/${idString}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         donationStatus: 'inprogress',
            //         // donorName: user?.name || 'Anonymous Donor',
            //         // donorEmail: user?.email || 'No email provided',
            //     }),
            // });

            const res = await updateDonationStatus(idString, {
                donationStatus: 'inprogress',
                // donorName: user?.name || 'Anonymous Donor',
                // donorEmail: user?.email || 'No email provided',
            });

            if (res) {
                setCurrentStatus('inprogress');
                setIsModalOpen(false);
                router.refresh(); // Refresh server state sync
            } else {
                alert('Failed to update request status. Please try again.');
            }
        } catch (error) {
            console.error('Error matching donor payload to registry:', error);
            alert('A system error occurred. Please check your connections.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Top Identity Grid Block */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Patient Request</span>
                    <h2 className="text-2xl font-bold text-slate-900">{request?.recipientName}</h2>
                    <p className="text-sm text-slate-500">Requested by: {request?.requesterName} ({request?.requesterEmail})</p>
                </div>
                <div>
                    <span className="inline-flex items-center justify-center text-2xl font-black px-4 py-2 text-rose-700 bg-rose-50 rounded-xl border border-rose-100 min-w-[70px] shadow-sm">
                        {request?.bloodGroup}
                    </span>
                </div>
            </div>

            {/* Core Details Grid Meta Matrix */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Logistical Parameters</h3>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Location:</span>
                        <span className="col-span-2 text-slate-700 font-medium">{request?.recipientUpazila}, {request?.recipientDistrict}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Hospital:</span>
                        <span className="col-span-2 text-slate-700 font-medium">{request?.hospitalName}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Full Address:</span>
                        <span className="col-span-2 text-slate-600 text-xs leading-relaxed">{request?.fullAddressLine}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Schedule Configuration</h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Target Date:</span>
                        <span className="col-span-2 text-slate-700 font-semibold">{formatCustomDate(request?.donationDate)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Target Time:</span>
                        <span className="col-span-2 text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded text-xs w-max">{request?.donationTime}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-slate-400">Status State:</span>
                        <span className={`col-span-2 capitalize font-semibold text-xs ${
                            currentStatus === 'pending' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                            • {currentStatus}
                        </span>
                    </div>
                </div>

                {request?.requestMessage && (
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-50 space-y-1.5">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase">Message Context</h4>
                        <p className="text-sm text-slate-600 italic bg-slate-50/70 p-3 rounded-xl border border-slate-100/50">
                            &quot;{request?.requestMessage}&quot;
                        </p>
                    </div>
                )}
            </div>

            {/* Dynamic Bottom Interactive Action Zone */}
            <div className="px-6 py-4 md:px-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                {currentStatus === 'pending' ? (
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-95"
                    >
                        Donate Blood Now
                    </button>
                ) : (
                    <button
                        disabled
                        className="bg-slate-200 text-slate-400 font-medium text-sm px-6 py-2.5 rounded-xl cursor-not-allowed"
                    >
                        Request Already In Progress
                    </button>
                )}
            </div>

            {/* Micro Interaction Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Confirm Donation Assignment</h3>
                            <p className="text-xs text-slate-400 mt-0.5">By clicking confirm, you accept this request profile logs.</p>
                        </div>

                        <form onSubmit={handleConfirmDonation} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Donor Name</label>
                                <input
                                    type="text"
                                    value={user?.name || 'Anonymous User'}
                                    readOnly
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium cursor-not-allowed outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Donor Email</label>
                                <input
                                    type="email"
                                    value={user?.email || 'No email attached'}
                                    readOnly
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {isSubmitting ? 'Confirming...' : 'Confirm Match'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationDetailsPanel;