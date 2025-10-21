# Work Item Management Package

This package provides comprehensive work item management functionality for BuildFlow construction projects. It enables detailed task breakdown, user assignment, and domain-specific categorization to support project planning and execution.

## Summary

This package handles construction work item management with detailed task breakdown structure, user assignments, domain classification, and comprehensive CRUD operations via REST endpoints.

## Files Structure

```
workitem/
├── dto/
│   ├── CreateWorkItemRequest.java         # Request for creating new work items
│   ├── CreateWorkItemResponse.java        # Response containing created work item details
│   └── README.md                          # DTO package documentation
├── WorkItem.java                          # Core work item entity
├── WorkItemController.java                # REST API controller for work items
├── WorkItemDomain.java                    # Domain classification enum (PUBLIC/PRIVATE)
├── WorkItemDto.java                       # DTO for work item API operations
├── WorkItemDtoMapper.java                 # MapStruct mapper for entity-DTO conversions
├── WorkItemRepository.java                # JPA repository for work item persistence
├── WorkItemService.java                   # Business logic for work item operations
└── README.md                              # This file
```

## Subfolder References

### [dto/](dto/) - Work Item DTOs
Specialized Data Transfer Objects for work item creation workflows, providing clean API contracts with validation support.

## Package Contents

### Entity Classes

| File | Description |
|------|-------------|
| [WorkItem.java](WorkItem.java) | Core work item entity representing individual tasks in construction projects |

### Controller Classes

| File | Description |
|------|-------------|
| [WorkItemController.java](WorkItemController.java) | REST API controller for work item management operations |

### DTO Classes

| File | Description |
|------|-------------|
| [WorkItemDto.java](WorkItemDto.java) | Data transfer object for work item API operations |

### DTO Sub-package

| Directory | Description |
|-----------|-------------|
| [dto/](dto/) | Contains specialized DTOs for work item creation and operations |

### Mapper Classes

| File | Description |
|------|-------------|
| [WorkItemDtoMapper.java](WorkItemDtoMapper.java) | MapStruct mapper for WorkItem entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [WorkItemRepository.java](WorkItemRepository.java) | Spring Data JPA repository for work item persistence |

### Service Classes

| File | Description |
|------|-------------|
| [WorkItemService.java](WorkItemService.java) | Business logic for work item management operations |

### Enums

| File | Description |
|------|-------------|
| [WorkItemDomain.java](WorkItemDomain.java) | Domain classification enum for work item categorization (PUBLIC/PRIVATE) |

## Endpoints

### WorkItemController

| Method | Endpoint | Description | Note |
|--------|----------|-------------|------|
| `POST` | `/api/v1/work-items` | Create a new work item with code, name, description, and user assignment | Currently hidden from API documentation (@Hidden) |
| `GET` | `/api/v1/work-items/user/{userId}` | Retrieve all work items assigned to a specific user | Currently hidden from API documentation (@Hidden) |
| `GET` | `/api/v1/work-items/domain/{domain}` | Retrieve all work items within a specific domain (PUBLIC or PRIVATE) | Currently hidden from API documentation (@Hidden) |

## Technical Overview

### WorkItem Entity
Core entity representing individual work tasks within construction projects.

**Key Features:**
- **Unique Identification**: Each work item has a unique code and UUID
- **User Assignment**: Work items are assigned to specific users (owners)
- **Descriptive Information**: Comprehensive naming and description fields
- **Grouping Support**: Default group organization for project structuring
- **Optional Task Handling**: Supports both required and optional work items
- **Audit Trail**: Inherits creation and modification tracking from UpdatableEntity

**Structure:**
- `id` (UUID): Primary key
- `code` (String, 50 chars): Unique work item code
- `name` (String, 250 chars): Work item name/title
- `description` (String, 1000 chars): Detailed description (optional)
- `optional` (boolean): Whether the work item is optional
- `user` (User): Assigned user/owner (many-to-one relationship)
- `defaultGroupName` (String): Default group assignment

**Business Constants:**
- `UNASSIGNED_GROUP_NAME`: Default group name for unassigned work items

**Relationships:**
- **User**: Many work items can be assigned to one user (bidirectional)

### WorkItemDomain Enum
Classification system for work item categorization by sector.

**Values:**
- **PUBLIC**: Work items for public sector projects
- **PRIVATE**: Work items for private sector projects

