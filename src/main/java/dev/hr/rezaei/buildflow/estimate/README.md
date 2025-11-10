# Estimate Management Package

This package provides comprehensive cost estimation functionality for construction projects in BuildFlow. It supports hierarchical estimate organization with groups and detailed line items, enabling accurate project cost calculation and management.

## Summary

This package handles hierarchical cost estimation for construction projects with multi-level organization (Estimate → EstimateGroup → EstimateLine), supporting various calculation strategies and project cost analysis.

## Files Structure

```
estimate/
├── Estimate.java                      # Main estimate entity for project cost calculations
├── EstimateController.java            # REST API controller for estimate sub-resource endpoints
├── EstimateDto.java                   # DTO for estimate API operations
├── EstimateDtoMapper.java             # Mapper for Estimate conversions
├── EstimateGroup.java                 # Group entity for organizing line items
├── EstimateGroupDto.java              # DTO for estimate group operations
├── EstimateGroupDtoMapper.java        # Mapper for EstimateGroup conversions
├── EstimateGroupRepository.java       # JPA repository for estimate groups
├── EstimateGroupService.java          # Business logic for estimate groups
├── EstimateLine.java                  # Line item entity with cost calculations
├── EstimateLineDto.java               # DTO for estimate line item operations
├── EstimateLineDtoMapper.java         # Mapper for EstimateLine conversions
├── EstimateLineRepository.java        # JPA repository for estimate lines
├── EstimateLineService.java           # Business logic for estimate lines
├── EstimateLineStrategy.java          # Strategy enum for cost calculation methods
├── EstimateRepository.java            # JPA repository for estimates
├── EstimateService.java               # Business logic for estimate operations
└── README.md                          # This file
```

## Package Contents

### Controller Classes

| File | Description |
|------|-------------|
| [EstimateController.java](EstimateController.java) | REST API controller for estimate management under `/api/v1/projects/{projectId}/estimates` |

### Entity Classes

| File | Description |
|------|-------------|
| [Estimate.java](Estimate.java) | Main estimate entity for project cost calculations |
| [EstimateGroup.java](EstimateGroup.java) | Organizational grouping for estimate line items |
| [EstimateLine.java](EstimateLine.java) | Individual line item within an estimate with cost calculations |

### DTO Classes

| File | Description |
|------|-------------|
| [EstimateDto.java](EstimateDto.java) | Data transfer object for estimate API operations |
| [EstimateGroupDto.java](EstimateGroupDto.java) | Data transfer object for estimate group operations |
| [EstimateLineDto.java](EstimateLineDto.java) | Data transfer object for estimate line item operations |

### Mapper Classes

| File | Description |
|------|-------------|
| [EstimateDtoMapper.java](EstimateDtoMapper.java) | Mapper for Estimate entity-DTO conversions |
| [EstimateGroupDtoMapper.java](EstimateGroupDtoMapper.java) | Mapper for EstimateGroup entity-DTO conversions |
| [EstimateLineDtoMapper.java](EstimateLineDtoMapper.java) | Mapper for EstimateLine entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [EstimateRepository.java](EstimateRepository.java) | Spring Data JPA repository for estimate persistence with project-scoped queries |
| [EstimateGroupRepository.java](EstimateGroupRepository.java) | Spring Data JPA repository for estimate group persistence |
| [EstimateLineRepository.java](EstimateLineRepository.java) | Spring Data JPA repository for estimate line persistence |

### Service Classes

| File | Description |
|------|-------------|
| [EstimateService.java](EstimateService.java) | Business logic for estimate management operations |
| [EstimateGroupService.java](EstimateGroupService.java) | Business logic for estimate group operations |
| [EstimateLineService.java](EstimateLineService.java) | Business logic for estimate line item operations |

### Enums

| File | Description |
|------|-------------|
| [EstimateLineStrategy.java](EstimateLineStrategy.java) | Strategy enum for estimate line cost calculation methods |

## Endpoints

### EstimateController

