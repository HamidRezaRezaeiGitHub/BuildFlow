# Estimate Model Package Overview

This package defines the core entities and repositories for managing project estimates in BuildFlow. It supports
detailed cost estimation, grouping, and line-item management for construction projects.

## Entities

### [Estimate](Estimate.java)

- Represents a cost estimate for a project.
- Fields:
    - `id` (UUID, primary key)
    - `project` ([Project](../../project/Project.java), many-to-one, not null)
    - `overallMultiplier` (double, not null)
    - `groups` (Set of [EstimateGroup](EstimateGroup.java), one-to-many, persisted)
- Relationships:
    - Linked to a project (many-to-one).
    - Has many estimate groups (one-to-many, bidirectional, FK: `estimate_id` in `estimate_groups`).

### [EstimateGroup](EstimateGroup.java)

- Represents a grouping of estimate lines for organizational purposes.
- Fields:
    - `id` (UUID, primary key)
    - `name` (String, not null)
    - `description` (String)
    - `estimate` ([Estimate](Estimate.java), many-to-one, not null)
    - `estimateLines` (Set of [EstimateLine](EstimateLine.java), one-to-many, persisted)
- Relationships:
    - Belongs to an estimate (many-to-one, FK: `estimate_id` in `estimate_groups`).
    - Has many estimate lines (one-to-many, bidirectional, FK: `group_id` in `estimate_lines`).

### [EstimateLine](EstimateLine.java)

- Represents a single line item in an estimate.
- Fields:
    - `id` (UUID, primary key)
    - `estimate` ([Estimate](Estimate.java), many-to-one, not null)
    - `workItem` ([WorkItem](./WorkItem.java), many-to-one, not null)
    - `quantity` (double, not null)
    - `estimateStrategy` ([EstimateLineStrategy](EstimateLineStrategy.java), enum, not null)
    - `multiplier` (double, not null)
    - `computedCost` (BigDecimal)
    - `group` ([EstimateGroup](EstimateGroup.java), many-to-one)
- Relationships:
    - Belongs to an estimate (many-to-one, FK: `estimate_id` in `estimate_lines`).
    - Belongs to a work item (many-to-one, FK: `work_item_id` in `estimate_lines`).
    - Belongs to an estimate group (many-to-one, FK: `group_id` in `estimate_lines`).

## Enums

### [EstimateLineStrategy](EstimateLineStrategy.java)

- Used to specify the strategy for an estimate line.
- Values: `AVERAGE`, `LATEST`, `LOWEST`

## Repositories

- [EstimateRepository](EstimateRepository.java): JPA repository for `Estimate` entity.
- [EstimateLineRepository](EstimateLineRepository.java): JPA repository for `EstimateLine` entity.
- [EstimateGroupRepository](EstimateGroupRepository.java): JPA repository for `EstimateGroup` entity.

## Relationships Diagram

- [Estimate](Estimate.java) 1---* [EstimateGroup](EstimateGroup.java) 1---* [EstimateLine](EstimateLine.java) *
  ---1 [WorkItem](./WorkItem.java)
- [EstimateGroup](EstimateGroup.java) 1---* [EstimateLine](EstimateLine.java)

## Entity Lifecycle & User Stories

- When a new [Estimate](Estimate.java) is created, it is linked to a project and can have multiple estimate groups.
- When a new [EstimateGroup](EstimateGroup.java) is created, it must be associated with an estimate and can have
  multiple estimate lines.
- When a new [EstimateLine](EstimateLine.java) is created, it must be associated with both an estimate (through an
  estimate group) and a work item.
