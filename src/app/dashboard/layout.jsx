import SideBar from '@/components/dashboard/SideBar'
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata = {
  title: "Dashboard | Blood Connect - Donate Blood and Save Lives",
  description: "Donate blood and save lives. Blood donation management system for donors, volunteers, and admins.",
};

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