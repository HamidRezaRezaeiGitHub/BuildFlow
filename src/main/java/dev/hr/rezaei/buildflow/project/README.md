# Project Management Package

This package provides comprehensive project management functionality for BuildFlow construction projects. It handles project creation, user assignments with role-based access, location management, authorization, and integration with estimates and other project components.

## Summary

This package manages construction projects with role-based user assignments (BUILDER/OWNER), participant tracking, location management, authorization controls, and comprehensive CRUD operations with pagination support.

## Files Structure

```
project/
├── dto/
│   ├── CreateProjectParticipantRequest.java  # Request for adding participants
│   ├── CreateProjectRequest.java             # Request for creating new projects
│   ├── CreateProjectResponse.java            # Response containing created project details
│   ├── ProjectLocationRequestDto.java        # Location info for project creation (no ID)
│   └── README.md                             # DTO package documentation
├── Project.java                              # Core project entity
├── ProjectAuthService.java                   # Authorization service for access control
├── ProjectController.java                    # REST API controller for projects
├── ProjectDto.java                           # DTO for project API operations
├── ProjectDtoMapper.java                     # Mapper for Project conversions
├── ProjectLocation.java                      # Location/address entity specific to projects
├── ProjectLocationDto.java                   # DTO for project location operations
├── ProjectLocationDtoMapper.java             # Mapper for ProjectLocation conversions
├── ProjectLocationRepository.java            # JPA repository for project locations
├── ProjectLocationService.java               # Business logic for project locations
├── ProjectParticipant.java                   # Entity linking projects to contacts with roles
├── ProjectParticipantDto.java                # DTO for project participants
├── ProjectParticipantRepository.java         # JPA repository for project participants
├── ProjectRepository.java                    # JPA repository for projects
├── ProjectRole.java                          # Enum defining project roles (BUILDER, OWNER)
├── ProjectService.java                       # Business logic for project operations
└── README.md                                 # This file
```

## Subfolder References

### [dto/](dto/) - Project DTOs
Specialized Data Transfer Objects for project creation workflows with nested location and user assignment information.

## Package Contents

### Entity Classes

| File | Description |
|------|-------------|
| [Project.java](Project.java) | Core project entity with role-based user assignment |
| [ProjectLocation.java](ProjectLocation.java) | Location/address information specific to projects |
| [ProjectParticipant.java](ProjectParticipant.java) | Links projects to contacts with specific roles |
| [ProjectRole.java](ProjectRole.java) | Enum defining project roles (BUILDER, OWNER) |

### Controller Classes

| File | Description |
|------|-------------|
| [ProjectController.java](ProjectController.java) | REST API controller for project management operations |

### DTO Classes

| File | Description |
|------|-------------|
| [ProjectDto.java](ProjectDto.java) | Data transfer object for project API operations with role and participants |
| [ProjectLocationDto.java](ProjectLocationDto.java) | Data transfer object for project location operations |
| [ProjectParticipantDto.java](ProjectParticipantDto.java) | Data transfer object for project participant information |

### DTO Sub-package

| Directory | Description |
|-----------|-------------|
| [dto/](dto/) | Contains specialized DTOs for project creation and management operations |

### Mapper Classes

| File | Description |
|------|-------------|
| [ProjectDtoMapper.java](ProjectDtoMapper.java) | Mapper for Project entity-DTO conversions with participant mapping |
| [ProjectLocationDtoMapper.java](ProjectLocationDtoMapper.java) | Mapper for ProjectLocation entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [ProjectRepository.java](ProjectRepository.java) | Spring Data JPA repository for project persistence |
| [ProjectLocationRepository.java](ProjectLocationRepository.java) | Spring Data JPA repository for project location persistence |
| [ProjectParticipantRepository.java](ProjectParticipantRepository.java) | Spring Data JPA repository for project participant persistence |

### Service Classes

| File | Description |
|------|-------------|
| [ProjectService.java](ProjectService.java) | Core business logic for project management operations |
| [ProjectLocationService.java](ProjectLocationService.java) | Business logic for project location management |
| [ProjectAuthService.java](ProjectAuthService.java) | Authorization service for project access control |

