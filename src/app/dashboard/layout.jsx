import SideBar from '@/components/dashboard/SideBar'
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function DashboardLayout({ children }) {
    const user = await getUserSession();
    if (!user) {
        redirect('/login');
    }
    return (
        <div className="flex min-h-screen">
            <SideBar user={user} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}