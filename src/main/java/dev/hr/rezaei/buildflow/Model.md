# Domain Model Overview

This document consolidates the core domain/entity models for the BuildFlow application, including users, projects, estimates, quotes, work items, and their relationships. It is organized by domain and covers entities, relationships, constraints, lifecycle/cascade rules, and schema notes.

---

## User Domain Model

### User
- **Purpose:** Represents an application user (builder, owner, etc.).
- **Table:** `users` (unique constraints: username, email, contact_id)
- **Fields:**
    - `id` (UUID, PK, auto-generated, non-updatable)
    - `username` (String, 100, not null, unique)
    - `email` (String, 100, not null, unique)
    - `registered` (boolean, not null, default false)
    - `contact` (Contact, not null, one-to-one, eager fetch, FK: contact_id)
    - `builtProjects` (List<Project>, one-to-many, mapped by builderUser)
    - `ownedProjects` (List<Project>, one-to-many, mapped by owner)
    - `createdQuotes` (List<Quote>, one-to-many, mapped by createdBy)
    - `suppliedQuotes` (List<Quote>, one-to-many, mapped by supplier)
- **Relationships:**
    - One-to-one with Contact (required, eager fetch, no cascade)
    - One-to-many with Project (as builder and owner)
    - One-to-many with Quote (as creator and supplier)
- **Constraints:**
    - Unique: username, email, contact_id
    - Foreign key: contact_id → contacts.id

### Contact
- **Purpose:** Represents a user's contact profile.
- **Table:** `contacts` (unique constraints: email, address_id)
- **Fields:**
    - `id` (UUID, PK, auto-generated, non-updatable)
    - `firstName` (String, 100, not null)
    - `lastName` (String, 100, not null)
    - `labels` (List<ContactLabel>, not null, eager fetch, stored in `contact_labels` table)
    - `email` (String, 100, not null, unique)
    - `phone` (String, 30, optional)
    - `address` (ContactAddress, not null, one-to-one, cascade all, eager fetch, FK: address_id)
- **Relationships:**
    - One-to-one with ContactAddress (required, cascade all, eager fetch)
    - Collection of ContactLabel (enum, stored in `contact_labels` table)
- **Constraints:**
    - Unique: email, address_id
    - Foreign key: address_id → contact_addresses.id
    - Foreign key: contact_labels.contact_id → contacts.id

### ContactAddress
- **Purpose:** Represents a physical address for a contact.
- **Table:** `contact_addresses`
- **Fields:**
    - `id` (UUID, PK, auto-generated, non-updatable)
    - Inherits all address fields from BaseAddress: unitNumber, streetNumber, streetName, city, stateOrProvince, postalOrZipCode, country
- **Inheritance:** Extends BaseAddress

### ContactLabel
- **Purpose:** Enum for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER, BUILDER, SUBCONTRACTOR, PERMIT_AUTHORITY, OTHER, ADMINISTRATOR).
- **Storage:** Element collection in `contact_labels` table, eager fetch, mapped to contacts by FK.

#### User Model Lifecycle & Integrity
- User creation requires a new Contact (no cascade, must be managed independently).
- Contact creation requires a new ContactAddress (cascade all, address is managed via Contact).
- Address save/delete is always performed via Contact (never directly).
- All entity IDs are auto-generated UUIDs, immutable after creation.
- User email and username must be unique across the system.
- Each user must have associated contact information.
- Contact email addresses must be unique across all contacts.
- Contact addresses are uniquely associated with contacts (one-to-one constraint).
- Contact labels are stored in a separate join table for normalization and query performance.
- Address information cannot have pre-existing IDs during user creation.
- Registration status determines user access level.

---

## Project Domain Model

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

#### Project Model Lifecycle & Integrity
- Project creation requires a new ProjectLocation (cascade all, managed via Project).
- Location save/delete is always performed via Project (never directly).
- All entity IDs are auto-generated UUIDs, immutable after creation.
- Each project must have a unique location.
- Each project must have a builder and an owner (both users must exist).
- Project locations are uniquely associated with projects (one-to-one constraint).
- Address information cannot have pre-existing IDs during project creation.
- All persistence operations validate entity state before proceeding.

---

## Estimate Domain Model

### Estimate
- **Purpose:** Represents a cost estimate for a project.
- **Fields:**
    - `id` (UUID, primary key)
    - `project` (Project, many-to-one, not null)
    - `overallMultiplier` (double, not null)
    - `groups` (Set of EstimateGroup, one-to-many, persisted)
- **Relationships:**
    - Linked to a project (many-to-one).
    - Has many estimate groups (one-to-many, bidirectional, FK: `estimate_id` in `estimate_groups`).

### EstimateGroup
- **Purpose:** Grouping of estimate lines for organizational purposes.
- **Fields:**
    - `id` (UUID, primary key)
    - `name` (String, not null)
    - `description` (String)
    - `estimate` (Estimate, many-to-one, not null)
    - `estimateLines` (Set of EstimateLine, one-to-many, persisted)
- **Relationships:**
    - Belongs to an estimate (many-to-one, FK: `estimate_id` in `estimate_groups`).
    - Has many estimate lines (one-to-many, bidirectional, FK: `group_id` in `estimate_lines`).

