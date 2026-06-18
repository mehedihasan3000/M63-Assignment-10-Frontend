import SideBar from '@/components/dashboard/SideBar'
import React from 'react'

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}