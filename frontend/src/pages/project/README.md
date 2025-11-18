# Project Pages

This directory contains page components related to project management functionality.

## Summary

The project pages directory contains route-level components for project-related views, such as creating new projects, viewing project details, and managing project information.

## Files Structure

```
project/
├── NewProject.tsx       # New project creation page
├── ProjectDetails.tsx   # Project details view page
└── index.ts             # Page exports
```

## Page Details

### NewProject.tsx
**Purpose:** Full page for creating new construction projects with a multi-step accordion flow.

**Route:** `/projects/new` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Endpoint: `POST /api/v1/projects`
- Creates project with user role (BUILDER/OWNER) and location
- **Note:** Step 2 (Other Party Information) requires separate participant creation API (TODO)

**User Flow:**
1. **Step 1: User Role Selection** - User identifies as builder or owner
2. **Step 2: Other Party Information** - Optional contact details (NOT YET IMPLEMENTED - data collected but not submitted)
3. **Step 3: Project Location** - Required address information for the construction site
4. **Validation** - Required fields must be completed before submission
5. **Success** - Shows success message, redirects to project details after 2 seconds

**Key Features:**
- Multi-step accordion navigation with state persistence
- Mobile-first responsive design
- Inline validation for required fields
- Success/error message banners
- Keyboard accessible with ARIA attributes

**Key Features:**
- Multi-step accordion navigation with state persistence
- Mobile-first responsive design
- Inline validation for required fields
- Success/error message banners
- Keyboard accessible with ARIA attributes

**Components Used:**
- `FlexibleSignUpForm` - Optional other party information capture
- `FlexibleAddressForm` - Project location address input
- `StandardBottomNavbar` - Mobile navigation

**State Management:**
- User role selection (builder/owner)
- Other party contact information (not yet submitted to backend)
- Project location data with validation
- Form submission status and messages

---

### ProjectDetails.tsx
**Purpose:** View detailed information about a specific construction project.

**Route:** `/projects/:id` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Endpoint: `GET /api/v1/projects/{projectId}`
- Fetches complete project details including location and timestamps

**Page Sections:**
- **Project Summary** - User role, creation/update timestamps
- **Location Details** - Full address information
- **Participants** - Builder and owner information (future enhancement)
- **Tabbed Content** - Overview, Estimates, Work Items (placeholders)

**Key Features:**
- Mobile-first responsive design
- Loading states with skeleton placeholders
- Error handling with retry option
- Direct URL access and deep linking support
- Navigation controls (Back, Edit, Delete)

**Components Used:**
- `Card` components for content sections
- `Tabs` for organizing project information
- `Skeleton` for loading states
- `Button` for actions

**State Management:**
- Project data fetched from backend
- Loading, error, and success states
- URL parameter extraction via `useParams`

---

## Route Protection

All project pages require authentication:
```typescript
<ProtectedRoute>
  <NewProject />
</ProtectedRoute>

<ProtectedRoute>
  <ProjectDetails />
</ProtectedRoute>
```

**Access Control:**
- Authenticated users can create projects
- Users can view their own projects
- Admins have full access to all projects

## Related Documentation

- [ProjectService](../../services/project/README.md) - Backend API integration
- [Project Types](../../services/project/ProjectDtos.ts) - TypeScript interfaces
- [StandardBottomNavbar](../../components/navbar/README.md) - Mobile navigation
- [FlexibleAddressForm](../../components/address/README.md) - Address input component
