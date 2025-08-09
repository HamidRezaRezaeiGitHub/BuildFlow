# Project Model Package Overview

This package defines the core entities and repositories for managing projects in BuildFlow. It supports project
ownership, builder assignment, location management, and links to cost estimates.

## Entities

### [Project](Project.java)

- **Purpose:** Represents a construction project.
- **Fields:**
    - `id` (UUID, primary key)
    - `builderUser` ([User](../../user/User.java), many-to-one, not null, bidirectional)
    - `owner` ([User](../../user/User.java), many-to-one, not null, bidirectional)
    - `location` ([ProjectLocation](ProjectLocation.java), one-to-one, not null, cascade all, orphan removal)
    - `estimates` (List of [Estimate](../estimate/Estimate.java), one-to-many, cascade all, orphan removal)
    - `createdAt` (Instant, not null)
    - `updatedAt` (Instant, not null)
- **Relationships:**
    - Many-to-one with builderUser and owner ([User](../../user/User.java)), bidirectional, FKs: `builder_id`, `owner_id`
      in `projects`
    - One-to-one with location ([ProjectLocation](ProjectLocation.java)), FK: `location_id` in `projects`, cascade
      all, orphan removal
    - One-to-many with estimates ([Estimate](../estimate/Estimate.java)), FK: `project_id` in `estimates`, cascade all,
      orphan removal

### [ProjectLocation](ProjectLocation.java)

- **Purpose:** Represents the address/location of a project.
- **Fields:**
    - `id` (UUID, primary key)
    - `unitNumber` (String)
    - `streetNumber` (String)
    - `streetName` (String)
    - `city` (String)
    - `stateOrProvince` (String)
    - `postalOrZipCode` (String)
    - `country` (String)
- **Relationships:**
    - One-to-one with project ([Project](Project.java)), referenced by `location_id` in `projects`

## Repositories

- [ProjectRepository](ProjectRepository.java): JPA repository for `Project` entity.
- [ProjectLocationRepository](ProjectLocationRepository.java): JPA repository for `ProjectLocation` entity.

## Relationships Diagram

- [Project](Project.java) 1---1 [ProjectLocation](ProjectLocation.java)
- [Project](Project.java) *---1 [User](../../user/User.java) (builder, owner, bidirectional)
- [Project](Project.java) 1---* [Estimate](../estimate/Estimate.java)

## Entity Lifecycle & User Stories

- When a new [Project](Project.java) is created, it must have a builderUser, an owner, and a location. Location is
  created and persisted with the project (cascade all, orphan removal).
- Each project can have multiple estimates associated with it. Estimates are created and persisted with the project (
  cascade all, orphan removal).
- Each project has a unique location.
- Each user can be a builderUser or owner for multiple projects (bidirectional navigation).
