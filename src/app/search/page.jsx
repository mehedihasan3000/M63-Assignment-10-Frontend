'use client';

import React, { useState } from 'react';
import { Select, Label, ListBox } from "@heroui/react";
import { geoData } from "@/lib/geo-data";

// Static geographic reference matrix matching your database schema
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodDonorSearchPage = () => {
    const [bloodGroup, setBloodGroup] = useState('');
    const [district, setDistrict] = useState('');
    const [upazila, setUpazila] = useState('');
    
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const availableUpazilas = district ? geoData[district] || [] : [];

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!bloodGroup || !district || !upazila) {
            alert('Please complete all selection options before launching donor search.');
            return;
        }

        setIsLoading(true);
        try {
            // Encode parameters safely to fetch against your backend API endpoint
            const queryParams = new URLSearchParams({
                bloodGroup,
                district,
                upazila
            });
            console.log(queryParams.toString());
            // return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/donors/search?${queryParams.toString()}`);
            if (res) {
                const data = await res.json();
                setResults(data || []);
            } else {
                console.error('Server side lookup criteria mismatch error.');
                setResults([]);
            }
        } catch (error) {
            console.error('Failed processing server query mapping:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            
            {/* Header branding block banner section */}
            <div className="space-y-1.5 border-b border-slate-100 pb-5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Find Eligible Blood Donors
                </h1>
                <p className="text-sm text-slate-500">
                    Select target criteria specifics below to discover available matches registered across your regional zones.
                </p>
            </div>

            {/* Form layout wrapper framed block matching website metrics */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                <form onSubmit={handleSearchSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* --- BLOOD GROUP SELECT FIELD BLOCK --- */}
                        <div className="flex flex-col space-y-1.5">
                            <Select 
                                value={bloodGroup} 
                                onSelectionChange={(key) => setBloodGroup(String(key))}
                            >
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Blood Group Needed</Label>
                                <Select.Trigger className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-sm flex justify-between items-center outline-none focus:border-rose-500 transition-colors">
                                    <Select.Value placeholder="Choose Blood Group" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover className="bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden p-1 z-50">
                                    <ListBox className="space-y-0.5 max-h-60 overflow-y-auto">
                                        {bloodGroups.map((group) => (
                                            <ListBox.Item 
                                                key={group} 
                                                id={group}
                                                className="px-3 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <Label className="cursor-pointer font-medium">{group}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        {/* --- GEOGRAPHIC DISTRICT SELECT FIELD BLOCK --- */}
                        <div className="flex flex-col space-y-1.5">
                            <Select 
                                value={district} 
                                onSelectionChange={(key) => {
                                    setDistrict(String(key));
                                    setUpazila(''); // Wipe child cascade value on clear resets
                                }}
                            >
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target District</Label>
                                <Select.Trigger className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-sm flex justify-between items-center outline-none focus:border-rose-500 transition-colors">
                                    <Select.Value placeholder="Select District" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover className="bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden p-1 z-50">
                                    <ListBox className="space-y-0.5 max-h-60 overflow-y-auto">
                                        {Object.keys(geoData).map((distItem) => (
                                            <ListBox.Item 
                                                key={distItem} 
                                                id={distItem}
                                                className="px-3 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <Label className="cursor-pointer font-medium">{distItem}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        {/* --- GEOGRAPHIC UPAZILA SELECT FIELD BLOCK --- */}
                        <div className="flex flex-col space-y-1.5">
                            <Select 
                                value={upazila} 
                                disabled={!district}
                                onSelectionChange={(key) => setUpazila(String(key))}
                            >
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Upazila</Label>
                                <Select.Trigger className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-sm flex justify-between items-center outline-none focus:border-rose-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed">
                                    <Select.Value placeholder={district ? "Select Upazila" : "Choose district first"} />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover className="bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden p-1 z-50">
                                    <ListBox className="space-y-0.5 max-h-60 overflow-y-auto">
                                        {availableUpazilas.map((upazItem) => (
                                            <ListBox.Item 
                                                key={upazItem} 
                                                id={upazItem}
                                                className="px-3 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <Label className="cursor-pointer font-medium">{upazItem}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                    </div>

                    {/* Submit layout parameters anchor element pinned down right */}
                    <div className="flex items-center justify-end pt-4 border-t border-slate-50">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-98 disabled:opacity-50"
                        >
                            {isLoading ? 'Running Match Search...' : 'Launch Search Profile'}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- RESULTS SECTION AREA --- */}
            <div className="space-y-4">
                {!hasSearched ? (
                    // Default Entry State: Shown on initial render before execution clicks
                    <div className="w-full py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                        <p className="text-sm text-slate-400 font-medium">
                            Enter a blood group and location criteria above to initialize a search request.
                        </p>
                    </div>
                ) : results.length === 0 ? (
                    // Empty Results State: Query returned zero records matching data keys
                    <div className="w-full py-16 text-center border border-slate-100 rounded-2xl bg-amber-50/40 border-amber-100">
                        <p className="text-sm text-amber-700 font-medium">
                            No active blood donors match your chosen filters. Try broadening your geographic parameters.
                        </p>
                    </div>
                ) : (
                    // Success Results Grid Layout
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            Matching Active Donors ({results.length})
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((donor) => {
                                const idKey = donor?._id?.$oid || donor?._id;
                                return (
                                    <div 
                                        key={idKey} 
                                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-0.5">
                                                <h4 className="font-bold text-slate-900 text-base">{donor.requesterName}</h4>
                                                <p className="text-xs text-slate-400 font-medium">{donor.recipientUpazila}, {donor.recipientDistrict}</p>
                                            </div>
                                            <span className="inline-flex items-center justify-center font-black text-sm px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg">
                                                {donor.bloodGroup}
                                            </span>
                                        </div>
                                        
                                        <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                            <p><span className="font-semibold text-slate-600">Donor:</span> {donor.name}</p>
                                            <p><span className="font-semibold text-slate-600">Contact:</span> {donor.email || 'No contact added'}</p>
                                        </div>

                                        {/* right now I do not need this button */}
                                        {/* <button
                                            type="button"
                                            onClick={() => window.location.href = `/dashboard/donation-requests/${idKey}`}
                                            className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm"
                                        >
                                            View Full Profile
                                        </button> */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default BloodDonorSearchPage;