import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4 text-center bg-slate-50/30">
            <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                
                {/* Visual Error Identity Badge */}
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm animate-pulse">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2.5} 
                        stroke="currentColor" 
                        className="w-7 h-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                {/* Information Content Block */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                        The resource, path address, or specific dashboard data node you are looking for does not exist or has moved permanently.
                    </p>
                </div>

                {/* Primary Anchor Action Redirecting to Root Home */}
                <div className="w-full pt-2">
                    <Link 
                        href="/" 
                        className="inline-flex items-center justify-center w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-98"
                    >
                        Return to Home Page
                    </Link>
                </div>

            </div>
        </div>
    );
}