# Work Item Model Package Overview

This package defines the core entity for managing work items in BuildFlow. Work items represent units of work or cost items that can be used in project estimates.

## Entities

### [WorkItem](./WorkItem.java)

- Represents a unit of work or cost item in an estimate.
- Fields:
    - `id` (UUID, primary key)
    - `code` (String, not null, max 50)
    - `name` (String, not null, max 250)
    - `description` (String, max 1000)
    - `optional` (boolean, not null)
    - `user` ([User](../user/User.java), many-to-one, not null, FK: `user_id`)
    - `defaultGroupName` (String, not null, default: "Unassigned")
    - `domain` ([WorkItemDomain](./WorkItemDomain.java), enum, not null, default: PUBLIC)
- Relationships:
    - Has an owner (many-to-one, not optional, FK: `user_id` in `work_items`).
- Validation:
    - `name` cannot be blank.
    - `defaultGroupName` is set to "Unassigned" if blank or null.

## Enums

### [WorkItemDomain](./WorkItemDomain.java)
- Used to specify the domain of a work item.
- Values: `PUBLIC`, `PRIVATE`

## Entity Lifecycle & User Stories

- Work items can be marked as optional and must have an owner.
