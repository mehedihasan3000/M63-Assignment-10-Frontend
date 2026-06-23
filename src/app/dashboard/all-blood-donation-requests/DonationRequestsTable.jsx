'use client';

import React, { useState } from 'react';
import { Table } from '@heroui/react';
import Link from 'next/link';
import { Check, Xmark, Person, Envelope, Eye, Pencil, TrashBin } from '@gravity-ui/icons';
import { deleteDonationRequest } from '@/lib/api/donations';
import { updateDonationStatus } from '@/lib/actions/donationrequest';

const DonationRequestsTable = ({ initialRequests = [], user }) => {
    const [requests, setRequests] = useState(initialRequests);
    const [isActionProcessing, setIsActionProcessing] = useState(false);

    // Formats the custom NextUI/HeroUI calendar date structure cleanly
    const formatCustomDate = (dateObj) => {
        if (!dateObj || !dateObj.year) return 'N/A';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${dateObj.day} ${months[dateObj.month - 1]}, ${dateObj.year}`;
    };

    // Return specific Tailwind class combinations based on request states
    const getStatusBadgeStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'inprogress':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'done':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'canceled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    // Inline patch operation handler to modify donation request status states
    const handleUpdateStatus = async (idString, newStatus) => {
        setIsActionProcessing(true);
        try {
            // const res = await fetch(`/api/donations/${idString}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ donationStatus: newStatus }),
            // });
            const res = await updateDonationStatus(idString, { donationStatus: newStatus });

            if (res) {
                setRequests((prev) =>
                    prev.map((item) => {
                        const currentId = item._id?.$oid || item._id;
                        return currentId === idString ? { ...item, donationStatus: newStatus } : item;
                    })
                );
            } else {
                console.error('Failed to update status on the server.');
            }
        } catch (error) {
            console.error('Error modifying donation request status registry:', error);
        } finally {
            setIsActionProcessing(false);
        }
    };

    // Row record deletion operations trigger system
    const openDeleteConfirmation = async (idString) => {
        if (!confirm('Are you absolutely sure you want to delete this donation request entry?')) return;

        setIsActionProcessing(true);

        try {
            const res = await deleteDonationRequest(idString);

            if (res) {
                setRequests((prev) => prev.filter((item) => (item._id?.$oid || item._id) !== idString));
            } else {
                console.error('Failed to eliminate database profile entry');
            }
        } catch (error) {
            console.error('Error dispatching record clear instructions:', error);
        } finally {
            setIsActionProcessing(false);
        }
    };

    return (
        <Table className="min-w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <Table.ScrollContainer>
                <Table.Content aria-label="Donor configuration historical data logs table">
                    <Table.Header>
                        {/* THE 'isRowHeader' PROP SOLVES THE ACCESSIBILITY EXCEPTION */}
                        <Table.Column isRowHeader>Recipient Name</Table.Column>
                        <Table.Column>Recipient Location</Table.Column>
                        <Table.Column>Schedule Parameters</Table.Column>
                        <Table.Column>Blood Group</Table.Column>
                        <Table.Column>Status Details</Table.Column>
                        <Table.Column>Assigned Donor Information</Table.Column>
                        <Table.Column className="text-right">Actions Operations</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {requests.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                                    No blood donation requests records found.
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            requests.map((item) => {
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
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadgeStyles(item.donationStatus)}`}>
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
                                                { user?.role === 'admin' || user?.role === 'volunteer' && <>
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
                            })
                        )}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    );
};

export default DonationRequestsTable;