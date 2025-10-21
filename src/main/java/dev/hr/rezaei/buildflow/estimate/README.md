# Estimate Management Package

This package provides comprehensive cost estimation functionality for construction projects in BuildFlow. It supports hierarchical estimate organization with groups and detailed line items, enabling accurate project cost calculation and management.

## Summary

This package handles hierarchical cost estimation for construction projects with multi-level organization (Estimate → EstimateGroup → EstimateLine), supporting various calculation strategies and project cost analysis.

## Files Structure

```
estimate/
├── Estimate.java                      # Main estimate entity for project cost calculations
├── EstimateDto.java                   # DTO for estimate API operations
├── EstimateDtoMapper.java             # MapStruct mapper for Estimate conversions
├── EstimateGroup.java                 # Group entity for organizing line items
├── EstimateGroupDto.java              # DTO for estimate group operations
├── EstimateGroupDtoMapper.java        # MapStruct mapper for EstimateGroup conversions
├── EstimateGroupRepository.java       # JPA repository for estimate groups
├── EstimateGroupService.java          # Business logic for estimate groups
├── EstimateLine.java                  # Line item entity with cost calculations
├── EstimateLineDto.java               # DTO for estimate line item operations
├── EstimateLineDtoMapper.java         # MapStruct mapper for EstimateLine conversions
├── EstimateLineRepository.java        # JPA repository for estimate lines
├── EstimateLineService.java           # Business logic for estimate lines
├── EstimateLineStrategy.java          # Strategy enum for cost calculation methods
├── EstimateRepository.java            # JPA repository for estimates
├── EstimateService.java               # Business logic for estimate operations
└── README.md                          # This file
```

## Package Contents

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
| [EstimateDtoMapper.java](EstimateDtoMapper.java) | MapStruct mapper for Estimate entity-DTO conversions |
| [EstimateGroupDtoMapper.java](EstimateGroupDtoMapper.java) | MapStruct mapper for EstimateGroup entity-DTO conversions |
| [EstimateLineDtoMapper.java](EstimateLineDtoMapper.java) | MapStruct mapper for EstimateLine entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [EstimateRepository.java](EstimateRepository.java) | Spring Data JPA repository for estimate persistence |
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

## Technical Overview

### Estimate Entity
Core entity representing a complete project cost estimate.

**Key Features:**
- **Project Association**: Each estimate belongs to a specific project
- **Multiplier Support**: Overall multiplier for estimate adjustments
- **Group Organization**: Contains multiple estimate groups for organization
- **Audit Trail**: Inherits creation and modification tracking from UpdatableEntity

**Structure:**
- `id` (UUID): Primary key
- `project` (Project): Associated project (many-to-one relationship)
- `overallMultiplier` (double): Global multiplier applied to entire estimate
- `groups` (Set<EstimateGroup>): Collection of estimate groups

**Relationships:**
- **Project**: Many estimates can belong to one project
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
- **Project Package**: Estimates belong to projects
- **WorkItem Package**: Estimate lines reference work items for pricing
- **Base Package**: Inherits audit functionality and exception handling
- **User Package**: User permissions control estimate access
- **Quote Package**: Estimates can be converted to client quotes

## Repository Patterns

All repositories follow Spring Data JPA patterns:
- **Standard CRUD**: Basic create, read, update, delete operations
- **Custom Queries**: Business-specific query methods
- **Relationship Handling**: Proper cascade and fetch strategies
- **Performance Optimization**: Lazy loading and query optimization

## Service Layer Architecture

Services provide business logic and transaction management:
- **EstimateService**: Main estimate operations and calculations
- **EstimateGroupService**: Group management and organization
- **EstimateLineService**: Line item operations and cost calculations

## Design Principles

- **Hierarchical Organization**: Estimate → Groups → Lines structure
- **Strategy Pattern**: Pluggable calculation strategies
- **Separation of Concerns**: Clear distinction between entities, DTOs, and services
- **Performance**: Optimized relationships and lazy loading
- **Flexibility**: Support for various estimation approaches and organizations
- **Audit Trail**: Complete tracking of estimate changes and calculations