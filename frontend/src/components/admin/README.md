# Admin Components

This directory contains components specific to the admin panel for user management and system administration.

## Summary

The admin components provide the administrative interface for managing users, viewing system information, and performing admin-only operations. These components are only accessible to users with admin privileges and provide tools for user management and system oversight.

## Files Structure

```
admin/
├── AdminLayout.tsx        # Admin panel layout wrapper
├── UserDetailsDrawer.tsx  # User details side panel
├── UsersTable.tsx         # User listing and management table
└── index.ts               # Component exports
```

## Component Details

### AdminLayout.tsx
**Purpose:** Layout wrapper for admin panel pages with admin-specific navigation.

**Features:**
- Admin navigation menu
- Page header with admin branding
- Breadcrumb navigation
- Quick actions toolbar
- Role-based access control

**Props:**
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  breadcrumbs?: Breadcrumb[];
}
```

**Usage:**
```typescript
import { AdminLayout } from '@/components/admin';

const AdminPage = () => (
  <AdminLayout title="User Management">
    <div className="admin-content">
      {/* Admin page content */}
    </div>
  </AdminLayout>
);
```

**Navigation Items:**
- Dashboard - Admin overview
- Users - User management
- Projects - Project oversight
- System - System settings
- Logs - Activity logs

### UserDetailsDrawer.tsx
**Purpose:** Side panel displaying detailed user information.

**Features:**
- User profile information
- Contact details
- Role and permissions
- Activity history
- Quick actions (edit, delete, suspend)

**Props:**
```typescript
interface UserDetailsDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onSuspend?: (userId: string) => void;
}
```

**Usage:**
```typescript
import { UserDetailsDrawer } from '@/components/admin';

const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

<UserDetailsDrawer
  user={selectedUser}
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
/>
```

**Displayed Information:**
- User ID and username
- Full name and email
- Phone number and address
- User role and status
- Account creation date
- Last login timestamp
- Projects associated with user

### UsersTable.tsx
**Purpose:** Comprehensive user listing and management table.

**Features:**
- **Sortable Columns:**
  - Name
  - Email
  - Role
  - Status
  - Created date
  - Last login

- **Filtering:**
  - Search by name/email
  - Filter by role
  - Filter by status

- **Pagination:**
  - Configurable page size
  - Page navigation
  - Total count display

- **Actions:**
  - View details
  - Edit user
  - Delete user
  - Suspend/activate

**Props:**
```typescript
interface UsersTableProps {
  users?: User[];
  loading?: boolean;
  onUserClick?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  pageSize?: number;
  className?: string;
}
```

**Usage:**
```typescript
import { UsersTable } from '@/components/admin';

const AdminUsersPage = () => {
  const { users, loading } = useUsers();

  return (
    <UsersTable
      users={users}
      loading={loading}
      onUserClick={handleUserClick}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
      pageSize={25}
    />
  );
};
```

**Table Columns:**
- Checkbox (bulk selection)
- Avatar
- Name
- Email
- Role badge
- Status badge
- Created date
- Actions menu

## User Roles

### Role Hierarchy
- **ADMIN** - Full system access
- **PREMIUM_USER** - Enhanced features
- **USER** - Standard access
- **VIEWER** - Read-only access

### Role-Based Features
Different roles have different capabilities:
- ADMIN: Full CRUD on users and projects
- PREMIUM_USER: Create/edit own projects
- USER: View and comment on projects
- VIEWER: Read-only access

## Component Integration

### AuthContext
Checks admin permissions:
```typescript
const { user } = useAuth();
const isAdmin = user?.role === 'ADMIN';
```

### AdminService
Communicates with admin endpoints:
```typescript
import { AdminService } from '@/services/AdminService';

const users = await AdminService.getAllUsers();
const userDetails = await AdminService.getUserById(userId);
await adminService.updateUser(userId, updates);
await adminService.deleteUser(userId);
```

### User Types
Uses type-safe user data structures:
```typescript
import { User } from '@/services';
```

## Styling Approach

### Table Styling
- Striped rows for readability
- Hover effects on rows
- Sticky header on scroll
- Responsive column hiding

### Status Badges
- Color-coded role badges
- Active/inactive status indicators
- Icon + text badges

### Action Buttons
- Icon buttons for quick actions
- Dropdown menu for more options
- Confirmation dialogs for destructive actions

## Security Considerations

### Access Control
- Components check user role before rendering
- Admin routes protected by ProtectedRoute wrapper
- API calls include authentication headers

### Audit Trail
- All admin actions logged
- User modifications tracked
- Deletion requires confirmation

### Data Protection
- Sensitive data masked where appropriate
- Secure deletion with confirmation
- Role changes require admin password

## Testing Considerations

Components should be tested for:
- Admin permission checking
- User data display
- Sorting and filtering
- Pagination functionality
- CRUD operations
- Error handling
- Loading states

## Usage Example

```typescript
import { AdminLayout, UsersTable, UserDetailsDrawer } from '@/components/admin';

const AdminUsersPage = () => {
  const { users, loading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditUser = async (user: User) => {
    // Edit logic
  };

  const handleDeleteUser = async (userId: string) => {
    // Delete logic with confirmation
  };

  return (
    <AdminLayout title="User Management">
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <UsersTable
          users={users}
          onUserClick={handleUserClick}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
      
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </AdminLayout>
  );
};
```

## Related Documentation

- [AdminService](../../services/README.md#adminservice) - Admin API service
- [User Types](../../services/user/UserDtos.ts) - User data structures
- [AuthContext](../../contexts/README.md#authcontext) - Role-based access
- [Admin Page](../../pages/AdminPage.tsx) - Complete admin page example
