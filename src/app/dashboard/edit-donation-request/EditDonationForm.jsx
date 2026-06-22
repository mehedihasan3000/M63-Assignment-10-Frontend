'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDonationRequests } from '@/lib/actions/donationrequest';

// Mock values - Replace imports matching your environment configuration profiles
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const geoData = {
    Dhaka: ["Mirpur", "Dhanmondi", "Gulshan", "Savar", "Uttara"],
    Chattogram: ["Hathazari", "Mirsharai", "Raozan", "Sandwip", "Sitakunda"],
    Rajshahi: ["Boalia", "Paba", "Bagmara", "Godagari", "Puthia"],
    Sylhet: ["Beanibazar", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur"],
};

const EditDonationForm = ({ initialData }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reconstruct fields state keeping original document schema values
    const [formData, setFormData] = useState({
        recipientName: initialData?.recipientName || '',
        bloodGroup: initialData?.bloodGroup || '',
        recipientDistrict: initialData?.recipientDistrict || '',
        recipientUpazila: initialData?.recipientUpazila || '',
        hospitalName: initialData?.hospitalName || '',
        fullAddressLine: initialData?.fullAddressLine || '',
        donationDate: initialData?.donationDate || { year: 2026, month: 6, day: 19 },
        donationTime: initialData?.donationTime || '',
        requestMessage: initialData?.requestMessage || '',
    });

    const availableUpazilas = formData.recipientDistrict ? geoData[formData.recipientDistrict] || [] : [];

    const handleValueChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateSegmentChange = (type, value) => {
        setFormData(prev => ({
            ...prev,
            donationDate: {
                ...prev.donationDate,
                [type]: parseInt(value, 10) || 1
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const idString = initialData?._id?.$oid || initialData?._id;
            // const res = await fetch(`/api/donations/${idString}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });

            const res = await updateDonationRequests(idString, formData);

            if (res) {
                router.refresh();
                router.back(); // Returns back along navigation trail safely
            } else {
                alert('Could not synchronize updates safely. Verify fields match patterns.');
            }
        } catch (error) {
            console.error('Error saving updates to document:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10 relative mt-6">
            
            {/* Top Right Floating Absolute Escape Target Button */}
            <button
                type="button"
                onClick={() => router.back()}
                className="absolute top-6 right-6 md:top-10 md:right-10 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
            >
                ✕ Close & Go Back
            </button>

            {/* Core Update Form Frame */}
            <form onSubmit={handleSubmit} className="w-full">
                <fieldset className="w-full space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Edit Request Details
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Modify fields below to update deployment records logs for {formData.recipientName || 'patient'}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                        {/* --- REQUESTER PROFILE INFO (READ ONLY PERSISTED CONTEXT) --- */}
                        <div className="opacity-75">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Requester Name</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={initialData?.requesterName || ''} 
                                className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg p-2.5 text-sm cursor-not-allowed outline-none" 
                            />
                        </div>

                        <div className="opacity-75">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Requester Email</label>
                            <input 
                                type="email" 
                                readOnly 
                                value={initialData?.requesterEmail || ''} 
                                className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg p-2.5 text-sm cursor-not-allowed outline-none" 
                            />
                        </div>

                        {/* --- RECIPIENT INFORMATION BLOCK --- */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recipient Name</label>
                            <input 
                                type="text"
                                required
                                value={formData.recipientName}
                                onChange={(e) => handleValueChange("recipientName", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group Required</label>
                            <select
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => handleValueChange("bloodGroup", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroups.map((group) => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* --- GEOGRAPHIC CASCADE SELECTORS --- */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recipient District</label>
                            <select
                                required
                                value={formData.recipientDistrict}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        recipientDistrict: e.target.value,
                                        recipientUpazila: '' // Reset sub-option choice block
                                    }));
                                }}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            >
                                <option value="">Select Target District</option>
                                {Object.keys(geoData).map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recipient Upazila</label>
                            <select
                                required
                                disabled={!formData.recipientDistrict}
                                value={formData.recipientUpazila}
                                onChange={(e) => handleValueChange("recipientUpazila", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {formData.recipientDistrict ? "Select Upazila Sub-option" : "Select a District first"}
                                </option>
                                {availableUpazilas.map((upazila) => (
                                    <option key={upazila} value={upazila}>{upazila}</option>
                                ))}
                            </select>
                        </div>

                        {/* --- LOGISTICS & ADDRESS TRACK --- */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Name</label>
                            <input 
                                type="text"
                                required
                                value={formData.hospitalName}
                                onChange={(e) => handleValueChange("hospitalName", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Address Line</label>
                            <input 
                                type="text"
                                required
                                value={formData.fullAddressLine}
                                onChange={(e) => handleValueChange("fullAddressLine", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            />
                        </div>

                        {/* --- EXPLICIT DATE FIELD IN dd-mm-yyyy SEGMENTAL SEQUENCE --- */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Donation Date <span className="text-slate-400 font-normal normal-case">(dd-mm-yyyy)</span>
                            </label>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-white focus-within:border-rose-500 transition-colors">
                                <input
                                    type="number"
                                    placeholder="DD"
                                    min="1"
                                    max="31"
                                    value={formData.donationDate?.day || ''}
                                    onChange={(e) => handleDateSegmentChange('day', e.target.value)}
                                    className="w-12 text-center text-sm outline-none bg-transparent text-slate-800 font-medium p-1"
                                />
                                <span className="text-slate-300 font-light">/</span>
                                <input
                                    type="number"
                                    placeholder="MM"
                                    min="1"
                                    max="12"
                                    value={formData.donationDate?.month || ''}
                                    onChange={(e) => handleDateSegmentChange('month', e.target.value)}
                                    className="w-12 text-center text-sm outline-none bg-transparent text-slate-800 font-medium p-1"
                                />
                                <span className="text-slate-300 font-light">/</span>
                                <input
                                    type="number"
                                    placeholder="YYYY"
                                    min="2026"
                                    max="2035"
                                    value={formData.donationDate?.year || ''}
                                    onChange={(e) => handleDateSegmentChange('year', e.target.value)}
                                    className="w-20 text-center text-sm outline-none bg-transparent text-slate-800 font-medium p-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donation Time</label>
                            <input 
                                type="time"
                                required
                                value={formData.donationTime}
                                onChange={(e) => handleValueChange("donationTime", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                            />
                        </div>

                    </div>

                    {/* --- FULL ROW DESCRIPTION MESSAGE AREA --- */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Request Message Context</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.requestMessage}
                            onChange={(e) => handleValueChange("requestMessage", e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-3 text-sm focus:border-rose-500 outline-none resize-none"
                        />
                    </div>

                    {/* --- BOTTOM SUBMIT ACTION CONTAINERS BAR --- */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel & Go Back
                        </button>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving System Changes...' : 'Save Request Updates'}
                        </button>
                    </div>

                </fieldset>
            </form>
        </div>
    );
};

export default EditDonationForm;