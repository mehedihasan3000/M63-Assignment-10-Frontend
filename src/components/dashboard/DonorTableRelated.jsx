"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Table } from '@heroui/react';
import {
    Eye,
    Pencil,
    TrashBin,
    Check,
    Xmark,
    CircleInfo,
    Person,
    Envelope
} from '@gravity-ui/icons';
import { deleteDonationRequest, getDonationRequests } from '@/lib/api/donations';
import { updateDonationStatus } from '@/lib/actions/donationrequest';

export default function DonorDashboardHome({ condition }) {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal tracking states for target deletion
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [targetRequestId, setTargetRequestId] = useState(null);
    const [isActionProcessing, setIsActionProcessing] = useState(false);

    // Fetch only the 3 most recent donation requests submitted by this donor
    useEffect(() => {
        if (session?.user?.email) {
            fetchRequests();
        }
    }, [session]);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            // Fetch user requests from backend Node/Express API configurations
            const response = await getDonationRequests(session?.user?.email);
            if (condition) {
                setRequests(response?.slice(0, 3));
            } else {
                setRequests(response);
            }
        } catch (error) {
            console.error("Error retrieving historical records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Status mutation updates (inprogress -> done / canceled)
    const handleUpdateStatus = async (id, newStatus) => {
        setIsActionProcessing(true);
        try {
            const response = await updateDonationStatus(id, { donationStatus: newStatus });
            if (response) {
                // Optimistic UI state synchronization
                setRequests(prev => prev.map(req =>
                    req._id?.$oid === id || req._id === id ? { ...req, donationStatus: newStatus } : req
                ));
            }
        } catch (error) {
            console.error("Failed to alter status field:", error);
        } finally {
            setIsActionProcessing(false);
        }
    };

    // Trigger modal overlay initialization
    const openDeleteConfirmation = (id) => {
        setTargetRequestId(id);
        setIsDeleteModalOpen(true);
    };

    // Permanent document removal processor
    const confirmDeleteRequest = async () => {
        if (!targetRequestId) return;
        setIsActionProcessing(true);
        try {
            const response = await deleteDonationRequest(targetRequestId);
            if (response) {
                setIsDeleteModalOpen(false);
                setTargetRequestId(null);
                fetchRequests(); // Re-sync local dataset rows
            }
        } catch (error) {
            console.error("Failed to discard document registry:", error);
        } finally {
            setIsActionProcessing(false);
        }
    };

    // Helper parser for custom object nested calendar structures
    const formatCustomDate = (dateObj) => {
        if (!dateObj) return 'N/A';
        if (dateObj.day && dateObj.month && dateObj.year) {
            return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
        }
        return new Date(dateObj).toLocaleDateString();
    };

    // Helper map for clean Tailwind visual semantic labels
    const getStatusBadgeStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'inprogress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'done': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'canceled': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    if (sessionLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 animate-pulse font-medium">Synchronizing application dashboard matrix...</p>
            </div>
        );
    }

    const hasRequests = requests && requests.length > 0;

    return (
        <main className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-10">

            {/* --- HISTORICAL TABULAR VISUALIZATION SECTION --- */}
            {hasRequests && (
                <section className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
                    {
                        requests.length === 3 && <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Recent Donation Requests</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Your 3 most recently created diagnostic entries</p>
                            </div>
                        </div>
                    }

                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Donor configuration historical data logs table">
                                <Table.Header>
                                    <Table.Column isRowHeader>Recipient Name</Table.Column>
                                    <Table.Column>Recipient Location</Table.Column>
                                    <Table.Column>Schedule Parameters</Table.Column>
                                    <Table.Column>Blood Group</Table.Column>
                                    <Table.Column>Status Details</Table.Column>
                                    <Table.Column>Assigned Donor Information</Table.Column>
                                    <Table.Column className="text-right">Actions Operations</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {requests.map((item) => {
                                        const idString = item._id?.$oid || item._id;
                                        const isInProgress = item.donationStatus === 'inprogress';

                                        return (
                                            <Table.Row key={idString} className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors">

                                                {/* Recipient Identifier Column */}
                                                <Table.Cell className="font-medium text-slate-950">
                                                    {item.recipientName}
                                                </Table.Cell>

                                                {/* Location Context Compilation */}
                                                <Table.Cell className="text-slate-600 text-xs max-w-[180px] truncate">
                                                    {item.recipientUpazila}, {item.recipientDistrict}
                                                </Table.Cell>

                                                {/* Date & Time Blocks */}
                                                <Table.Cell className="text-xs text-slate-700">
                                                    <div className="font-medium">{formatCustomDate(item.donationDate)}</div>
                                                    <div className="text-slate-400 mt-0.5">{item.donationTime}</div>
                                                </Table.Cell>

                                                {/* Blood Type Group Marker */}
                                                <Table.Cell>
                                                    <span className="inline-flex items-center justify-center font-bold px-2.5 py-1 text-xs text-rose-700 bg-rose-50 rounded-md border border-rose-100">
                                                        {item.bloodGroup}
                                                    </span>
                                                </Table.Cell>

                                                {/* Context-Specific Status State Badge Matrix */}
                                                <Table.Cell>
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(item.donationStatus)}`}>
                                                            {item.donationStatus}
                                                        </span>

                                                        {/* Dynamic Inline Interventions for inprogress instances */}
                                                        {isInProgress && (
                                                            <div className="flex gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateStatus(idString, 'done')}
                                                                    disabled={isActionProcessing}
                                                                    className="inline-flex items-center gap-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-colors disabled:opacity-50"
                                                                    title="Mark Request as Done"
                                                                >
                                                                    <Check width={12} height={12} /> Done
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateStatus(idString, 'canceled')}
                                                                    disabled={isActionProcessing}
                                                                    className="inline-flex items-center gap-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-colors disabled:opacity-50"
                                                                    title="Cancel Request"
                                                                >
                                                                    <Xmark width={12} height={12} /> Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Table.Cell>

                                                {/* Inline Assigned Volunteer Donor Meta Details */}
                                                <Table.Cell className="text-xs text-slate-600">
                                                    {isInProgress && (item.donorName || item.donorEmail) ? (
                                                        <div className="space-y-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                                            {item.donorName && (
                                                                <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                                                                    <Person width={10} height={10} className="text-slate-400" /> {item.donorName}
                                                                </div>
                                                            )}
                                                            {item.donorEmail && (
                                                                <div className="flex items-center gap-1 text-slate-400 truncate text-[11px]">
                                                                    <Envelope width={10} height={10} /> {item.donorEmail}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">No active match</span>
                                                    )}
                                                </Table.Cell>

                                                {/* Administrative Operations Action Matrix Grouping */}
                                                <Table.Cell className="text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Link
                                                            href={`/dashboard/donation-request/${idString}`}
                                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                                            title="View Document Details"
                                                        >
                                                            <Eye width={14} height={14} />
                                                        </Link>
                                                        {
                                                            session?.user?.role === 'admin' && <>
                                                                <Link
                                                                    href={`/dashboard/edit-donation-request/${idString}`}
                                                                    className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
                                                                    title="Modify Registry Fields"
                                                                >
                                                                    <Pencil width={14} height={14} />
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => openDeleteConfirmation(idString)}
                                                                    className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg transition-colors"
                                                                    title="Delete Record Entry"
                                                                >
                                                                    <TrashBin width={14} height={14} />
                                                                </button>
                                                            </>
                                                        }

                                                    </div>
                                                </Table.Cell>

                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {/* --- CASCADING VIEW REDIRECT LINK ACTION TRIGGER --- */}
                    {
                        requests.length === 3 && (
                            <div className="pt-4 border-t border-slate-100 flex justify-center">
                                <Link
                                    href="/dashboard/my-donation-requests"
                                    className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                                >
                                    View My All Requests
                                </Link>
                            </div>
                        )
                    }
                </section>
            )}

            {/* --- CONFIRMATION ACTION DIALOG OVERLAY (MODAL) --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                                <CircleInfo width={20} height={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Confirm Record Removal</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Are you entirely sure you want to permanently delete this blood donation request registry? This operation is irreversible.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
                            <button
                                type="button"
                                onClick={() => { setIsDeleteModalOpen(false); setTargetRequestId(null); }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                disabled={isActionProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteRequest}
                                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                                disabled={isActionProcessing}
                            >
                                {isActionProcessing ? 'Deleting...' : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}