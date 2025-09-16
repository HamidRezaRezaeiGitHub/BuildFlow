import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar,
    Clock,
    Eye,
    Mail,
    MapPin,
    Phone,
    Shield,
    Star,
    User as UserIcon,
    Users as UsersIcon,
    UserCheck,
    UserX,
    Building
} from 'lucide-react';
import { UserDetails } from '@/services/dtos/UserDtos';

interface UserDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    userDetails: UserDetails | null;
}

/**
 * UserDetailsDrawer - A beautiful drawer component to display detailed user information
 * 
 * This component shows comprehensive user details in a side drawer format.
 * It displays both user profile information and authentication details in an
 * organized, visually appealing layout with proper spacing and icons.
 */
const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
    isOpen,
    onClose,
    userDetails
}) => {
    // If no userDetails provided, don't render
    if (!userDetails) {
        return null;
    }

    const { user, userAuthentication } = userDetails;
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadgeProps = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return { variant: 'destructive' as const, icon: Shield, color: 'text-red-600' };
            case 'PREMIUM_USER':
                return { variant: 'default' as const, icon: Star, color: 'text-yellow-600' };
            case 'USER':
                return { variant: 'secondary' as const, icon: UsersIcon, color: 'text-blue-600' };
            case 'VIEWER':
                return { variant: 'outline' as const, icon: Eye, color: 'text-gray-600' };
            default:
                return { variant: 'outline' as const, icon: UsersIcon, color: 'text-gray-600' };
        }
    };

    const getStatusBadgeProps = (enabled: boolean) => {
        return enabled
            ? { variant: 'default' as const, className: 'bg-green-100 text-green-800', icon: UserCheck }
            : { variant: 'secondary' as const, className: 'bg-red-100 text-red-800', icon: UserX };
    };

    const roleBadgeProps = getRoleBadgeProps(userAuthentication.role);
    const statusBadgeProps = getStatusBadgeProps(userAuthentication.enabled);
    const RoleIcon = roleBadgeProps.icon;
    const StatusIcon = statusBadgeProps.icon;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl">
                                {user ? `${user.contactDto.firstName} ${user.contactDto.lastName}` : 'User Profile'}
                            </SheetTitle>
                            <SheetDescription className="text-sm text-gray-500">
                                @{userAuthentication.username}
                            </SheetDescription>
                        </div>
                    </div>

                    {/* Status and Role Badges */}
                    <div className="flex space-x-2">
                        <Badge {...statusBadgeProps} className="flex items-center space-x-1">
                            <StatusIcon className="h-3 w-3" />
                            <span>{userAuthentication.enabled ? 'Active' : 'Disabled'}</span>
                        </Badge>
                        <Badge {...roleBadgeProps} className="flex items-center space-x-1">
                            <RoleIcon className="h-3 w-3" />
                            <span>{userAuthentication.role}</span>
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Contact Information */}
                    {user && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-base">
                                    <Mail className="h-4 w-4" />
                                    <span>Contact Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium">Email</div>
                                        <div className="text-sm text-gray-600">{user.contactDto.email}</div>
                                    </div>
                                </div>

                                {user.contactDto.phone && (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium">Phone</div>
                                            <div className="text-sm text-gray-600">{user.contactDto.phone}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Address Information */}
                                {user.contactDto.addressDto && (
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium">Address</div>
                                            <div className="text-sm text-gray-600">
                                                {user.contactDto.addressDto.unitNumber && (
                                                    <>{user.contactDto.addressDto.unitNumber} </>
                                                )}
                                                {user.contactDto.addressDto.streetNumber && (
                                                    <>{user.contactDto.addressDto.streetNumber} </>
                                                )}
                                                {user.contactDto.addressDto.streetName}
                                                <br />
                                                {user.contactDto.addressDto.city}, {user.contactDto.addressDto.stateOrProvince}
                                                {user.contactDto.addressDto.postalOrZipCode && (
                                                    <> {user.contactDto.addressDto.postalOrZipCode}</>
                                                )}
                                                <br />
                                                {user.contactDto.addressDto.country}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Contact Labels */}
                                {user.contactDto.labels && user.contactDto.labels.length > 0 && (
                                    <div className="flex items-start space-x-3">
                                        <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium">Labels</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {user.contactDto.labels.map((label, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Authentication Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-base">
                                <Shield className="h-4 w-4" />
                                <span>Authentication Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Username</div>
                                    <div className="text-sm text-gray-600">{userAuthentication.username}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Account Created</div>
                                    <div className="text-sm text-gray-600">{formatDate(userAuthentication.createdAt)}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Last Login</div>
                                    <div className="text-sm text-gray-600">{formatDate(userAuthentication.lastLogin)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    {user && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-base">
                                    <UserCheck className="h-4 w-4" />
                                    <span>System Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                <div className="flex items-center space-x-3">
                                    <UserCheck className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium">Registration Status</div>
                                        <div className="text-sm text-gray-600">
                                            {user.registered ? 'Fully Registered' : 'Pending Registration'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default UserDetailsDrawer;