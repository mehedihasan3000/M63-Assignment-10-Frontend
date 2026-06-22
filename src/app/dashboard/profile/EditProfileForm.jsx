'use client';

import React, { useState } from 'react';
import { Form, Fieldset, TextField, Label, Input, FieldError, Button } from '@heroui/react';
import { Pencil, FloppyDisk, ArrowRotateLeft } from '@gravity-ui/icons';
import { updateUser } from '@/lib/actions/user';

// Sample location dataset to match your dynamic logic
const LOCATION_DATA = {
    Dhaka: ["Mirpur", "Dhanmondi", "Gulshan", "Savar", "Uttara"],
    Chattogram: ["Hathazari", "Mirsharai", "Raozan", "Sandwip", "Sitakunda"],
    Rajshahi: ["Boalia", "Paba", "Bagmara", "Godagari", "Puthia"],
    Sylhet: ["Beanibazar", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur"],
};

const EditProfileForm = ({ initialUser }) => {
    // State to handle edit toggle mode
    const [isEditing, setIsEditing] = useState(false);
    
    // Core form states
    const [formData, setFormData] = useState({
        name: initialUser?.name || "",
        email: initialUser?.email || "",
        bloodGroup: initialUser?.bloodGroup || "A+",
        district: initialUser?.district || "",
        upazila: initialUser?.upazila || "",
    });
    
    const [avatarUrl, setAvatarUrl] = useState(initialUser?.image || "");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic field state updates
    const handleValueChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setFormData((prev) => ({
            ...prev,
            district: selectedDistrict,
            upazila: "" // Reset upazila field when district changes
        }));
    };

    // ImgBB Upload Handler
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const body = new FormData();
        body.append('image', file);

        try {
            // Replace with your actual ImgBB Client API Key or an env variable
            const apiKey = process.env.IMGBB_API_KEY || "08fa52c2209d62ab836c2de43466515f";
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: body
            });
            const data = await res.json();
            
            if (data.success) {
                setAvatarUrl(data.data.url);
            } else {
                console.error("ImgBB upload failed:", data.error?.message);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Reset details back to previous saved state
    const handleCancel = () => {
        setFormData({
            name: initialUser?.name || "",
            email: initialUser?.email || "",
            bloodGroup: initialUser?.bloodGroup || "A+",
            district: initialUser?.district || "",
            upazila: initialUser?.upazila || "",
        });
        setAvatarUrl(initialUser?.image || "");
        setIsEditing(false);
    };

    // Save modifications to express backend server
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedProfile = {
            ...formData,
            image: avatarUrl
        };

        try {
            // Change path according to your actual Express endpoint setup
            const res = await updateUser(initialUser.id, updatedProfile)
            
            if (res) {
                // Successfully stored changes, flip back view mode status
                setIsEditing(false);
            } else {
                console.error("Failed backend profile update.");
            }
        } catch (error) {
            console.error("Error updating profile submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            
            {/* Top Toggle Controls */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <p className="text-sm text-gray-500">Manage your registration information</p>
                </div>
                
                {!isEditing ? (
                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </Button>
                ) : (
                    <Button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-100 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowRotateLeft className="w-4 h-4" />
                        Cancel
                    </Button>
                )}
            </div>

            {/* Profile Avatar Card Segment */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6">
                <div className="relative">
                    <img 
                        src={avatarUrl || "https://i.ibb.co/7NRwzrvg/microsoft.png"} 
                        alt="Profile Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm ring-2 ring-red-100" 
                    />
                    <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${initialUser?.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                </div>
                
                <div className="flex-1 text-center sm:text-left w-full">
                    <h3 className="font-bold text-lg text-gray-800">{formData.name || "Blood Donor"}</h3>
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wide mb-2">{initialUser?.role || "Donor"}</p>
                    
                    {isEditing && (
                        <div className="w-full max-w-xs mx-auto sm:mx-0">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            />
                            {isUploading && <p className="text-xs text-amber-600 font-medium mt-1 animate-pulse">Uploading layout to ImgBB...</p>}
                            {!isUploading && avatarUrl !== initialUser?.image && <p className="text-xs text-green-600 font-medium mt-1">✓ New photo attached!</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Fields Form */}
            <Form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                <Fieldset>
                    <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

                        {/* Full Name */}
                        <TextField
                            isRequired
                            name="name"
                            value={formData.name}
                            onChange={(val) => handleValueChange("name", val)}
                            isDisabled={!isEditing}
                        >
                            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                            <Input placeholder="John Doe" className="mt-1" />
                            <FieldError />
                        </TextField>

                        {/* Email Address - CRITICAL: Always Disabled */}
                        <TextField
                            name="email"
                            type="email"
                            value={formData.email}
                            isDisabled={true} 
                        >
                            <Label className="text-sm font-medium text-gray-400">Email Address (Cannot change)</Label>
                            <Input className="mt-1 bg-gray-50 opacity-75 cursor-not-allowed" />
                        </TextField>

                        {/* Blood Group Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={(e) => handleValueChange("bloodGroup", e.target.value)}
                                disabled={!isEditing}
                                className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* District Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">District</label>
                            <select
                                required
                                name="district"
                                value={formData.district}
                                onChange={handleDistrictChange}
                                disabled={!isEditing}
                                className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                <option value="">Select District</option>
                                {Object.keys(LOCATION_DATA).map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dynamic Upazila Dropdown */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Upazila</label>
                            <select
                                required
                                name="upazila"
                                value={formData.upazila}
                                onChange={(e) => handleValueChange("upazila", e.target.value)}
                                disabled={!isEditing || !formData.district}
                                className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Upazila</option>
                                {formData.district &&
                                    LOCATION_DATA[formData.district].map((upz) => (
                                        <option key={upz} value={upz}>{upz}</option>
                                    ))}
                            </select>
                        </div>

                    </Fieldset.Group>

                    {/* Bottom Save Changes Action Area */}
                    {isEditing && (
                        <Fieldset.Actions className="mt-8 flex gap-3 justify-end w-full border-t border-gray-100 pt-6">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto font-semibold px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                disabled={isUploading || isSubmitting}
                            >
                                <FloppyDisk className="w-4 h-4" />
                                {isSubmitting ? "Saving changes..." : "Save Changes"}
                            </Button>
                        </Fieldset.Actions>
                    )}
                </Fieldset>
            </Form>
        </div>
    );
};

export default EditProfileForm;