All estimate endpoints are scoped as sub-resources under `/api/v1/projects/{projectId}/estimates`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/projects/{projectId}/estimates` | Retrieve all estimates for a project (paginated) |
| `POST` | `/api/v1/projects/{projectId}/estimates` | Create a new estimate for a project |
| `GET` | `/api/v1/projects/{projectId}/estimates/{estimateId}` | Retrieve a specific estimate |
| `PUT` | `/api/v1/projects/{projectId}/estimates/{estimateId}` | Update an existing estimate |
| `DELETE` | `/api/v1/projects/{projectId}/estimates/{estimateId}` | Delete an estimate |

**Pagination Support:**
- Query parameters: `page`, `size`, `sort`, `orderBy`, `direction`
- Default sort: `lastUpdatedAt,DESC`
- Default page size: 25
- Response headers: `X-Total-Count`, `X-Total-Pages`, `X-Page`, `X-Size`, `Link`
- Sortable fields: `lastUpdatedAt`, `createdAt`

## Technical Overview

### Estimate Entity
Core entity representing a complete project cost estimate.

**Key Features:**
- **Project Association**: Each estimate belongs to a specific project (unidirectional relationship)
- **Multiplier Support**: Overall multiplier for estimate adjustments
- **Group Organization**: Contains multiple estimate groups for organization
- **Audit Trail**: Inherits creation and modification tracking from UpdatableEntity

**Structure:**
- `id` (UUID): Primary key
- `project` (Project): Associated project (many-to-one relationship, non-null, lazy-loaded)
- `overallMultiplier` (double): Global multiplier applied to entire estimate
- `groups` (Set<EstimateGroup>): Collection of estimate groups

**Relationships:**
- **Project**: Unidirectional relationship from Estimate to Project (`@ManyToOne(fetch = LAZY)`). Estimates reference their project, but projects do not maintain a collection of estimates. To fetch estimates for a project, use `EstimateRepository.findByProjectId(projectId, pageable)` or the REST API endpoints under `/api/v1/projects/{projectId}/estimates`.
- **Groups**: One estimate can have many groups (one-to-many, bidirectional)

### EstimateGroup Entity
Organizational container for grouping related estimate line items.

**Key Features:**
- **Categorization**: Groups related estimate lines for better organization
- **Hierarchical Structure**: Provides logical grouping within estimates
- **Bidirectional Relationships**: Links to both estimate and estimate lines
- **Flexible Organization**: Supports any grouping strategy (by trade, phase, etc.)

**Structure:**
- `id` (UUID): Primary key
- `name` (String): Group name/title
- `description` (String): Optional detailed description
- `estimate` (Estimate): Parent estimate (many-to-one relationship)
- `estimateLines` (Set<EstimateLine>): Collection of line items in this group

**Relationships:**
- **Estimate**: Many groups belong to one estimate
- **Lines**: One group can contain many estimate lines

### EstimateLine Entity
Individual line item representing a specific cost calculation within an estimate.

**Key Features:**
- **Work Item Integration**: Links to work items for detailed specifications
- **Strategy-Based Calculation**: Multiple calculation strategies supported
- **Quantity Management**: Handles quantities and multipliers
- **Cost Computation**: Automatic cost calculation based on strategy and parameters
- **Group Assignment**: Can be assigned to estimate groups for organization

**Structure:**
- `id` (UUID): Primary key
- `estimate` (Estimate): Parent estimate (many-to-one relationship)
- `workItem` (WorkItem): Associated work item (many-to-one relationship)
- `quantity` (double): Quantity for this line item
- `estimateStrategy` (EstimateLineStrategy): Calculation strategy
- `multiplier` (double): Line-specific multiplier
- `computedCost` (BigDecimal): Calculated cost result
- `group` (EstimateGroup): Optional group assignment

**Relationships:**
- **Estimate**: Many lines belong to one estimate
- **WorkItem**: Many lines can reference one work item
- **Group**: Many lines can belong to one group (optional)

### EstimateLineStrategy Enum
Defines calculation strategies for estimate line cost computation.

**Strategies:**
- **AVERAGE**: Uses average cost from historical data
- **LATEST**: Uses most recent cost data
- **LOWEST**: Uses lowest available cost

## Data Flow Patterns

### Estimate Creation Workflow
```
1. Create Estimate entity for project
2. Define EstimateGroups for organization
3. Add EstimateLines with:
   ├── Work item references
   ├── Quantities and multipliers
   ├── Calculation strategies
   └── Group assignments
