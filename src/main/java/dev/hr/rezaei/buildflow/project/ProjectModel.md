# Project Domain Model Overview

This package defines the core project-related entities, their relationships, and persistence rules for the BuildFlow application. The model is designed for strong data integrity, clear separation of concerns, and support for complex business operations.

## Entities & Relationships

### Project
- **Purpose:** Represents a construction project.
- **Table:** `projects` (unique constraint: location_id)
- **Fields:**
    - `id` (UUID, PK, auto-generated, non-updatable)
    - `builderUser` (User, many-to-one, not null, FK: builder_id)
    - `owner` (User, many-to-one, not null, FK: owner_id)
    - `location` (ProjectLocation, one-to-one, not null, cascade all, orphan removal, FK: location_id)
    - `estimates` (List<Estimate>, one-to-many, cascade all, orphan removal)
    - Inherits: createdAt, lastUpdatedAt (from UpdatableEntity)
- **Relationships:**
    - Many-to-one with User (as builder and owner)
    - One-to-one with ProjectLocation (required, cascade all)
    - One-to-many with Estimate (cascade all)
- **Constraints:**
    - Unique: location_id
    - Foreign keys: builder_id, owner_id, location_id

### ProjectLocation
- **Purpose:** Represents the address/location of a project.
- **Table:** `project_locations`
- **Fields:**
    - `id` (UUID, PK, auto-generated, non-updatable)
    - Inherits all address fields from BaseAddress: unitNumber, streetNumber, streetName, city, stateOrProvince, postalOrZipCode, country
- **Inheritance:** Extends BaseAddress

## Entity Lifecycle & Cascade Rules
- **Project creation:** Requires a new ProjectLocation (cascade all, managed via Project).
- **Location save/delete:** Always performed via Project (never directly).
- **All entity IDs:** Auto-generated UUIDs, immutable after creation.

## Business & Data Integrity Rules
- Each project must have a unique location.
- Each project must have a builder and an owner (both users must exist).
- Project locations are uniquely associated with projects (one-to-one constraint).
- Address information cannot have pre-existing IDs during project creation.
- All persistence operations validate entity state before proceeding.

## Relationships Diagram

- Project *---1 User (as builder)
- Project *---1 User (as owner)
- Project 1---1 ProjectLocation
- Project 1---* Estimate

## Database Schema Notes
- **Table Names:** Plural (projects, project_locations)
- **Foreign Key Naming:** `fk_{table}_{referenced_table}`
- **Unique Constraint Naming:** `uk_{table}_{column}`
- **Column Lengths:** Explicit for all String fields (in BaseAddress)
- **Cascade Behavior:** Only Project → ProjectLocation and Project → Estimate use cascade operations

This model ensures strong referential integrity, clear separation of project and location data, and supports complex business operations and queries.
