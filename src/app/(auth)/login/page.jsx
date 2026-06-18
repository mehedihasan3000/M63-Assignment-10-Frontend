"use client";

import React, { useState } from "react";
import { Form, Fieldset, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    // Controlled form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [submitError, setSubmitError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Updates form state values seamlessly
    const handleValueChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setIsLoading(true);

        try {
            // BetterAuth sign-in integration call
            // import { authClient } from "@/lib/auth-client";
            // 
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: "/dashboard" // Redirect location following execution
            });

            //console.log("Attempting sign-in with BetterAuth:", formData);

            if (error) {
                setSubmitError(error.message || "Invalid credentials.");
            } //else {
            //router.push("/dashboard");
            //}

        } catch (err) {
            setSubmitError("An unexpected error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                {/* Header Block */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Log in to manage your donations or request life-saving assistance.
                    </p>
                </div>

                {/* Global Error Banner */}
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl">
                        {submitError}
                    </div>
                )}

                {/* HeroUI Input Group Form */}
                <Form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Fieldset>
                        <Fieldset.Group className="flex flex-col gap-5 w-full">

                            {/* Email Input Field */}
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

                            {/* Password Input Field */}
                            <TextField
                                isRequired
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(val) => handleValueChange("password", val)}
                            >
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium text-gray-700">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-red-600 hover:text-red-500 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input placeholder="••••••••" className="mt-1" />
                                <FieldError />
                            </TextField>

                        </Fieldset.Group>

                        {/* Form Button Action Triggers */}
                        <Fieldset.Actions className="mt-6 w-full">
                            <Button
                                type="submit"
                                color="danger"
                                className="w-full font-semibold py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Log In"}
                            </Button>
                        </Fieldset.Actions>
                    </Fieldset>
                </Form>

                {/* Redirect Alternative Navigation Toggle */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    New to BloodConnect?{" "}
                    <Link href="/register" className="font-semibold text-red-600 hover:text-red-500 hover:underline">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>
    );
}