4. Calculate costs using strategies
5. Apply overall multiplier to final totals
```

### Cost Calculation Process
```
EstimateLine Cost Calculation:
1. Retrieve work item base cost
2. Apply estimate line strategy (AVERAGE/LATEST/LOWEST)
3. Apply quantity: strategy_cost × quantity
4. Apply line multiplier: quantity_cost × multiplier
5. Store computed cost in EstimateLine

Estimate Total Calculation:
1. Sum all EstimateLine computed costs
2. Apply overall multiplier
3. Generate estimate totals by group
```

## Business Logic

### Estimate Management
- **Project Integration**: Estimates are always associated with projects
- **Multiple Estimates**: Projects can have multiple estimates for comparison
- **Version Control**: Estimates can be versioned for tracking changes
- **Approval Workflow**: Estimates can go through approval processes

### Cost Calculation
- **Strategic Flexibility**: Multiple calculation strategies support different pricing approaches
- **Hierarchical Multipliers**: Line-level and estimate-level multipliers provide fine-grained control
- **Historical Data**: Integration with work item pricing history
- **Real-time Updates**: Costs recalculated when underlying data changes

### Organization and Reporting
- **Group-based Organization**: Flexible grouping supports various reporting needs
- **Cost Breakdowns**: Detailed cost analysis by group, line item, or work item
- **Comparison Tools**: Multiple estimates can be compared for decision making
- **Export Capabilities**: Estimates can be exported for client presentation

## Integration Points

This package integrates with:
- **Project Package**: Estimates belong to projects via unidirectional relationship
- **WorkItem Package**: Estimate lines reference work items for pricing
- **Base Package**: Inherits audit functionality and exception handling
- **User Package**: User permissions control estimate access via project ownership
- **Quote Package**: Estimates can be converted to client quotes

## Repository Patterns

### EstimateRepository
Extends Spring Data JPA with custom query methods for project-scoped operations:
- **Project-Scoped Queries**: `findByProjectId(UUID, Pageable)` for retrieving estimates by project
- **Eager Fetching**: Uses `@EntityGraph(attributePaths = {"groups"})` to avoid N+1 queries when loading estimates with their groups
- **Count Operations**: `countByProjectId(UUID)` for efficient count queries
- **Performance Optimization**: Lazy loading for project relationship, eager loading for groups collection when needed

All repositories follow Spring Data JPA patterns:
- **Standard CRUD**: Basic create, read, update, delete operations
- **Custom Queries**: Business-specific query methods
- **Relationship Handling**: Proper cascade and fetch strategies
- **Performance Optimization**: Strategic use of lazy vs. eager loading

## Service Layer Architecture

Services provide business logic and transaction management:
- **EstimateService**: Main estimate operations, CRUD methods, project validation, and pagination. Operates on entities (not DTOs) following the pattern from ProjectParticipantService.
- **EstimateGroupService**: Group management and organization
- **EstimateLineService**: Line item operations and cost calculations

## API Layer

### EstimateController
Provides REST endpoints as sub-resources under projects:
- **Sub-Resource Pattern**: All endpoints scoped under `/api/v1/projects/{projectId}/estimates`
- **CRUD Operations**: Create, read, update, delete estimates for a project
- **Pagination Support**: Paginated queries with default sorting by lastUpdatedAt DESC
- **Entity Mapping**: Mapping between entities and DTOs happens at controller layer
- **Validation**: Ensures estimates belong to the correct project before operations

## Design Principles

- **Unidirectional Relationships**: Estimate → Project relationship prevents circular dependencies and serialization issues
- **Hierarchical Organization**: Estimate → Groups → Lines structure
- **Strategy Pattern**: Pluggable calculation strategies
- **Separation of Concerns**: Clear distinction between entities, DTOs, and services
- **Performance**: Optimized relationships with strategic use of `@EntityGraph` and lazy loading
- **Flexibility**: Support for various estimation approaches and organizations
- **Audit Trail**: Complete tracking of estimate changes and calculations
- **Sub-Resource Design**: Estimates are managed as sub-resources of projects, reflecting domain model