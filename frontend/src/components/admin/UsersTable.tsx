import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { AdminServiceWithAuth } from '@/services/AdminService';
import { UserDetails } from '@/services/dtos/UserDtos';
import { useMediaQuery } from '@/utils/useMediaQuery';
import {
    ChevronDown,
    ChevronRight,
    Eye,
    Loader2,
    Search,
    Shield,
    Star,
    Users as UsersIcon
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import UserDetailsDrawer from './UserDetailsDrawer';

interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
    regularUsers: number;
    premiumUsers: number;
    recentLogins: number;
}

interface UserStatisticsProps {
    stats: UserStats | null;
    loading: boolean;
}

const UserStatCard: React.FC<{ title: string; value: number | string; loading: boolean; colorClass?: string }> = ({ title, value, loading, colorClass }) => (
    <Card className="p-4">
        <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
            {loading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <div className={`text-2xl font-bold ${colorClass || ''}`}>{value}</div>
            )}
        </div>
    </Card>
);

/**
 * UserStatistics component displays user metrics in a grid of cards
 */
const UserStatistics: React.FC<UserStatisticsProps> = ({ stats, loading }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <UserStatCard title="Total Users" value={stats?.totalUsers || 0} loading={loading} colorClass='text-primary' />
            <UserStatCard title="Active" value={stats?.activeUsers || 0} loading={loading} colorClass='text-success' />
            <UserStatCard title="Inactive" value={stats?.inactiveUsers || 0} loading={loading} colorClass='text-destructive' />
            <UserStatCard title="Admin" value={stats?.adminUsers || 0} loading={loading} colorClass='text-destructive' />
            <UserStatCard title="Premium" value={stats?.premiumUsers || 0} loading={loading} colorClass='text-warning' />
            <UserStatCard title="Regular" value={stats?.regularUsers || 0} loading={loading} colorClass='text-primary' />
            <UserStatCard title="Recent Logins" value={stats?.recentLogins || 0} loading={loading} colorClass='text-primary' />
        </div>
    );
};

