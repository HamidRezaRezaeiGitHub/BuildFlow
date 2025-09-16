import React, {useEffect, useState, useMemo} from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {Badge} from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronRight,
    Eye,
    Loader2,
    Search,
    Shield,
    Star,
    UserCheck,
    Users as UsersIcon,
    UserX
} from 'lucide-react';
import { AdminServiceWithAuth } from '@/services/AdminService';
import { useAuth } from '@/contexts/AuthContext';
import { UserDetails } from '@/services/dtos/UserDtos';
import UserDetailsDrawer from './UserDetailsDrawer';
import { useMediaQuery } from '@/lib/useMediaQuery';

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
 * Features responsive design with search functionality and a detailed drawer for mobile views.
 */
const Users: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [users, setUsers] = useState<UserDetails[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Initialize admin service with auth context
    const { token } = useAuth();
    const adminService = new AdminServiceWithAuth(() => token);

    // Responsive: detect if screen is below md (768px)
    const isMobile = useMediaQuery('(max-width: 767px)');

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        
        const search = searchTerm.toLowerCase();
        return users.filter(userDetails => {
            const { user, userAuthentication } = userDetails;
            
            // Safety check for authentication data
            if (!userAuthentication) return false;
            
            // Search in username
            if (userAuthentication.username?.toLowerCase().includes(search)) return true;
            
            // Search in user profile data if available
            if (user) {
                const fullName = `${user.contactDto.firstName} ${user.contactDto.lastName}`.toLowerCase();
                if (fullName.includes(search)) return true;
                if (user.contactDto.email?.toLowerCase().includes(search)) return true;
                if (user.contactDto.phone?.toLowerCase().includes(search)) return true;
            }
            
            // Search in role
            if (userAuthentication.role?.toLowerCase().includes(search)) return true;
            
            return false;
        });
    }, [users, searchTerm]);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get all user details using the new method
            const userDetailsList = await adminService.getAllUserDetails();
            
            // Calculate stats from the user details
            const statsData = adminService.calculateUserStats(userDetailsList);

            setUsers(userDetailsList);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load user data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = (userDetails: UserDetails) => {
        setSelectedUser(userDetails);
        setIsDrawerOpen(true);
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

    const getRoleBadgeProps = (role?: string) => {
        if (!role) return { variant: 'outline' as const, icon: UsersIcon };
        
        switch (role) {
            case 'ADMIN':
                return {variant: 'destructive' as const, icon: Shield};
            case 'PREMIUM_USER':
                return {variant: 'default' as const, icon: Star};
            case 'USER':
                return {variant: 'secondary' as const, icon: UsersIcon};
            case 'VIEWER':
                return {variant: 'outline' as const, icon: Eye};
            default:
                return {variant: 'outline' as const, icon: UsersIcon};
        }
    };

    const getStatusBadgeProps = (enabled?: boolean) => {
        return enabled
            ? {variant: 'default' as const, className: 'bg-green-100 text-green-800'}
            : {variant: 'secondary' as const, className: 'bg-red-100 text-red-800'};
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin"/>
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
                            <UsersIcon className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            <UserX className="h-4 w-4 text-red-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            <Shield className="h-4 w-4 text-red-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.adminUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Premium</CardTitle>
                            <Star className="h-4 w-4 text-yellow-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.premiumUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Regular</CardTitle>
                            <UsersIcon className="h-4 w-4 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
                            <UserCheck className="h-4 w-4 text-blue-600"/>
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
                                        <UsersIcon className="h-5 w-5"/>
                                        <span>Users</span>
                                        <Badge variant="secondary">{filteredUsers.length}</Badge>
                                        {searchTerm && (
                                            <Badge variant="outline" className="text-xs">
                                                {filteredUsers.length} of {users.length}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Complete user directory with authentication and profile information
                                    </CardDescription>
                                </div>
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4"/>
                                ) : (
                                    <ChevronRight className="h-4 w-4"/>
                                )}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <CardContent>
                            {/* Search Input */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, username, email, or role..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {searchTerm && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>

                            <Table>
                                <TableCaption>
                                    {searchTerm 
                                        ? `Found ${filteredUsers.length} users matching "${searchTerm}"`
                                        : `Complete user listing with authentication status and profile information.`
                                    }
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        {/* Hide these columns on medium and smaller screens */}
                                        <TableHead className="hidden lg:table-cell">Contact Info</TableHead>
                                        <TableHead className="hidden md:table-cell">Role & Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                                        <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                                        <TableHead className="text-right hidden md:table-cell">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((userDetails) => {
                                        const {user, userAuthentication} = userDetails;
                                        
                                        // Safety check for authentication data
                                        if (!userAuthentication) {
                                            console.warn('Skipping row with missing authentication data:', userDetails);
                                            return null;
                                        }
                                        
                                        const roleBadgeProps = getRoleBadgeProps(userAuthentication.role);
                                        const statusBadgeProps = getStatusBadgeProps(userAuthentication.enabled);
                                        const RoleIcon = roleBadgeProps.icon;

                                        return (
                                            <TableRow 
                                                key={userAuthentication.id || `user-${Math.random()}`}
                                                className="md:cursor-default cursor-pointer md:hover:bg-muted/50 hover:bg-muted/50"
                                                onClick={() => {
                                                    // Only make clickable on small screens (below md)
                                                    if (isMobile) {
                                                        handleViewUser(userDetails);
                                                    }
                                                }}
                                            >
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {user ? `${user.contactDto.firstName} ${user.contactDto.lastName}` : 'No Profile'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {userAuthentication.username || 'Unknown'}
                                                        </div>
                                                        {/* Show role and status badges on small screens only */}
                                                        <div className="md:hidden mt-2 space-y-1">
                                                            <div>
                                                                <Badge {...roleBadgeProps}
                                                                       className="flex items-center space-x-1 w-fit">
                                                                    <RoleIcon className="h-3 w-3"/>
                                                                    <span>{userAuthentication.role || 'Unknown'}</span>
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <Badge {...statusBadgeProps} className="text-xs">
                                                                    {userAuthentication.enabled ? 'Active' : 'Disabled'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="hidden lg:table-cell">
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

                                                <TableCell className="hidden md:table-cell">
                                                    <div className="space-y-2">
                                                        <Badge {...roleBadgeProps}
                                                               className="flex items-center space-x-1 w-fit">
                                                            <RoleIcon className="h-3 w-3"/>
                                                            <span className="lg:inline">{userAuthentication.role || 'Unknown'}</span>
                                                        </Badge>
                                                        <div>
                                                            <Badge {...statusBadgeProps}>
                                                                {userAuthentication.enabled ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                                                    {formatDate(userAuthentication.createdAt)}
                                                </TableCell>

                                                <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                                                    {formatDate(userAuthentication.lastLogin)}
                                                </TableCell>

                                                <TableCell className="text-right hidden md:table-cell">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleViewUser(userDetails)}
                                                        >
                                                            <Eye className="h-4 w-4 lg:mr-2" />
                                                            <span className="hidden lg:inline">View</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }).filter(Boolean)} {/* Filter out any null rows */}
                                </TableBody>
                            </Table>

                            {filteredUsers.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                                </div>
                            )}
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* User Details Drawer */}
            <UserDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                userDetails={selectedUser}
            />

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <Button onClick={loadUserData} variant="outline" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
                    Refresh Data
                </Button>
                <Button>
                    <UsersIcon className="h-4 w-4 mr-2"/>
                    Create User
                </Button>
            </div>
        </div>
    );
};

export default Users;

