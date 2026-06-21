import DonorDashboardHome from '@/components/dashboard/DonorTableRelated'
import Welcome from '@/components/dashboard/Welcome'
import React from 'react'

export default function DonorDashboardPage() {
    return (
        <div>
            <Welcome />
            <DonorDashboardHome condition={true} />
        </div>
    )
}