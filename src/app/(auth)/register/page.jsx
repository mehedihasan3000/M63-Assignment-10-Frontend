"use client";

import React, { useState } from "react";
import { Form, Fieldset, TextField, Label, Input, FieldError, Description, Button } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LOCATION_DATA = {
    Dhaka: ["Mirpur", "Dhanmondi", "Gulshan", "Savar", "Uttara"],
    Chattogram: ["Hathazari", "Mirsharai", "Raozan", "Sandwip", "Sitakunda"],
    Rajshahi: ["Boalia", "Paba", "Bagmara", "Godagari", "Puthia"],
    Sylhet: ["Beanibazar", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur"],
};

export default function RegisterPage() {
    // Controlled form state tracking variables
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bloodGroup: "A+",
        district: "",
        upazila: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter();

    const [avatarUrl, setAvatarUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // FIXED: Direct value state mapping function instead of parsing e.target
    const handleValueChange = (fieldName, value) => {
        setFormData((prev) => {
            const updated = { ...prev, [fieldName]: value };

            // Instantly wipe out Upazila selection if District changes
            if (fieldName === "district") {
                updated.upazila = "";
            }
            return updated;
        });
    };

    // Upload avatar image file to ImgBB
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setSubmitError("");

        const IMGBB_API_KEY = "08fa52c2209d62ab836c2de43466515f"; // Substitute with your live API key token
        const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
        const bodyFormData = new FormData();
        bodyFormData.append("image", file);

        try {
            const res = await fetch(url, { method: "POST", body: bodyFormData });
            const result = await res.json();

            if (result.success) {
                setAvatarUrl(result.data.url);
            } else {
                setSubmitError("Failed to upload avatar to ImgBB. Please try again.");
            }
        } catch (err) {
            setSubmitError("An error occurred during image upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Safety check constraints
        if (!avatarUrl) {
            setSubmitError("Please upload an avatar image before submitting.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setSubmitError("Passwords do not match. Double check your typing.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Data payload is now fully intact and visible
            console.log("Submitting fully intact payload to BetterAuth & MongoDB:", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                image: avatarUrl,
                bloodGroup: formData.bloodGroup,
                district: formData.district,
                upazila: formData.upazila,
                role: "donor",
                status: "active",
            });
            // console.log("Submitting payload to BetterAuth & MongoDB:", {
            //     ...formData,
            //     avatar: avatarUrl,
            //     role: "donor",
            //     status: "active",
            // });

            // Insert your BetterAuth authClient sign-up integration here
            // BetterAuth Client Initialization Example
            // import { authClient } from "@/lib/auth-client";
            //
            const { data, error } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                image: avatarUrl,

                bloodGroup: formData.bloodGroup,
                district: formData.district,
                upazila: formData.upazila,
                role: "donor",
                status: "active",

            });

            //console.log("Server response:", { data, error });

            if (data) {
                router.push("/dashboard");
            }

        } catch (err) {
            setSubmitError(err.message || "An unexpected registration failure occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Become a Donor</h1>
                    <p className="mt-2 text-sm text-gray-500">Join our network and help save lives.</p>
                </div>

                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl">
                        {submitError}
                    </div>
                )}

                <Form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    <Fieldset>
                        <Fieldset.Legend className="text-lg font-semibold text-gray-700 mb-4">
                            Donor Registration Details
                        </Fieldset.Legend>

                        <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

                            {/* Full Name */}
                            <TextField
                                isRequired
                                name="name"
                                value={formData.name}
                                onChange={(val) => handleValueChange("name", val)}
                            >
                                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                                <Input placeholder="John Doe" className="mt-1" />
                                <FieldError />
                            </TextField>

                            {/* Email Address */}
                            <TextField
                                isRequired
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(val) => handleValueChange("email", val)}
                                validate={(value) => {
                                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                        return "Please enter a valid email address";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                                <Input placeholder="john@example.com" className="mt-1" />
                                <FieldError />
                            </TextField>

                            {/* Profile Avatar Upload */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Profile Avatar</label>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                                />
                                {isUploading && <span className="text-xs text-amber-600 font-medium">Uploading to ImgBB...</span>}
                                {avatarUrl && <span className="text-xs text-green-600 font-medium">✓ Image uploaded successfully!</span>}
                            </div>

                            {/* Blood Group Dropdown */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={(e) => handleValueChange("bloodGroup", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                    onChange={(e) => handleValueChange("district", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                    disabled={!formData.district}
                                    className="mt-1 w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Upazila</option>
                                    {formData.district &&
                                        LOCATION_DATA[formData.district].map((upz) => (
                                            <option key={upz} value={upz}>{upz}</option>
                                        ))}
                                </select>
                            </div>

                            {/* Password */}
                            <TextField
                                isRequired
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(val) => handleValueChange("password", val)}
                                validate={(value) => {
                                    if (value.length < 8) return "Password must be at least 8 characters";
                                    if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
                                    if (!/[0-9]/.test(value)) return "Must contain at least one number";
                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-gray-700">Password</Label>
                                <Input placeholder="••••••••" className="mt-1" />
                                <Description className="text-xs text-gray-400 mt-1">Min 8 chars, 1 uppercase, 1 number</Description>
                                <FieldError />
                            </TextField>

                            {/* Confirm Password */}
                            <TextField
                                isRequired
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(val) => handleValueChange("confirmPassword", val)}
                                validate={(value) => {
                                    if (value !== formData.password) {
                                        return "Passwords do not match";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                                <Input placeholder="••••••••" className="mt-1" />
                                <FieldError />
                            </TextField>

                        </Fieldset.Group>

                        <Fieldset.Actions className="mt-8 flex flex-col sm:flex-row gap-3 justify-end w-full border-t border-gray-100 pt-6">
                            <Button
                                type="submit"
                                color="danger"
                                className="w-full sm:w-auto font-semibold px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                disabled={isUploading || isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Submit Registration"}
                            </Button>
                            <Button
                                type="reset"
                                variant="secondary"
                                className="w-full sm:w-auto font-medium px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                    setFormData({ name: "", email: "", bloodGroup: "A+", district: "", upazila: "", password: "", confirmPassword: "" });
                                    setAvatarUrl("");
                                    setSubmitError("");
                                }}
                            >
                                Reset
                            </Button>
                        </Fieldset.Actions>
                    </Fieldset>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-red-600 hover:text-red-500">
                        Log in here
                    </Link>
                </p>

            </div>
        </div>
    );
}