## Endpoints

### ProjectController

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/projects` | Create a new project with user, role, participants, and location | `CREATE_PROJECT` + custom auth check |
| `GET` | `/api/v1/projects/builder/{builderId}` | Retrieve projects where user has BUILDER role (with pagination) | `VIEW_PROJECT` + custom auth check |
| `GET` | `/api/v1/projects/owner/{ownerId}` | Retrieve projects where user has OWNER role (with pagination) | `VIEW_PROJECT` + custom auth check |
| `GET` | `/api/v1/projects/combined/{userId}` | Retrieve projects by user regardless of role (with pagination and date filtering) | `VIEW_PROJECT` + custom auth check |

**Pagination Support:**
- Query parameters: `page`, `size`, `sort`, `orderBy`, `direction`
- Default sort: `lastUpdatedAt,DESC`
- Default page size: 25
- Response headers: `X-Total-Count`, `X-Total-Pages`, `X-Page`, `X-Size`, `Link`
- Sortable fields: `lastUpdatedAt`, `createdAt`

## Technical Overview

### Project Entity
Core entity representing construction projects in the BuildFlow system with role-based user assignment.

**Key Features:**
- **Role-Based Assignment**: Single user with a defined role (BUILDER or OWNER)
- **Participant Management**: Additional project participants linked through ProjectParticipant entities
- **Location Integration**: One-to-one relationship with project location
- **Estimate Integration**: Can have multiple estimates for cost planning
- **Audit Trail**: Inherits creation and modification tracking from UpdatableEntity
- **Authorization Support**: Integration with authorization services for access control
- **Validation Rule**: Enforces that user and role must be non-null at all times

**Structure:**
- `id` (UUID): Primary key
- `user` (User): Primary user for the project (many-to-one relationship, non-null)
- `role` (ProjectRole): Role of the primary user (BUILDER or OWNER, non-null)
- `participants` (List<ProjectParticipant>): Additional project participants with roles (one-to-many relationship, cascade all)
- `location` (ProjectLocation): Project location information (one-to-one relationship, non-null, cascade all)
- `estimates` (List<Estimate>): Associated cost estimates (one-to-many relationship, non-null, cascade all)

**Relationships:**
- **User**: Many projects can have the same user (bidirectional)
- **Participants**: One project can have multiple participants (bidirectional)
- **Location**: One-to-one relationship with project location (unique constraint)
- **Estimates**: One project can have multiple estimates (bidirectional)

**Unique Constraints:**
- Location ID uniqueness (one location per project)

**Validation Logic:**
- The entity uses JPA lifecycle hooks (`@PrePersist` and `@PreUpdate`) via `ensureUserAndRole()` to ensure that both `user` and `role` are always set. If either is null, an `IllegalStateException` is thrown and the operation is aborted. This enforces business rules at the persistence layer and prevents invalid project records.

### ProjectParticipant Entity
Links projects to contacts with specific roles, enabling multiple stakeholders per project.

**Key Features:**
- **Role-Based Linking**: Associates contacts with projects using defined roles
- **Contact Integration**: Links to Contact entities for participant information
- **Project Scoping**: All participants belong to a specific project
- **Cascade Management**: Automatically removed when parent project is deleted

**Structure:**
- `id` (UUID): Primary key
- `project` (Project): Parent project (many-to-one relationship, non-null)
- `role` (ProjectRole): Participant's role in the project (BUILDER or OWNER, non-null)
- `contact` (Contact): Contact information for the participant (many-to-one relationship, non-null)

**Relationships:**
- **Project**: Many participants can belong to one project (bidirectional)
- **Contact**: Many participants can reference the same contact

### ProjectRole Enum
Defines the possible roles a user or participant can have in a project.

**Values:**
- `BUILDER`: User or participant is the construction builder
- `OWNER`: User or participant is the property owner

### ProjectLocation Entity
Address/location information specific to construction projects.

**Key Features:**
- **Address Inheritance**: Extends BaseAddress for consistent address handling
- **Project Integration**: Dedicated location entity for project-specific addresses
- **Geographic Information**: Complete address details for project site location
- **Unique Identification**: UUID-based primary key with project relationship

**Structure:**
- `id` (UUID): Primary key
- Inherits all address fields from BaseAddress:
  - `unitNumber`, `streetNumber`, `streetName`
  - `city`, `stateOrProvince`, `postalOrZipCode`, `country`

**Relationships:**
- **Project**: Referenced by Project entity through one-to-one relationship

### ProjectAuthService
Specialized service for project authorization and access control.

**Key Features:**
- **Access Control**: Manages user access to projects based on roles
- **Permission Validation**: Validates user permissions for project operations
- **Role-Based Security**: Integrates with user roles and contact labels
- **Secure Operations**: Ensures only authorized users can access/modify projects

**Authorization Patterns:**
- **Builder Access**: Builders can access projects they are assigned to
- **Owner Access**: Owners can access projects they own
- **Admin Access**: Administrators can access all projects
- **Read/Write Permissions**: Granular permission control for different operations

## Business Logic

### Project Management
- **Project Lifecycle**: Manages complete project lifecycle from creation to completion
- **Role-Based Assignment**: Handles user role assignment (BUILDER/OWNER) with validation
- **Participant Management**: Coordinates multiple project participants with different roles
- **Location Management**: Coordinates project site location information
- **Estimate Integration**: Supports multiple estimates for project cost analysis

### Authorization and Security
- **Role-Based Access**: Users can access projects based on their role and participation
- **User Permissions**: Primary user and participants have different access levels
- **Administrative Access**: Full access for system administrators

### Data Integrity
- **Relationship Validation**: Ensures proper user, role, and participant assignments
- **Unique Constraints**: Prevents duplicate location assignments
- **Cascade Operations**: Proper handling of related entity operations (participants deleted with project)
- **Audit Trail**: Complete tracking of project changes and access

## Data Flow Patterns

### Project Creation Workflow
```
1. Validate user and role assignment
2. Validate participants (if any)
3. Create/validate project location information
4. Create Project entity with relationships:
   ├── User assignment with role
   ├── Participant associations
   └── Location association