### EstimateLine
- **Purpose:** Single line item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `estimate` (Estimate, many-to-one, not null)
    - `workItem` (WorkItem, many-to-one, not null)
    - `quantity` (double, not null)
    - `estimateStrategy` (EstimateLineStrategy, enum, not null)
    - `multiplier` (double, not null)
    - `computedCost` (BigDecimal)
    - `group` (EstimateGroup, many-to-one)
- **Relationships:**
    - Belongs to an estimate (many-to-one, FK: `estimate_id` in `estimate_lines`).
    - Belongs to a work item (many-to-one, FK: `work_item_id` in `estimate_lines`).
    - Belongs to an estimate group (many-to-one, FK: `group_id` in `estimate_lines`).

### EstimateLineStrategy (Enum)
- **Purpose:** Specifies the strategy for an estimate line.
- **Values:** `AVERAGE`, `LATEST`, `LOWEST`

#### Estimate Model Lifecycle & Integrity
- When a new Estimate is created, it is linked to a project and can have multiple estimate groups.
- When a new EstimateGroup is created, it must be associated with an estimate and can have multiple estimate lines.
- When a new EstimateLine is created, it must be associated with both an estimate (through an estimate group) and a work item.

---

## Quote Domain Model

### Quote
- **Purpose:** Represents a supplier quote for a work item.
- **Fields:**
    - `id` (UUID, primary key)
    - `workItem` (WorkItem, many-to-one, not null)
    - `createdBy` (User, many-to-one, not null, bidirectional)
    - `supplier` (User, many-to-one, not null, bidirectional)
    - `unit` (QuoteUnit, enum, not null)
    - `unitPrice` (BigDecimal, not null)
    - `currency` (Currency, not null)
    - `domain` (QuoteDomain, enum, not null)
    - `location` (QuoteLocation, many-to-one, not null, cascade all)
    - `valid` (boolean, not null)
- **Relationships:**
    - Many-to-one with WorkItem (FK: work_item_id in quotes)
    - Many-to-one with User (createdBy, FK: created_by_id in quotes, bidirectional)
    - Many-to-one with User (supplier, FK: supplier_id in quotes, bidirectional)
    - Many-to-one with QuoteLocation (FK: location_id in quotes, cascade all)

### QuoteLocation
- **Purpose:** Represents the address/location for a quote.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from BaseAddress
- **Relationships:**
    - Referenced by Quote entities (FK: location_id in quotes)

### QuoteUnit (Enum)
- **Purpose:** Specifies the unit for the quote (e.g., SQFT, LUMP_SUM).

### QuoteDomain (Enum)
- **Purpose:** Specifies the domain of the quote (e.g., PUBLIC, PRIVATE).

#### Quote Model Lifecycle & Integrity
- When a new Quote is created, it must be associated with a work item, a creator, a supplier, and a location.
- Each quote must specify its unit, price, currency, domain, and validity.
- Locations can be reused across multiple quotes.
- Users can navigate to their created and supplied quotes (bidirectional).

---

## Work Item Domain Model

### WorkItem
- **Purpose:** Represents a unit of work or cost item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `code` (String, not null, max 50)
    - `name` (String, not null, max 250)
    - `description` (String, max 1000)
    - `optional` (boolean, not null)
    - `user` (User, many-to-one, not null, FK: user_id)
    - `defaultGroupName` (String, not null, default: "Unassigned")
    - `domain` (WorkItemDomain, enum, not null, default: PUBLIC)
- **Relationships:**
    - Has an owner (many-to-one, not optional, FK: user_id in work_items).
- **Validation:**
    - `name` cannot be blank.
    - `defaultGroupName` is set to "Unassigned" if blank or null.

### WorkItemDomain (Enum)
- **Purpose:** Specifies the domain of a work item.
- **Values:** `PUBLIC`, `PRIVATE`

#### WorkItem Model Lifecycle & Integrity
- Work items can be marked as optional and must have an owner.

---

## Relationships Diagrams

- User 1---1 Contact 1---1 ContactAddress
- Contact 1---* ContactLabel (enum collection in separate table)
- User 1---* Project (builtProjects, ownedProjects)
- User 1---* Quote (createdQuotes, suppliedQuotes)
- Project *---1 User (as builder)
- Project *---1 User (as owner)
- Project 1---1 ProjectLocation
- Project 1---* Estimate
- Estimate 1---* EstimateGroup 1---* EstimateLine *---1 WorkItem
- EstimateGroup 1---* EstimateLine
- Quote *---1 WorkItem
- Quote *---1 User (createdBy, supplier, bidirectional)
- Quote *---1 QuoteLocation
- WorkItem *---1 User (owner)

---

## Database Schema Notes
- **Table Names:** Plural (users, contacts, contact_addresses, contact_labels, projects, project_locations)
- **Foreign Key Naming:** `fk_{table}_{referenced_table}`
- **Unique Constraint Naming:** `uk_{table}_{column}`
- **Column Lengths:** Explicit for all String fields (in BaseAddress)
- **Cascade Behavior:**
    - Contact → ContactAddress uses cascade operations
    - Project → ProjectLocation and Project → Estimate use cascade operations
- Estimate, Quote, and WorkItem tables follow the same naming, FK, and constraint conventions as other domains.

This model ensures strong referential integrity, clear separation of user, contact, project, estimate, quote, and work item data, and supports complex business operations and queries.
