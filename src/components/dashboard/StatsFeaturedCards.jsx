import React from 'react';

const StatsFeaturedCards = ({ users = [], donations = [] }) => {
    // Safely extract lengths from arrays with fallbacks if data is still loading
    const totalUsersCount = users?.length || 0;
    const totalDonationsCount = donations?.length || 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2">
            
            {/* --- CARD 1: TOTAL REGISTERED USERS --- */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Community Strength
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight transition-transform group-hover:scale-102 origin-left duration-200">
                        {totalUsersCount.toLocaleString()}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Total Registered Users
                    </p>
                </div>
                
                {/* User Group Icon Wrapper */}
                <div className="w-14 h-14 bg-blue-50/80 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm transition-colors group-hover:bg-blue-100/70">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                </div>
            </div>

            {/* --- CARD 2: TOTAL DONATION REQUESTS --- */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Life-Saving Queries
                    </span>
                    <h3 className="text-3xl font-black text-rose-600 tracking-tight transition-transform group-hover:scale-102 origin-left duration-200">
                        {totalDonationsCount.toLocaleString()}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Total Blood Donation Requests
                    </p>
                </div>

                {/* Blood Drop/Heart Icon Wrapper */}
                <div className="w-14 h-14 bg-rose-50/80 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm transition-colors group-hover:bg-rose-100/70">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </div>
            </div>

        </div>
    );
};

export default StatsFeaturedCards;