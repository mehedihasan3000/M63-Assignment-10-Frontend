"use client";
import React, { useState, useEffect } from 'react';
// Assuming your BetterAuth client instance is exported here
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
    DatePicker,
    DateField,
    Calendar,
    Button,
    FieldError,
    Description
} from '@heroui/react';
// Gravity UI Icons setup
import { Shield, CircleCheck, TriangleExclamation, Calendar as CalendarIcon, Clock } from '@gravity-ui/icons';
import { donationRequest } from '@/lib/actions/donationrequest';
import { geoData } from "@/lib/geo-data";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateDonationRequestPage() {
    const { data: session, isPending } = authClient.useSession();

    // Local Form States
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientDistrict: '',
        recipientUpazila: '',
        hospitalName: '',
        fullAddressLine: '',
        bloodGroup: '',
        donationDate: null,
        donationTime: '',
        requestMessage: ''
    });

    const [availableUpazilas, setAvailableUpazilas] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

    // Sync available upazilas when district changes
    useEffect(() => {
        if (formData.recipientDistrict) {
            setAvailableUpazilas(geoData[formData.recipientDistrict] || []);
            // Reset upazila field if district changes
            setFormData(prev => ({ ...prev, recipientUpazila: '' }));
        } else {
            setAvailableUpazilas([]);
        }
    }, [formData.recipientDistrict]);

    // Unified Handler supporting HeroUI's raw value emission setup
    const handleValueChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ success: null, message: '' });

        // Payload configuration mapping
        const payload = {
            requesterName: session?.user?.name,
            requesterId: session?.user?.id,
            requesterEmail: session?.user?.email,
            recipientName: formData.recipientName,
            recipientDistrict: formData.recipientDistrict,
            recipientUpazila: formData.recipientUpazila,
            hospitalName: formData.hospitalName,
            fullAddressLine: formData.fullAddressLine,
            bloodGroup: formData.bloodGroup,
            donationDate: formData.donationDate,
            donationTime: formData.donationTime,
            requestMessage: formData.requestMessage,
            donationStatus: "pending" // Default hidden status field
        };

        try {
            console.log(payload)
            // Connects directly to your backend Node/Express API configuration
            const res = await donationRequest(payload)

            //if (!response.ok) throw new Error('Failed to create donation request');

            setSubmitStatus({
                success: true,
                message: 'Your emergency blood donation request has been published successfully.'
            });

            // Reset contextual fields
            if (res) {
                setFormData({
                    recipientName: '',
                    recipientDistrict: '',
                    recipientUpazila: '',
                    hospitalName: '',
                    fullAddressLine: '',
                    bloodGroup: '',
                    donationDate: null,
                    donationTime: '',
                    requestMessage: ''
                });

                //router.push('/dashboard/donor/requests')
            }

            console.log(res)
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: error.message || 'An unexpected runtime connection error occurred.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 animate-pulse font-medium">Loading session parameters...</p>
            </div>
        );
    }

    // Active Security Constraint Blockade
    if (session?.user?.status === 'blocked') {
        return (
            <main className="max-w-2xl mx-auto my-12 p-8 bg-white border border-red-200 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield width={32} height={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Restricted</h2>
                <p className="text-slate-600 mb-6">
                    Your account status is currently marked as <span className="font-semibold text-red-600">Blocked</span>.
                    You do not have the authorization privileges required to issue new blood requests on BloodConnect.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 border border-slate-100">
                    If you believe this is a mistake, please reach out to system administration.
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto my-10 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-10">

                {submitStatus.message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${submitStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                        {submitStatus.success ? <CircleCheck className="mt-0.5 shrink-0" /> : <TriangleExclamation className="mt-0.5 shrink-0" />}
                        <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                )}

                <Form onSubmit={handleSubmit} className="w-full">
                    <Fieldset className="w-full space-y-8">
                        <div>
                            <Fieldset.Legend className="text-2xl font-bold text-slate-900 tracking-tight">
                                Create Donation Request
                            </Fieldset.Legend>
                            <p className="text-sm text-slate-500 mt-1">
                                Fill out the required information to look for an eligible donor match.
                            </p>
                        </div>

                        <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                            {/* --- REQUESTER META (READ ONLY) --- */}
                            <TextField isReadOnly className="opacity-75">
                                <Label>Requester Name</Label>
                                <Input value={session?.user?.name || ''} className="bg-slate-50" />
                                <Description>Automatically populated account profile identifier</Description>
                            </TextField>

                            <TextField isReadOnly className="opacity-75">
                                <Label>Requester Email</Label>
                                <Input value={session?.user?.email || ''} className="bg-slate-50" />
                            </TextField>

                            {/* --- RECIPIENT INFORMATION --- */}
                            <TextField
                                isRequired
                                value={formData.recipientName}
                                onChange={(val) => handleValueChange("recipientName", val)}
                            >
                                <Label>Recipient Name</Label>
                                <Input placeholder="Enter patient full name" />
                                <FieldError />
                            </TextField>

                            <Select
                                isRequired
                                label="Blood Group Required"
                                onChange={(val) => handleValueChange("bloodGroup", val)}
                            >
                                <Label>Blood Group</Label>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select Blood Group" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {bloodGroups.map((group) => (
                                            <ListBox.Item key={group} id={group}>
                                                <Label>{group}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            {/* --- GEOGRAPHIC CASCADING DROPDOWNS --- */}
                            <Select
                                isRequired
                                onChange={(val) => handleValueChange("recipientDistrict", val)}
                            >
                                <Label>Recipient District</Label>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select Target District" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {Object.keys(geoData).map((district) => (
                                            <ListBox.Item key={district} id={district}>
                                                <Label>{district}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            <Select
                                isRequired
                                isDisabled={!formData.recipientDistrict}
                                onChange={(val) => handleValueChange("recipientUpazila", val)}
                            >
                                <Label>Recipient Upazila</Label>
                                <Select.Trigger>
                                    <Select.Value placeholder={formData.recipientDistrict ? "Select Upazila Sub-option" : "Select a District first"} />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {availableUpazilas.map((upazila) => (
                                            <ListBox.Item key={upazila} id={upazila}>
                                                <Label>{upazila}</Label>
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            {/* --- LOGISTICS & VENUE INFO --- */}
                            <TextField
                                isRequired
                                value={formData.hospitalName}
                                onChange={(val) => handleValueChange("hospitalName", val)}
                            >
                                <Label>Hospital Name</Label>
                                <Input placeholder="e.g., Dhaka Medical College Hospital" />
                                <FieldError />
                            </TextField>

                            <TextField
                                isRequired
                                value={formData.fullAddressLine}
                                onChange={(val) => handleValueChange("fullAddressLine", val)}
                            >
                                <Label>Full Address Line</Label>
                                <Input placeholder="e.g., Zahir Raihan Rd, Dhaka" />
                                <FieldError />
                            </TextField>

                            {/* --- DATE & TIME FIELDS --- */}
                            <DatePicker
                                isRequired
                                onChange={(val) => handleValueChange("donationDate", val)}
                            >
                                <Label>Donation Date</Label>
                                <DateField.Group>
                                    <DateField.Input>
                                        {(segment) => <DateField.Segment segment={segment} />}
                                    </DateField.Input>
                                    <DateField.Suffix>
                                        <DatePicker.Trigger>
                                            <CalendarIcon />
                                        </DatePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>
                                <DatePicker.Popover>
                                    <Calendar aria-label="Choose donation date">
                                        <Calendar.Header>
                                            <Calendar.YearPickerTrigger>
                                                <Calendar.YearPickerTriggerHeading />
                                                <Calendar.YearPickerTriggerIndicator />
                                            </Calendar.YearPickerTrigger>
                                            <Calendar.NavButton slot="previous" />
                                            <Calendar.NavButton slot="next" />
                                        </Calendar.Header>
                                        <Calendar.Grid>
                                            <Calendar.GridHeader>
                                                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                            </Calendar.GridHeader>
                                            <Calendar.GridBody>
                                                {(date) => <Calendar.Cell date={date} />}
                                            </Calendar.GridBody>
                                        </Calendar.Grid>
                                    </Calendar>
                                </DatePicker.Popover>
                            </DatePicker>

                            <TextField
                                isRequired
                                value={formData.donationTime}
                                onChange={(val) => handleValueChange("donationTime", val)}
                            >
                                <Label>Donation Time</Label>
                                <Input type="time" className="w-full block" />
                                <FieldError />
                            </TextField>

                        </Fieldset.Group>

                        {/* --- DETAILED COMPASSIONATE CONTEXT --- */}
                        <div className="w-full">
                            <TextField
                                isRequired
                                value={formData.requestMessage}
                                onChange={(val) => handleValueChange("requestMessage", val)}
                            >
                                <Label>Request Message</Label>
                                <InputGroup>
                                    <InputGroup.TextArea
                                        rows={4}
                                        placeholder="Provide deep medical details regarding why the blood transfusion is critical..."
                                    />
                                </InputGroup>
                                <FieldError />
                            </TextField>
                        </div>

                        {/* --- SUBMIT ACTIONS --- */}
                        <Fieldset.Actions className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                isDisabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing Request...' : 'Publish Request'}
                            </Button>
                        </Fieldset.Actions>

                    </Fieldset>
                </Form>
            </div>
        </main>
    );
}