interface UserTableSectionProps {
    users: UserDetails[];
    filteredUsers: UserDetails[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onViewUser: (userDetails: UserDetails) => void;
    isOpen: boolean;
    onToggleOpen: (open: boolean) => void;
}

/**
 * UserTableSection component displays the collapsible table with search functionality
 */
const UserTableSection: React.FC<UserTableSectionProps> = ({
    users,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    onViewUser,
    isOpen,
    onToggleOpen
}) => {
    const isMobile = useMediaQuery('(max-width: 767px)');

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

    const getStatusBadgeProps = (enabled?: boolean) => {
        return enabled
            ? { variant: 'default' as const, className: 'bg-success/20 text-success-foreground border-success/30' }
            : { variant: 'secondary' as const, className: 'bg-destructive/20 text-destructive-foreground border-destructive/30' };
    };

    return (
        <Collapsible open={isOpen} onOpenChange={onToggleOpen}>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center space-x-2">
                                    <UsersIcon className="h-5 w-5" />
                                    <span>Users</span>
                                    {loading ? (
                                        <div className="flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <Badge variant="secondary">{filteredUsers.length}</Badge>
                                            {searchTerm && (
                                                <Badge variant="outline" className="text-xs">
                                                    {filteredUsers.length} of {users.length}
                                                </Badge>
                                            )}
                                        </>
                                    )}
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
                        {/* Search Input */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                {loading ? (
                                    "Loading user data..."
                                ) : searchTerm ? (
                                    `Found ${filteredUsers.length} users matching "${searchTerm}"`
                                ) : (
                                    `Complete user listing with authentication status and profile information.`
                                )}
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
                                {loading ? (
                                    // Show loading skeleton rows
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={`loading-${index}`}>
                                            <TableCell className="font-medium">
                                                <div className="animate-pulse">
                                                    <div className="h-4 bg-muted rounded mb-1"></div>
                                                    <div className="h-3 bg-muted rounded w-2/3"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="animate-pulse">
                                                    <div className="h-3 bg-muted rounded mb-1"></div>
                                                    <div className="h-3 bg-muted rounded w-3/4"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="animate-pulse flex space-x-2">
                                                    <div className="h-5 bg-muted rounded w-16"></div>
                                                    <div className="h-5 bg-muted rounded w-12"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="animate-pulse">
                                                    <div className="h-3 bg-muted rounded w-20"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="animate-pulse">
                                                    <div className="h-3 bg-muted rounded w-16"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right hidden md:table-cell">
                                                <div className="animate-pulse">
                                                    <div className="h-8 bg-muted rounded w-16 ml-auto"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    filteredUsers.map((userDetails) => {
                                        const { user, userAuthentication } = userDetails;

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
                                                        onViewUser(userDetails);
                                                    }
                                                }}
                                            >
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold text-foreground">
                                                            {user ? `${user.contactDto.firstName} ${user.contactDto.lastName}` : 'No Profile'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {userAuthentication.username || 'Unknown'}
                                                        </div>
                                                        {/* Show role and status badges on small screens only */}
                                                        <div className="md:hidden mt-2 space-y-1">
                                                            <div>
                                                                <Badge {...roleBadgeProps}
                                                                    className="flex items-center space-x-1 w-fit">
                                                                    <RoleIcon className="h-3 w-3" />
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
                                                                <div className="text-muted-foreground">{user.contactDto.phone}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">No contact info</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell">
                                                    <div className="space-y-2">
                                                        <Badge {...roleBadgeProps}
                                                            className="flex items-center space-x-1 w-fit">
                                                            <RoleIcon className="h-3 w-3" />
                                                            <span className="lg:inline">{userAuthentication.role || 'Unknown'}</span>
                                                        </Badge>
                                                        <div>
                                                            <Badge {...statusBadgeProps}>
                                                                {userAuthentication.enabled ? 'Active' : 'Disabled'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                                    {formatDate(userAuthentication.createdAt)}
                                                </TableCell>

                                                <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                                    {formatDate(userAuthentication.lastLogin)}
                                                </TableCell>

                                                <TableCell className="text-right hidden md:table-cell">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => onViewUser(userDetails)}
                                                        >
                                                            <Eye className="h-4 w-4 lg:mr-2" />
                                                            <span className="hidden lg:inline">View</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }).filter(Boolean) /* Filter out any null rows */
                                )}
                            </TableBody>
                        </Table>

                        {filteredUsers.length === 0 && !loading && (
                            <div className="text-center py-8 text-muted-foreground">
                                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
};

interface UserActionButtonsProps {
    loading: boolean;
    onRefresh: () => void;
}

/**
 * UserActionButtons component displays the action buttons for user management
 */
const UserActionButtons: React.FC<UserActionButtonsProps> = ({ loading, onRefresh }) => {
    return (
        <div className="flex space-x-4">
            <Button onClick={onRefresh} variant="outline" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Refresh Data
            </Button>
            <Button>
                <UsersIcon className="h-4 w-4 mr-2" />
                Create User
            </Button>
        </div>
    );
};

/**
 * UsersTable component for the admin panel.
 * This component displays and manages all system users via AdminService.
 * Shows user statistics and detailed user information combining User and UserAuthentication.
 * Features responsive design with search functionality and a detailed drawer for mobile views.
 * AdminService automatically handles mock vs real data based on environment configuration.
 */
const UsersTable: React.FC = () => {
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

            // Get all user details using AdminService (handles mock vs real API internally)
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-primary mb-2">User Management</h2>
                <p className="text-muted-foreground">
                    Manage system users, their roles, and access permissions.
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <Card className="p-6">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <span className="text-destructive text-2xl">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-destructive-foreground">
                                    Error Loading Data
                                </h3>
                                <p className="text-sm text-destructive-foreground/80 mt-1">
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
            )}

            {/* User Statistics */}
            <UserStatistics stats={stats} loading={loading} />

            {/* Collapsible Users Section */}
            <UserTableSection
                users={users}
                filteredUsers={filteredUsers}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onViewUser={handleViewUser}
                isOpen={isOpen}
                onToggleOpen={setIsOpen}
            />

            {/* User Details Drawer */}
            <UserDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                userDetails={selectedUser}
            />

            {/* Action Buttons */}
            <UserActionButtons loading={loading} onRefresh={loadUserData} />
        </div>
    );
};

export default UsersTable;