5. Apply authorization rules
6. Save project with audit trail
```

### Project Access Control
```
Authorization Check:
1. Identify requesting user
2. Determine user role and participation status
3. Check project relationships
4. Validate access permissions
5. Grant/deny access based on rules
```

### Estimate Integration
```
Project → Estimate Relationship:
1. Project serves as container for estimates
2. Multiple estimates per project for comparison
3. Estimate calculations feed project cost analysis
4. Approval workflows for estimate selection
```

## Integration Points

This package integrates with:
- **User Package**: Projects are assigned to builder and owner users
- **Estimate Package**: Projects contain multiple estimates for cost planning
- **WorkItem Package**: Work items are components of project work breakdown
- **Quote Package**: Project information influences quote location and context
- **Base Package**: Inherits audit functionality and address handling
- **Security Package**: Authorization services protect project access

## API Layer

### ProjectController
Provides REST endpoints for project management:
- **Project CRUD**: Create, read, update, delete projects
- **Role-Based Assignment**: Manage user roles and participants
- **Location Management**: Handle project location operations
- **Authorization**: Secure access to project operations
- **Search and Filtering**: Find projects by user role or ID
- **Pagination**: Support for paginated project queries with default sorting

#### Pagination Support
The controller supports pagination for project queries with the following features:

**Query Parameters:**
- `page` - Page number (0-based, default: 0)
- `size` - Page size (default: 25)
- `sort` - Spring Data sort format: `field,direction` (e.g., `sort=createdAt,ASC`)
- `orderBy` - Alternative sort field (e.g., `orderBy=lastUpdatedAt`)
- `direction` - Sort direction when using orderBy (ASC or DESC, default: DESC)

**Response Headers:**
- `X-Total-Count` - Total number of projects
- `X-Total-Pages` - Total number of pages
- `X-Page` - Current page number
- `X-Size` - Current page size
- `Link` - RFC 5988 navigation links (first, prev, next, last)

**Default Behavior:**
- Default sort: `lastUpdatedAt,DESC` (latest updated projects first)
- Default page size: 25
- When pagination params omitted, returns first page with default size

**Examples:**

Get first page with default settings:
```
GET /api/v1/projects/builder/{builderId}
```

Get second page with custom page size:
```
GET /api/v1/projects/builder/{builderId}?page=1&size=10
```

Sort by creation date ascending:
```
GET /api/v1/projects/builder/{builderId}?sort=createdAt,ASC
```

Sort using orderBy parameter:
```
GET /api/v1/projects/owner/{ownerId}?orderBy=lastUpdatedAt&direction=DESC
```

**Sortable Fields:**
- `lastUpdatedAt` - Last modification timestamp (default)
- `createdAt` - Creation timestamp

**Security:**
- Sort field validation prevents SQL injection
- Invalid sort fields fall back to default
- All pagination endpoints require authentication

### Request/Response Patterns
```
Project Operations:
- Create Project → Authorization → Service → Repository → Response
- Access Project → Auth Check → Data Retrieval → DTO Mapping → Response
- Update Project → Permission Check → Validation → Service → Response
- Paginated Query → Auth Check → Pageable Creation → Service → Page Response + Headers
```

## Service Architecture

### ProjectService
Core business logic for project operations:
- **Project Lifecycle**: Manages project creation, updates, and lifecycle
- **Relationship Management**: Handles user role and participant assignments
- **Business Rules**: Enforces project-specific business rules
- **Integration Coordination**: Works with other domain services

### ProjectLocationService
Location-specific functionality:
- **Location Management**: Handles project location CRUD operations
- **Address Validation**: Ensures location data integrity
- **Geographic Services**: Location validation and formatting
- **Integration**: Coordinates with project services

### ProjectAuthService
Authorization and security functionality:
- **Access Control**: Implements project access control rules
- **Permission Validation**: Validates user permissions for operations
- **Role Processing**: Handles role-based access decisions
- **Security Integration**: Works with security framework

## Repository Patterns

### Repository Design
All repositories follow Spring Data JPA patterns:
- **Standard CRUD**: Basic operations for projects and locations
- **Custom Queries**: Business-specific query methods
- **User-Based Queries**: Find projects by builder/owner assignments
- **Authorization Queries**: Support for access control filtering
- **Performance Optimization**: Efficient relationship loading

### Query Capabilities
- **Project Queries**: Find by user, role, location, creation date
- **Authorization Queries**: Filter projects based on user permissions
- **Participant Queries**: Find participants by project or contact
- **Location Queries**: Geographic and address-based searches
- **Relationship Queries**: Complex queries across project relationships

## Authorization Framework

### Access Control Rules
```
Authorization Matrix:
- Primary User: Can access project based on role (BUILDER/OWNER)
- Participants: Can access based on participant role
- Admins: Can access all projects (full access)
- Anonymous: No project access
```

### Permission Enforcement
- **Controller Level**: Authorization checks at API entry points
- **Service Level**: Business logic enforcement of permissions
- **Repository Level**: Data filtering based on user access rights
- **Cross-Domain**: Consistent authorization across related packages

## Performance Considerations

### Database Optimization
- **Lazy Loading**: Efficient relationship loading strategies
- **Indexing**: Proper indexing on user and location foreign keys
- **Query Optimization**: Optimized queries for common operations
- **Batch Operations**: Support for bulk project operations

### Authorization Performance
- **Caching**: Cache user permissions and project access rights
- **Efficient Queries**: Optimized authorization queries
- **Role-Based Filtering**: Efficient role-based data filtering

## Design Principles

- **Role-Based**: Designed around role-based user assignments (BUILDER/OWNER)
- **Participant Tracking**: Supports multiple project stakeholders through participants
- **Security First**: Built-in authorization and access control
- **Location Aware**: Comprehensive geographic information handling
- **Integration Ready**: Designed for seamless integration with estimation and work management
- **Audit Compliant**: Complete audit trail for all project operations
- **Performance Conscious**: Optimized for scale and performance
- **Extensibility**: Easy extension for additional project types and features