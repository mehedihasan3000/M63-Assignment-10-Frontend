import React from 'react';

const FeaturedSection = () => {
    const features = [
        {
            title: "Smart Geo-Targeting",
            description: "Locate active donors precisely down to their specific District and Upazila in real time. No wasted phone calls, just instant local connections.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            ),
            bgClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
        },
        {
            title: "Urgent Live Pipelines",
            description: "Post dynamic donation requests directly into our centralized dashboard pool. Instantly notify nearby eligible matches of emergency hospital timelines.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 1 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
                </svg>
            ),
            bgClass: "bg-rose-50 text-rose-600 border-rose-100",
        },
        {
            title: "Secure Verification Data",
            description: "Your contact details and emergency medical requirements are guarded strictly within verified dashboard parameters, avoiding profile spam or data collection breaches.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0 1 12 2.714Z" />
                </svg>
            ),
            bgClass: "bg-blue-50 text-blue-600 border-blue-100",
        }
    ];

    return (
        <section className="w-full bg-slate-50/50 py-16 md:py-24 border-y border-slate-100">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
                
                {/* Section Header Text Alignment */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100/60 inline-block">
                        Why Choose Our Platform
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Revolutionizing Emergency Blood Sourcing
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                        We stripped away the friction of messy group messages and out-of-date registries. Here is how our live ecosystem speeds up critical matching pipelines.
                    </p>
                </div>

                {/* Grid Layout Cards Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-start space-y-5"
                        >
                            {/* Graphic Component Emblem Box */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${item.bgClass}`}>
                                {item.icon}
                            </div>

                            {/* Descriptive Labels Frame */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subtle Interactive Footer Guide Anchor */}
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-400 font-medium">
                        Every day, seconds save lives. 
                        <a href="/requests" className="text-rose-600 font-semibold hover:underline ml-1.5 inline-flex items-center gap-0.5">
                            Browse pending donation requests now
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FeaturedSection;