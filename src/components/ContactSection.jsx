'use client';

import React, { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        setIsSubmitting(true);
        
        
        // API Submission delay
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            // Replace with your real API route if needed: await fetch('/api/contact', ...)
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
            //console.log("Form Data Submitted:", formData);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Form submission breakdown:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* --- LEFT SIDE: CONTACT INFO & HELPLINE --- */}
                <div className="lg:col-span-5 space-y-6 md:pr-4">
                    <div className="space-y-3">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100/60 inline-block">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Have Questions? We Are Here to Help.
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Whether you are facing problems registering as a donor, need immediate technical support with a donation post, or want to partner with us, drop a line.
                        </p>
                    </div>

                    <div className="space-y-4 pt-2">
                        {/* Emergency Phone Helpline Card */}
                        <div className="flex items-center gap-4 p-4 border border-rose-100 bg-rose-50/30 rounded-2xl shadow-sm">
                            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25V16.14a2.25 2.25 0 0 0-1.57-2.14l-2.584-.517a2.25 2.25 0 0 0-2.42 1.47l-.847 2.54a15.035 15.035 0 0 1-7.485-7.485l2.54-.847a2.25 2.25 0 0 0 1.47-2.42L11.75 4.51a2.25 2.25 0 0 0-2.14-1.57H6.75A2.25 2.25 0 0 0 4.5 6.75v2.25Z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">24/7 Emergency Hotline</span>
                                <a href="tel:+8801700000000" className="text-lg font-extrabold text-slate-900 hover:text-rose-600 transition-colors">
                                    +880 1700-000000
                                </a>
                            </div>
                        </div>

                        {/* Support Email Card */}
                        <div className="flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl shadow-sm">
                            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Support & Help Email</span>
                                <a href="mailto:support@bloodlifeline.com" className="text-base font-bold text-slate-800 hover:text-rose-600 transition-colors">
                                    support@bloodlifeline.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: CONTACT FORM INTERFACE --- */}
                <div className="lg:col-span-7 bg-white border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-8 rounded-3xl">
                    {submitted ? (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">Message Dispatched!</h3>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                    Thank you for reaching out. A support coordinator will evaluate your message and respond shortly.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="text-xs font-semibold text-rose-600 hover:underline pt-2"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            
                            {/* Form Input: Name */}
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Wing Tapis"
                                    className="w-full bg-slate-50/50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-rose-500 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Form Input: Email */}
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. name@domain.com"
                                    className="w-full bg-slate-50/50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-rose-500 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Form Input: Message */}
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write details about your query or support assistance request here..."
                                    className="w-full bg-slate-50/50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-rose-500 transition-all placeholder:text-slate-400 resize-none"
                                    required
                                />
                            </div>

                            {/* Form Action Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-98 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending Message...' : 'Submit Message'}
                                </button>
                            </div>

                        </form>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ContactSection;