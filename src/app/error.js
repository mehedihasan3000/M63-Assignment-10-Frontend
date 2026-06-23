'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Safely log the error matrix out to tracking/analytic monitors
        console.error('Captured application runtime exception:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4 text-center bg-slate-50/30">
            <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                
                {/* System Alert Hazard Icon Indicator */}
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2.5} 
                        stroke="currentColor" 
                        className="w-7 h-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>

                {/* Narrative Typography Messaging Layout */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Something went wrong!
                    </h2>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                        An unexpected runtime segment failure occurred while rendering this data node context.
                    </p>
                </div>

                {/* Operational Recovery Actions Layout */}
                <div className="w-full space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={() => reset()} // Recover segment by clear boundary resets execution
                        className="inline-flex items-center justify-center w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-98"
                    >
                        Try Again
                    </button>
                    
                    <Link 
                        href="/" 
                        className="inline-flex items-center justify-center w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3 rounded-xl border border-slate-200 transition-all active:scale-98"
                    >
                        Return to Home Page
                    </Link>
                </div>

            </div>
        </div>
    );
}