**Usage:**
- Project classification and filtering
- Compliance and regulatory requirements
- Reporting and analytics by sector
- Business process differentiation

## Business Logic

### Work Item Management
- **Task Breakdown**: Supports detailed work breakdown structure (WBS)
- **User Assignment**: Clear ownership and responsibility tracking
- **Group Organization**: Logical grouping for project phases or trades
- **Optional vs Required**: Flexibility in project scope management
- **Code Management**: Unique coding system for work item identification

### Project Integration
- **Cost Estimation**: Work items serve as basis for estimate line items
- **Quote Management**: Suppliers provide quotes for specific work items
- **Progress Tracking**: Work item completion drives project progress
- **Resource Planning**: User assignments support resource allocation

### Domain-Based Processing
- **Sector Compliance**: Different rules for public vs private projects
- **Regulatory Requirements**: Domain-specific compliance handling
- **Reporting Separation**: Distinct reporting for different sectors
- **Business Rules**: Domain-specific validation and processing

## Data Flow Patterns

### Work Item Creation Workflow
```
1. Define work item specifications:
   ├── Unique code generation
   ├── Name and description
   └── Optional/required designation
2. Assign to user (owner)
3. Set domain classification (PUBLIC/PRIVATE)
4. Assign to default group
5. Save with audit trail
```

### Work Item Usage Pattern
```
WorkItem → EstimateLine → Quote
├── Work items feed into estimate calculations
├── Suppliers provide quotes for work items
└── Costs roll up through estimates to project totals
```

## Integration Points

This package integrates with:
- **User Package**: Work items are assigned to users for ownership
- **Estimate Package**: Work items are referenced in estimate line items
- **Quote Package**: Suppliers provide quotes for specific work items
- **Project Package**: Work items are components of project work breakdown
- **Base Package**: Inherits audit functionality and validation

## API Layer

### WorkItemController
Provides REST endpoints for work item management:
- **CRUD Operations**: Create, read, update, delete work items
- **Search and Filtering**: Find work items by various criteria
- **User Assignment**: Manage work item assignments
- **Group Management**: Handle work item grouping operations

### Request/Response Flow
```
Client Request → Controller → Service → Repository → Database
Database → Repository → Service → Controller → Client Response
```

## Service Architecture

### WorkItemService
Core business logic for work item operations:
- **Validation**: Ensures work item data integrity
- **Business Rules**: Enforces domain-specific rules
- **User Management**: Handles user assignment logic
- **Integration**: Coordinates with other domain services

### Transaction Management
- **Data Consistency**: Ensures atomicity of work item operations
- **Cascade Operations**: Proper handling of related entity updates
- **Error Handling**: Comprehensive error handling and rollback

## Repository Patterns

### WorkItemRepository
Spring Data JPA repository providing:
- **Standard CRUD**: Basic create, read, update, delete operations
- **Custom Queries**: Business-specific query methods
- **User-Based Queries**: Find work items by assigned user
- **Group Queries**: Retrieve work items by group assignments
- **Performance Optimization**: Efficient fetching strategies

## Validation and Security

### Data Validation
- **Field Constraints**: Length and format validation
- **Business Rules**: Domain-specific validation logic
- **User Assignment**: Validates user existence and permissions
- **Code Uniqueness**: Ensures unique work item codes

### Security Considerations
- **User Authorization**: Ensures users can only access authorized work items
- **Data Privacy**: Protects sensitive work item information
- **Audit Trail**: Complete tracking of work item changes
- **Domain Separation**: Maintains separation between public and private work

## Performance Considerations

### Database Optimization
- **Lazy Loading**: Efficient relationship loading
- **Indexing**: Proper indexing on frequently queried fields
- **Query Optimization**: Optimized queries for common operations
- **Batch Operations**: Support for bulk work item operations

### Caching Strategy
- **Frequently Accessed Data**: Cache common work item lookups
- **User Assignments**: Cache user-work item relationships
- **Group Information**: Cache group assignment data

## Design Principles

- **Single Responsibility**: Each work item represents one specific task
- **User-Centric**: Clear ownership and assignment model
- **Flexible Grouping**: Supports various organizational structures
- **Domain Awareness**: Handles public/private sector differences
- **Integration Ready**: Designed for seamless integration with estimation and quoting
- **Audit Compliance**: Complete audit trail for all operations
- **Scalability**: Supports large numbers of work items per project