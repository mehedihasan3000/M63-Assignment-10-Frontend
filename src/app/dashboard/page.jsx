import DonorDashboardHome from '@/components/dashboard/DonorTableRelated'
import StatsFeaturedCards from '@/components/dashboard/StatsFeaturedCards';
import Welcome from '@/components/dashboard/Welcome'
import { getAllDonationRequests } from '@/lib/api/donations'
import { getAllUsers } from '@/lib/api/users';
import { getUserSession } from '@/lib/core/session';
import React from 'react'

export default async function DonorDashboardPage() {
    const alldonations = await getAllDonationRequests();
    const alldonors = await getAllUsers();
    const user = await getUserSession();
    return (
        <div>
            <Welcome />
            {
                user?.role === 'donor' ? null : 
                    <StatsFeaturedCards users={alldonors} donations={alldonations} />
            }
            <DonorDashboardHome condition={true} />
        </div>
    )
}