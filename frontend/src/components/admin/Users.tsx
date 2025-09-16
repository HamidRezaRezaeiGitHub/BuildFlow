import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown, ChevronRight, Users as UsersIcon, UserCheck, UserX, Shield, Eye, Star } from 'lucide-react';
import { adminService } from '@/services/AdminService';
import { useAuth } from '@/contexts';
import { User, UserAuthentication } from '@/services/dtos';

interface CombinedUserData {
  user: User | null;
  authentication: UserAuthentication;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
  premiumUsers: number;
  recentLogins: number;
}

/**
 * Users component for the admin panel.
 * This component displays and manages all system users with real API integration.
 * Shows user statistics and detailed user information combining User and UserAuthentication.
 */
const Users: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [users, setUsers] = useState<CombinedUserData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Load both users and stats in parallel
      const [usersData, statsData] = await Promise.all([
        adminService.getAllUsersWithAuth(token),
        adminService.getUserStats(token)
      ]);

      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeProps = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { variant: 'destructive' as const, icon: Shield };
      case 'PREMIUM_USER':
        return { variant: 'default' as const, icon: Star };
      case 'USER':
        return { variant: 'secondary' as const, icon: UsersIcon };
      case 'VIEWER':
        return { variant: 'outline' as const, icon: Eye };
      default:
        return { variant: 'outline' as const, icon: UsersIcon };
    }
  };

  const getStatusBadgeProps = (enabled: boolean) => {
    return enabled 
      ? { variant: 'default' as const, className: 'bg-green-100 text-green-800' }
      : { variant: 'secondary' as const, className: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading user data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">
            Manage system users, their roles, and access permissions.
          </p>
        </div>
        <Card className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
                <Button 
                  onClick={loadUserData} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">
          Manage system users, their roles, and access permissions.
        </p>
      </div>

      {/* User Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.adminUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.premiumUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regular</CardTitle>
              <UsersIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.recentLogins}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collapsible Users Section */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5" />
                    <span>Users</span>
                    <Badge variant="secondary">{users.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Complete user directory with authentication and profile information
                  </CardDescription>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableCaption>
                  Complete user listing with authentication status and profile information.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => {
                    const { user, authentication } = userData;
                    const roleBadgeProps = getRoleBadgeProps(authentication.role);
                    const statusBadgeProps = getStatusBadgeProps(authentication.enabled);
                    const RoleIcon = roleBadgeProps.icon;

                    return (
                      <TableRow key={authentication.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user ? `${user.contactDto.firstName} ${user.contactDto.lastName}` : 'No Profile'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {authentication.username}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {user ? (
                            <div className="text-sm">
                              <div>{user.contactDto.email}</div>
                              {user.contactDto.phone && (
                                <div className="text-gray-500">{user.contactDto.phone}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No contact info</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Badge {...roleBadgeProps} className="flex items-center space-x-1 w-fit">
                            <RoleIcon className="h-3 w-3" />
                            <span>{authentication.role}</span>
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <Badge {...statusBadgeProps}>
                            {authentication.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(authentication.createdAt)}
                        </TableCell>
                        
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(authentication.lastLogin)}
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button 
                              variant={authentication.enabled ? "destructive" : "default"} 
                              size="sm"
                            >
                              {authentication.enabled ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found.
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={loadUserData} variant="outline" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Refresh Data
        </Button>
        <Button>
          <UsersIcon className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>
    </div>
  );
};

export default Users;