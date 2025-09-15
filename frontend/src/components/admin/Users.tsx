import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

/**
 * Users component for the admin panel.
 * This component will display and manage all system users.
 * Currently serves as a placeholder component that will be enhanced later.
 */
const Users: React.FC = () => {
  // Placeholder user data - will be replaced with actual API calls
  const placeholderUsers = [
    {
      id: '1',
      username: 'admin@buildflow.com',
      email: 'admin@buildflow.com',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      lastLogin: '2025-09-15T10:30:00Z',
      enabled: true,
    },
    {
      id: '2',
      username: 'builder@example.com',
      email: 'builder@example.com',
      role: 'USER',
      firstName: 'John',
      lastName: 'Builder',
      lastLogin: '2025-09-14T15:45:00Z',
      enabled: true,
    },
    {
      id: '3',
      username: 'viewer@example.com',
      email: 'viewer@example.com',
      role: 'VIEWER',
      firstName: 'Jane',
      lastName: 'Viewer',
      lastLogin: '2025-09-13T09:20:00Z',
      enabled: false,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (enabled: boolean) => {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">
          Manage system users, their roles, and access permissions.
        </p>
      </div>

      {/* Placeholder Notice */}
      <Card className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Placeholder Component
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                This is a placeholder Users component showing sample data. 
                The actual implementation will include API integration for user management, 
                real-time data fetching, and administrative actions.
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Table>
          <TableCaption>
            A list of all system users and their details.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(user.lastLogin)}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.enabled)}`}>
                    {user.enabled ? 'Active' : 'Disabled'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      {user.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Future Enhancement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">User Creation</h3>
          <p className="text-sm text-gray-600">
            Future: Form to create new users with role assignment
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Bulk Actions</h3>
          <p className="text-sm text-gray-600">
            Future: Bulk user operations and management tools
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">User Analytics</h3>
          <p className="text-sm text-gray-600">
            Future: User activity and authentication statistics
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Users;