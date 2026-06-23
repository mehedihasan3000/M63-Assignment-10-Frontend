'use client';

import React, { useState } from 'react';
import { Table, Button } from '@heroui/react';
import { Ellipsis, Ban, Check, Shield, Person } from '@gravity-ui/icons';
import { updateUserRoleStatus } from '@/lib/actions/user';

const UserManagementTable = ({ initialUsers = [] }) => {
    const [users, setUsers] = useState(initialUsers);
    const [statusFilter, setStatusFilter] = useState('all'); // Values: 'all', 'active', 'blocked'
    const [activeDropdown, setActiveDropdown] = useState(null); // Track open action row ID

    // Toggle dropdown open/closed states
    const toggleDropdown = (userId) => {
        if (activeDropdown === userId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(userId);
        }
    };

    // Global action execution to communicate changes with the Express backend
    const handleUserAction = async (userId, updatePayload) => {
        setActiveDropdown(null); // Close the active dropdown instantly
        try {
            // Adjust the fetch endpoint path according to your actual Express routing architecture
            const res = await updateUserRoleStatus(userId, updatePayload)

            if (res) {
                // Optimistically or real-time state manipulation to eliminate full reload latency
                setUsers((prevUsers) =>
                    prevUsers?.map((user) => {
                        const currentId = user._id?.$oid || user._id;
                        return currentId === userId ? { ...user, ...updatePayload } : user;
                    })
                );
            } else {
                console.error("Failed to commit user access modifications");
            }
        } catch (error) {
            console.error("Error communicating user modification action:", error);
        }
    };

    // Filter array mapping computation
    const filteredUsers = users?.filter((user) => {
        if (statusFilter === 'all') return true;
        return user.status === statusFilter;
    });

    return (
        <div className="w-full flex flex-col gap-4">
            
            {/* Contextual Sorting and Filtering Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'active' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setStatusFilter('blocked')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'blocked' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}
                    >
                        Blocked
                    </button>
                </div>
                
                <span className="text-xs font-medium text-gray-400">
                    Showing {filteredUsers.length} of {users.length} profiles
                </span>
            </div>

            {/* Custom Interactive Table Built to Provided Anatomy Specs */}
            <Table className="min-w-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Table.ScrollContainer>
                    <Table.Content aria-label="System account management dashboard table">
                        <Table.Header>
                            {/* ADDED 'isRowHeader' HERE TO FIX THE ERROR */}
                            <Table.Column isRowHeader>Member Details</Table.Column>
                            <Table.Column>System Role</Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column className="text-right">Actions</Table.Column>
                        </Table.Header>
                        
                        <Table.Body>
                            {filteredUsers.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                                        No users matching the selected filter constraints were found.
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                filteredUsers?.map((user) => {
                                    // Safely resolves both string IDs and MongoDB $oid objects to standard strings
                                    const userId = user._id?.$oid || user._id;
                                    return (
                                        <Table.Row key={userId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            
                                            {/* Name, Avatar and Email Cell combo */}
                                            <Table.Cell>
                                                <div className="flex items-center gap-3 py-1">
                                                    <img
                                                        src={user.image || "https://i.ibb.co/7NRwzrvg/microsoft.png"}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-gray-900">{user.name}</span>
                                                        <span className="text-xs text-gray-500">{user.email}</span>
                                                    </div>
                                                </div>
                                            </Table.Cell>

                                            {/* Role badge formatting cell */}
                                            <Table.Cell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                    user.role === 'volunteer' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    'bg-gray-50 text-gray-600 border border-gray-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </Table.Cell>

                                            {/* Live state status indicator cell */}
                                            <Table.Cell>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                                    user.status === 'active' ? 'text-green-600' : 'text-red-500'
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    {user.status === 'active' ? 'Active' : 'Blocked'}
                                                </span>
                                            </Table.Cell>

                                            {/* Three-dot context trigger drop actions system */}
                                            <Table.Cell className="text-right relative">
                                                <div className="inline-block text-left">
                                                    <Button
                                                        onClick={() => toggleDropdown(userId)}
                                                        className="p-1 min-w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition"
                                                    >
                                                        <Ellipsis className="w-4 h-4" />
                                                    </Button>

                                                    {/* Custom Stateful Tailwind Floating Action Dropdown Menu */}
                                                    {activeDropdown === userId && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-10" 
                                                                onClick={() => setActiveDropdown(null)} 
                                                            />
                                                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 text-left">
                                                                
                                                                {/* Account Suspension Switches */}
                                                                {user.status === 'active' ? (
                                                                    <button
                                                                        onClick={() => handleUserAction(userId, { status: 'blocked' })}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 font-medium hover:bg-red-50 transition-colors"
                                                                    >
                                                                        <Ban className="w-3.5 h-3.5" />
                                                                        Block Member Account
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUserAction(userId, { status: 'active' })}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-600 font-medium hover:bg-green-50 transition-colors"
                                                                    >
                                                                        <Check className="w-3.5 h-3.5" />
                                                                        Restore / Unblock User
                                                                    </button>
                                                                )}

                                                                {/* Privilege Upgrades Separation Rule */}
                                                                {(user.role === 'donor' || user.role === 'volunteer') && <div className="border-t border-gray-100 my-1" />}

                                                                {/* Make Volunteer Role Button */}
                                                                {user.role === 'donor' && (
                                                                    <button
                                                                        onClick={() => handleUserAction(userId, { role: 'volunteer' })}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                                                                    >
                                                                        <Person className="w-3.5 h-3.5" />
                                                                        Promote to Volunteer
                                                                    </button>
                                                                )}

                                                                {/* Make Admin Role Button */}
                                                                {user.role !== 'admin' && (
                                                                    <button
                                                                        onClick={() => handleUserAction(userId, { role: 'admin' })}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                                                                    >
                                                                        <Shield className="w-3.5 h-3.5" />
                                                                        Promote to Admin
                                                                    </button>
                                                                )}

                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Table.Cell>

                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </div>
    );
};

export default UserManagementTable;