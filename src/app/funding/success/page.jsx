import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)');
    }

    const {
        status,
        customer_details: { email: customerEmail }
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    });

    if (status === 'open') {
        return redirect('/');
    }

    if (status === 'complete') {
        return (
            <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4 bg-slate-50/40">
                <div className="max-w-md w-full bg-white border border-slate-100 shadow-xl shadow-slate-100/60 p-8 md:p-10 rounded-3xl flex flex-col items-center text-center space-y-6">
                    
                    {/* Heart/Check Animated Success Badge */}
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm relative">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2.5} 
                            stroke="currentColor" 
                            className="w-7 h-7"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>
                    </div>

                    {/* Typography Content Frame */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Thank You For Your Support!
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                            Your contribution helps us keep the blood mapping ecosystem running, fast, and completely free for families in critical emergencies.
                        </p>
                    </div>

                    {/* Transaction Confirmation Card Details */}
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-600">
                        <p className="leading-normal">
                            • A secure transaction receipt and verification summary has been dispatched to <span className="font-bold text-slate-900 break-all">{customerEmail}</span>.
                        </p>
                        <p className="leading-normal">
                            • For matching disputes or systemic platform configuration questions, reach out to us directly at{' '}
                            <a href="mailto:support@bloodlifeline.com" className="text-rose-600 font-semibold hover:underline">
                                support@bloodlifeline.com
                            </a>.
                        </p>
                    </div>

                    {/* Action Navigation Redirection Link */}
                    <div className="w-full pt-2">
                        <Link 
                            href="/dashboard" 
                            className="inline-flex items-center justify-center w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-98"
                        >
                            Go to Dashboard
                        </Link>
                    </div>

                </div>
            </div>
        );
    }
}