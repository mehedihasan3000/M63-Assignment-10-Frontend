// app/profile/page.js
import { getUserSession } from '@/lib/core/session';
import EditProfileForm from './EditProfileForm';
import React from 'react';

const ProfilePage = async () => {
    const user = await getUserSession();

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium">Please sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <EditProfileForm initialUser={user} />
        </div>
    );
};

export default ProfilePage;