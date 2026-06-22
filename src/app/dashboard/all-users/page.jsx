import { getAllUsers } from '@/lib/api/users';
import UserManagementTable from './UserManagementTable';
import React from 'react';

const AllUsersPage = async () => {
    
    const users = await getAllUsers();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System User Directory</h1>
                    <p className="text-sm text-gray-500">Manage global donor privileges, access rights, and active verification states.</p>
                </div>
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold border border-red-100 shadow-sm">
                    Total Registered Members: {users.length}
                </div>
            </div>

            {/* Client-side filtering and management table */}
            <UserManagementTable initialUsers={users} />
        </div>
    );
};

export default AllUsersPage;