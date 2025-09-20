import React from 'react';
import { Users } from '../components/admin';
import AdminLayout from '@/components/admin/AdminLayout';

/**
 * Admin page component for administrative functions.
 * This page is accessible only to users with admin privileges.
 * Contains administrative tools and user management functionality.
 */
const Admin: React.FC = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Admin Panel
                </h1>
                
                <div className="space-y-6">
                    {/* User Management Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <Users />
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            System Overview
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Monitor system status and performance metrics.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                ⚠️ System monitoring components will be implemented here.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Security Settings
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Configure security policies and access controls.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-sm">
                                🔒 Security management components will be implemented here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin;