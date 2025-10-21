# Work Item Management DTOs

This package defines Data Transfer Objects (DTOs) for work item management operations in BuildFlow. DTOs are organized to support work item creation and management workflows.

## Summary

This package provides DTOs for work item creation with domain classification and project association support.

## Files Structure

```
dto/
├── CreateWorkItemRequest.java         # Request for creating new work items
├── CreateWorkItemResponse.java        # Response containing created work item details
└── README.md                          # This file
```

## Package Contents

### Classes

| File | Description |
|------|-------------|
| [CreateWorkItemRequest.java](CreateWorkItemRequest.java) | Request object for creating new work items with domain and project association |
| [CreateWorkItemResponse.java](CreateWorkItemResponse.java) | Response object containing the created work item details |

## Technical Overview

### CreateWorkItemRequest
Primary request DTO for work item creation operations.

**Key Features:**
- **Domain Classification**: Associates work items with specific domains/categories
- **Project Integration**: Links work items to specific projects
- **Validation**: Ensures proper work item creation parameters
- **API Documentation**: Swagger-annotated for API integration

**Structure:**
- `domain` (WorkItemDomain, required): Classification domain for the work item
- `projectId` (UUID, required): ID of the associated project
- Additional fields for work item details (title, description, etc.)

**Validation Rules:**
- Domain must be a valid WorkItemDomain enum value
- Project ID must be a valid UUID format
- All required fields must be provided

### CreateWorkItemResponse
Response DTO that wraps the created work item information.

**Key Features:**
- **Complete Work Item Data**: Returns full work item details after creation
- **Project Reference**: Includes project association information
- **Consistent Structure**: Follows standard response patterns
- **Status Information**: Includes work item status and metadata

**Structure:**
- `workItemDto` (WorkItemDto): Complete details of the created work item

## Work Item Domains

The work item system supports various domains for categorization:
- **Construction**: Building and construction-related tasks
- **Planning**: Project planning and design tasks
- **Inspection**: Quality control and inspection activities
- **Materials**: Material procurement and management
- **Labor**: Workforce and labor management
- **Equipment**: Equipment and machinery tasks

## Data Flow Patterns

### Work Item Creation Flow
```
1. Client sends CreateWorkItemRequest
   ├── domain (WorkItemDomain enum)
   ├── projectId (UUID)
   └── Additional work item details

2. Service validates project existence and domain

3. Work item entity is created and saved

4. Response returns CreateWorkItemResponse
   └── WorkItemDto (complete work item details)
```

### Validation Chain
```
CreateWorkItemRequest
├── Domain validation (enum value)
├── Project ID validation (UUID format + existence)
└── Additional field validation
```

## Integration Points

This package integrates with:
- **WorkItemController**: Uses these DTOs for work item creation endpoints
- **WorkItemService**: Processes work item creation requests
- **ProjectService**: Validates project associations
- **WorkItem Entities**: Maps to/from domain entities through mappers

## Relationship to Core DTOs

These DTOs work in conjunction with core work item DTOs:
- **WorkItemDto**: Used in responses for complete work item representation
- **ProjectDto**: Referenced for project association validation
- **WorkItemDomain**: Enum for domain classification

## Workflow Integration

Work items integrate with the broader BuildFlow workflow:
- **Project Association**: Every work item belongs to a specific project
- **Domain Classification**: Enables filtering and reporting by work type
- **Status Tracking**: Supports work item lifecycle management
- **Task Dependencies**: Can be linked to estimates and quotes

## Design Principles

- **Domain-Driven**: Work items are classified by business domains
- **Project-Centric**: All work items are associated with projects
- **Validation**: Comprehensive validation ensures data integrity
- **Documentation**: Full OpenAPI/Swagger documentation
- **Extensibility**: Domain system allows for easy categorization expansion