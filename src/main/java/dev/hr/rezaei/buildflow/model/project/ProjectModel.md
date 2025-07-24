# Project Model Package Overview

This package defines the core entities and repositories for managing projects in BuildFlow. It supports project
ownership, builder assignment, location management, and links to cost estimates.

## Entities

### [Project](./Project.java)

- Represents a construction project.
- Fields:
    - `id` (UUID, primary key)
    - `builder` ([User](../user/User.java), many-to-one, not null, bidirectional)
    - `owner` ([User](../user/User.java), many-to-one, not null, bidirectional)
    - `location` ([ProjectLocation](./ProjectLocation.java), one-to-one, not null)
    - `estimates` (List of [Estimate](../estimate/Estimate.java), one-to-many)
- Relationships:
    - Linked to a builder and an owner (both many-to-one, bidirectional, FKs: `builder_id`, `owner_id` in `projects`)
    - Linked to a location (one-to-one, FK: `location_id` in `projects`)
    - Has many estimates (one-to-many, bidirectional, FK: `project_id` in `estimates`)

### [ProjectLocation](./ProjectLocation.java)

- Represents the address/location of a project.
- Fields:
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](../BaseAddress.java)
- Relationships:
    - Linked to a project (one-to-one, referenced by `location_id` in `projects`)

## Repositories

- [ProjectRepository](./ProjectRepository.java): JPA repository for `Project` entity.
- [ProjectLocationRepository](./ProjectLocationRepository.java): JPA repository for `ProjectLocation` entity.

## Relationships Diagram

- [Project](./Project.java) 1---1 [ProjectLocation](./ProjectLocation.java)
- [Project](./Project.java) *---1 [User](../user/User.java) (builder, owner, bidirectional)
- [Project](./Project.java) 1---* [Estimate](../estimate/Estimate.java)

## Entity Lifecycle & User Stories

- When a new [Project](./Project.java) is created, it must have a builder, an owner, and a location.
- Each project can have multiple estimates associated with it.
- Each project has a unique location.
- Each user can be a builder or owner for multiple projects (bidirectional navigation).
