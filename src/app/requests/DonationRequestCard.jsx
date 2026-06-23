import React from 'react';
import { Card } from "@heroui/react";
import Link from 'next/link';

const DonationRequestCard = ({ request }) => {
    // Extract internal MongoDB string identifier safely
    const requestId = request?._id?.$oid || request?._id;

    // Helper map to transform calendar month integers to strings
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateObj = request?.donationDate;
    const formattedDate = dateObj ? `${String(dateObj.day).padStart(2, '0')}-${String(dateObj.month).padStart(2, '0')}-${dateObj.year}` : 'N/A';

    return (
        <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
            {/* Upper Context Header */}
            <Card.Header className="p-5 flex items-start justify-between gap-4 border-b border-slate-50">
                <div className="space-y-1">
                    <Card.Title className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {request?.recipientName}
                    </Card.Title>
                    <Card.Description className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {request?.recipientUpazila}, {request?.recipientDistrict}
                    </Card.Description>
                </div>
                
                {/* Visual Blood Group Marker Badge */}
                <span className="inline-flex items-center justify-center font-black text-lg px-3 py-1.5 text-rose-700 bg-rose-50 rounded-xl border border-rose-100 min-w-[52px] shadow-sm tracking-tighter">
                    {request?.bloodGroup}
                </span>
            </Card.Header>

            {/* Middle Schedule Meta Content */}
            <Card.Content className="p-5 space-y-3 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Date</span>
                        <p className="text-sm font-semibold text-slate-700">{formattedDate}</p>
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Time</span>
                        <p className="text-sm font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-max text-xs">
                            {request?.donationTime || 'Not specified'}
                        </p>
                    </div>
                </div>

                {request?.requestMessage && (
                    <p className="text-xs text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-50">
                        &quot;{request?.requestMessage}&quot;
                    </p>
                )}
            </Card.Content>

            {/* Lower Navigation Footer Link Actions */}
            <Card.Footer className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
                <Link
                    href={`/dashboard/donation-request/${requestId}`}
                    className="w-full text-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs py-2 px-4 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-98 block"
                >
                    View Request Details
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default DonationRequestCard;