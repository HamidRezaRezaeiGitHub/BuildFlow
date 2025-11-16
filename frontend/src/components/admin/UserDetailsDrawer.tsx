import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { UserDetails } from '@/services/user/UserDtos';
import {
    Building,
    Calendar,
    Clock,
    Eye,
    Mail,
    MapPin,
    Phone,
    Shield,
    Star,
    UserCheck,
    User as UserIcon,
    Users as UsersIcon,
    UserX
} from 'lucide-react';
import React from 'react';

interface UserDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    userDetails: UserDetails | null;
}

/**
 * UserProfileHeader - Header section with avatar and basic info
 */
interface UserProfileHeaderProps {
    user: any;
    userAuthentication: any;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, userAuthentication }) => (
    <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
        </div>
        <div>
            <SheetTitle className="text-xl">
                {user ? `${user.contact.firstName} ${user.contact.lastName}` : 'User Profile'}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
                @{userAuthentication.username}
            </SheetDescription>
        </div>
    </div>
);

/**
 * StatusAndRoleBadges - User status and role badges
 */
interface StatusAndRoleBadgesProps {
    userAuthentication: any;
    getRoleBadgeProps: (role: string) => any;
    getStatusBadgeProps: (enabled: boolean) => any;
}

const StatusAndRoleBadges: React.FC<StatusAndRoleBadgesProps> = ({
    userAuthentication,
    getRoleBadgeProps,
    getStatusBadgeProps
}) => {
    const roleBadgeProps = getRoleBadgeProps(userAuthentication.role);
    const statusBadgeProps = getStatusBadgeProps(userAuthentication.enabled);
    const RoleIcon = roleBadgeProps.icon;
    const StatusIcon = statusBadgeProps.icon;

    return (
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
    );
};

/**
 * ContactInformationCard - Card displaying contact information
 */
interface ContactInformationCardProps {
    user: any;
}

const ContactInformationCard: React.FC<ContactInformationCardProps> = ({ user }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
                <Mail className="h-4 w-4" />
                <span>Contact Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground/70" />
                <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{user.contact.email}</div>
                </div>
            </div>

            {user.contact.phone && (
                <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground/70" />
                    <div>
                        <div className="text-sm font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">{user.contact.phone}</div>
                    </div>
                </div>
            )}

            {/* Address Information */}
            {user.contact.address && (
                <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground/70 mt-0.5" />
                    <div>
                        <div className="text-sm font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">
                            {user.contact.address.unitNumber && (
                                <>{user.contact.address.unitNumber} </>
                            )}
                            {user.contact.address.streetNumber && (
                                <>{user.contact.address.streetNumber} </>
                            )}
                            {user.contact.address.streetName}
                            <br />
                            {user.contact.address.city}, {user.contact.address.stateOrProvince}
                            {user.contact.address.postalOrZipCode && (
                                <> {user.contact.address.postalOrZipCode}</>
                            )}
                            <br />
                            {user.contact.address.country}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Labels */}
            {user.contact.labels && user.contact.labels.length > 0 && (
                <div className="flex items-start space-x-3">
                    <Building className="h-4 w-4 text-muted-foreground/70 mt-0.5" />
                    <div>
                        <div className="text-sm font-medium">Labels</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {user.contact.labels.map((label: string, index: number) => (
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
);

/**
 * AuthenticationDetailsCard - Card displaying authentication information
 */
interface AuthenticationDetailsCardProps {
    userAuthentication: any;
    formatDate: (dateString?: string) => string;
}

const AuthenticationDetailsCard: React.FC<AuthenticationDetailsCardProps> = ({
    userAuthentication,
    formatDate
}) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="h-4 w-4" />
                <span>Authentication Details</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
                <UserIcon className="h-4 w-4 text-muted-foreground/70" />
                <div>
                    <div className="text-sm font-medium">Username</div>
                    <div className="text-sm text-muted-foreground">{userAuthentication.username}</div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground/70" />
                <div>
                    <div className="text-sm font-medium">Account Created</div>
                    <div className="text-sm text-muted-foreground">{formatDate(userAuthentication.createdAt)}</div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground/70" />
                <div>
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="text-sm text-muted-foreground">{formatDate(userAuthentication.lastLogin)}</div>
                </div>
            </div>
        </CardContent>
    </Card>
);

/**
 * SystemInformationCard - Card displaying system-related information
 */
interface SystemInformationCardProps {
    user: any;
}

const SystemInformationCard: React.FC<SystemInformationCardProps> = ({ user }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
                <UserCheck className="h-4 w-4" />
                <span>System Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
                <UserCheck className="h-4 w-4 text-muted-foreground/70" />
                <div>
                    <div className="text-sm font-medium">Registration Status</div>
                    <div className="text-sm text-muted-foreground">
                        {user.registered ? 'Fully Registered' : 'Pending Registration'}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

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
                return { variant: 'destructive' as const, icon: Shield, color: 'text-destructive' };
            case 'PREMIUM_USER':
                return { variant: 'default' as const, icon: Star, color: 'text-warning' };
            case 'USER':
                return { variant: 'secondary' as const, icon: UsersIcon, color: 'text-primary' };
            case 'VIEWER':
                return { variant: 'outline' as const, icon: Eye, color: 'text-muted-foreground' };
            default:
                return { variant: 'outline' as const, icon: UsersIcon, color: 'text-muted-foreground' };
        }
    };

    const getStatusBadgeProps = (enabled: boolean) => {
        return enabled
            ? { variant: 'default' as const, className: 'bg-success/20 text-success-foreground border-success/30', icon: UserCheck }
            : { variant: 'secondary' as const, className: 'bg-destructive/20 text-destructive-foreground border-destructive/30', icon: UserX };
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <UserProfileHeader user={user} userAuthentication={userAuthentication} />
                    <StatusAndRoleBadges
                        userAuthentication={userAuthentication}
                        getRoleBadgeProps={getRoleBadgeProps}
                        getStatusBadgeProps={getStatusBadgeProps}
                    />
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Contact Information */}
                    {user && (
                        <ContactInformationCard user={user} />
                    )}

                    {/* Authentication Details */}
                    <AuthenticationDetailsCard
                        userAuthentication={userAuthentication}
                        formatDate={formatDate}
                    />

                    {/* System Information */}
                    {user && (
                        <SystemInformationCard user={user} />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};



export default UserDetailsDrawer;