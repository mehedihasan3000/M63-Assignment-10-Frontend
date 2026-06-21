"use client";
import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
    Form,
    Fieldset,
    TextField,
    Label,
    Input,
    InputGroup,
    Select,
    ListBox,
    Button,
    FieldError,
    Description
} from '@heroui/react';
import {
    Heart,
    CircleCheck,
    TriangleExclamation,
    ShieldCheck,
    CreditCard,
    CircleDollar,
    HandPointRight
} from '@gravity-ui/icons';

const presetAmounts = ["500", "1000", "2500", "5000"];
const paymentMethods = [
    { id: "bkash", name: "bKash (Mobile Wallet)" },
    { id: "nagad", name: "Nagad (Mobile Wallet)" },
    { id: "card", name: "Credit / Debit Card" }
];

export default function FundingPage() {
    const { data: session } = authClient.useSession();

    // Local Form States
    const [formData, setFormData] = useState({
        donorName: '',
        donorEmail: '',
        amount: '',
        paymentMethod: '',
        contributorNote: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

    // Auto-populate identity properties if user is logged in
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                donorName: session.user.name || '',
                donorEmail: session.user.email || ''
            }));
        }
    }, [session]);

    // Unified Handler supporting HeroUI's raw value emission setup
    const handleValueChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handlePresetSelect = (amount) => {
        handleValueChange("amount", amount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ success: null, message: '' });

        const payload = {
            ...formData,
            userId: session?.user?.id || 'anonymous',
            timestamp: new Date().toISOString()
        };
        console.log(payload)

        try {
            // Connects to your backend Express gateway tracking transactions
            const response = await fetch('/api/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Transaction process initialization failed');

            setSubmitStatus({
                success: true,
                message: 'Thank you for your generosity! Your transaction has been recorded, and payment gateway redirection is loading...'
            });

            // Clear operational state parameters except profile properties
            setFormData(prev => ({
                ...prev,
                amount: '',
                paymentMethod: '',
                contributorNote: ''
            }));

        } catch (error) {
            setSubmitStatus({
                success: false,
                message: error.message || 'An unexpected connection anomaly disrupted processing.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">

            {/* --- HERO MARKETING / CONTENT SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
                    <div className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
                        <Heart width={28} height={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Empower Life Through Financial Support
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        While blood donation saves lives directly on the hospital bed, your financial contributions fund our real-time SMS dispatch pipelines, maintain database infrastructure, and scale outreach targeting rural boundaries.
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex gap-3 items-start text-xs text-slate-500">
                            <ShieldCheck width={18} height={18} className="text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-semibold text-slate-800 block">Secure encryption network</span>
                                Transactions are safely processed through trusted localized digital infrastructure and tokens.
                            </div>
                        </div>
                        <div className="flex gap-3 items-start text-xs text-slate-500">
                            <CircleDollar width={18} height={18} className="text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-semibold text-slate-800 block">100% Transparency</span>
                                Operational breakdowns are visible directly to vetted system administrators and active members.
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- INTERACTIVE TRANSACTIONS WORKSPACE --- */}
                <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

                    {submitStatus.message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${submitStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                            {submitStatus.success ? <CircleCheck className="mt-0.5 shrink-0" /> : <TriangleExclamation className="mt-0.5 shrink-0" />}
                            <p className="text-sm font-medium">{submitStatus.message}</p>
                        </div>
                    )}

                    <Form onSubmit={handleSubmit} className="w-full">
                        <Fieldset className="w-full space-y-6">

                            <div>
                                <Fieldset.Legend className="text-xl font-bold text-slate-900">
                                    Contribution Configuration
                                </Fieldset.Legend>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Select an amount or input a customized dynamic financial allocation.
                                </p>
                            </div>

                            <Fieldset.Group className="space-y-6 w-full">

                                {/* PRESET CHIPS CONFIGURATION */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Select Preset Amount (BDT)</Label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {presetAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => handlePresetSelect(amt)}
                                                className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all text-center ${formData.amount === amt
                                                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                            >
                                                ৳{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* CUSTOM AMOUNT FIELD */}
                                <TextField
                                    isRequired
                                    value={formData.amount}
                                    onChange={(val) => handleValueChange("amount", val)}
                                >
                                    <Label>Custom Amount (BDT)</Label>
                                    <InputGroup>
                                        <InputGroup.Prefix className="text-slate-400 font-medium text-sm pl-2">৳</InputGroup.Prefix>
                                        <InputGroup.Input type="number" min="10" placeholder="Specify numerical amount minimum 10" />
                                    </InputGroup>
                                    <FieldError />
                                </TextField>

                                {/* IDENTITY METADATA ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField
                                        isRequired
                                        value={formData.donorName}
                                        onChange={(val) => handleValueChange("donorName", val)}
                                    >
                                        <Label>Contributor Full Name</Label>
                                        <Input placeholder="Enter your full name" />
                                        <Description>Can be modified for completely anonymous reporting</Description>
                                        <FieldError />
                                    </TextField>

                                    <TextField
                                        isRequired
                                        type="email"
                                        value={formData.donorEmail}
                                        onChange={(val) => handleValueChange("donorEmail", val)}
                                    >
                                        <Label>Email Address</Label>
                                        <Input placeholder="name@domain.com" />
                                        <FieldError />
                                    </TextField>
                                </div>

                                {/* PAYMENT METHOD SELECTOR */}
                                <Select
                                    isRequired
                                    onChange={(val) => handleValueChange("paymentMethod", val)}
                                >
                                    <Label>Payment Gateway Channel</Label>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Choose Transaction Channel" />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            {paymentMethods.map((method) => (
                                                <ListBox.Item key={method.id} id={method.id}>
                                                    <Label>{method.name}</Label>
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>

                                {/* OPTIONAL COMPASSIONATE NOTE */}
                                <TextField
                                    value={formData.contributorNote}
                                    onChange={(val) => handleValueChange("contributorNote", val)}
                                >
                                    <Label>Leave a Message (Optional)</Label>
                                    <InputGroup>
                                        <InputGroup.TextArea rows={3} placeholder="Words of encouragement or allocation wishes..." />
                                    </InputGroup>
                                </TextField>

                            </Fieldset.Group>

                            {/* ACTION EXECUTION TRIGGER */}
                            <Fieldset.Actions className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <CreditCard width={14} height={14} /> Secured end-to-end processing pipeline
                                </div>

                                <form action="/api/checkout_sessions" method="POST">
                                    <section>
                                        <Button
                                            type="submit"
                                            role="link"
                                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                                            isDisabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Initializing Gateway...' : 'Proceed to Donate'}
                                            <HandPointRight width={16} height={16} />
                                        </Button>
                                    </section>
                                </form>
                            </Fieldset.Actions>

                        </Fieldset>
                    </Form>

                </section>

            </div>
        </main>
    );
}