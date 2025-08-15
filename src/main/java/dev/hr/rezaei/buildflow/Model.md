# BuildFlow Model Package Overview

This package contains all core domain entities, enums, and repositories for the BuildFlow application. It models users,
contacts, projects, estimates, work items, quotes, and their relationships, supporting business logic for construction
and supplier management.

## Entities

### [User](user/User.java)

- **Purpose:** Represents an application user.
- **Fields:**
    - `id` (UUID, primary key)
    - `username` (String, not null, unique, max 100)
    - `email` (String, not null, unique, max 100)
    - `registered` (boolean, not null, default false)
    - `contact` ([Contact](user/Contact.java), one-to-one, not null, eager fetch)
    - `builtProjects` (List of [Project](project/Project.java), one-to-many, mapped by builderUser, lazy fetch)
    - `ownedProjects` (List of [Project](project/Project.java), one-to-many, mapped by owner, lazy fetch)
    - `createdQuotes` (List of [Quote](quote/Quote.java), one-to-many, mapped by createdBy, lazy fetch)
    - `suppliedQuotes` (List of [Quote](quote/Quote.java), one-to-many, mapped by supplier, lazy fetch)
- **Relationships:**
    - One-to-one with [Contact](user/Contact.java) (eager fetch, no cascade)
    - Bidirectional one-to-many with [Project](project/Project.java) as builder and owner
    - Bidirectional one-to-many with [Quote](quote/Quote.java) as creator and supplier

### [Contact](user/Contact.java)

- **Purpose:** Represents a user's contact profile.
- **Fields:**
    - `id` (UUID, primary key)
    - `firstName` (String, not null, max 100)
    - `lastName` (String, not null, max 100)
    - `labels` (List of [ContactLabel](user/ContactLabel.java), enum collection, not null, eager fetch)
    - `email` (String, not null, unique, max 100)
    - `phone` (String, max 30)
    - `address` ([ContactAddress](user/ContactAddress.java), one-to-one, not null, cascade all, eager fetch)
- **Relationships:**
    - One-to-one with [ContactAddress](user/ContactAddress.java) (cascade all, eager fetch)
    - Has a list of [ContactLabel](user/ContactLabel.java) for categorization with eager fetch

### [ContactAddress](user/ContactAddress.java)

- **Purpose:** Represents a physical address for a contact.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Inheritance:**
    - Extends [BaseAddress](base/BaseAddress.java)

### [Project](project/Project.java)

- **Purpose:** Represents a construction project.
- **Fields:**
    - `id` (UUID, primary key)
    - `builderUser` ([User](user/User.java), many-to-one, not null, bidirectional, lazy fetch)
    - `owner` ([User](user/User.java), many-to-one, not null, bidirectional, lazy fetch)
    - `location` ([ProjectLocation](project/ProjectLocation.java), one-to-one, not null, cascade all, orphan removal, eager fetch)
    - `estimates` (List of [Estimate](estimate/Estimate.java), one-to-many, cascade all, orphan removal, lazy fetch)
- **Relationships:**
    - Many-to-one with builderUser and owner ([User](user/User.java)), bidirectional, FKs: `builder_id`, `owner_id`
    - One-to-one with [ProjectLocation](project/ProjectLocation.java), FK: `location_id`, cascade all, orphan removal, eager fetch
    - One-to-many with [Estimate](estimate/Estimate.java), FK: `project_id`, cascade all, orphan removal
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)

### [ProjectLocation](project/ProjectLocation.java)

- **Purpose:** Represents the address/location of a project.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Inheritance:**
    - Extends [BaseAddress](base/BaseAddress.java)

### [Estimate](estimate/Estimate.java)

- **Purpose:** Represents a cost estimate for a project.
- **Fields:**
    - `id` (UUID, primary key)
    - `project` ([Project](project/Project.java), many-to-one, not null, lazy fetch)
    - `overallMultiplier` (double, not null, default 1.0)
    - `groups` (Set of [EstimateGroup](estimate/EstimateGroup.java), one-to-many, cascade all, orphan removal, lazy fetch)
- **Relationships:**
    - Many-to-one with [Project](project/Project.java), FK: `project_id`
    - One-to-many with [EstimateGroup](estimate/EstimateGroup.java), FK: `estimate_id`, cascade all, orphan removal
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)

### [EstimateGroup](estimate/EstimateGroup.java)

- **Purpose:** Represents a grouping of estimate lines for organizational purposes.
- **Fields:**
    - `id` (UUID, primary key)
    - `name` (String, not null, max 100)
    - `description` (String, max 500)
    - `estimate` ([Estimate](estimate/Estimate.java), many-to-one, not null, lazy fetch)
    - `estimateLines` (Set of [EstimateLine](estimate/EstimateLine.java), one-to-many, cascade all, orphan removal, lazy fetch)
- **Relationships:**
    - Many-to-one with [Estimate](estimate/Estimate.java), FK: `estimate_id`
    - One-to-many with [EstimateLine](estimate/EstimateLine.java), FK: `group_id`, cascade all, orphan removal

### [EstimateLine](estimate/EstimateLine.java)

- **Purpose:** Represents a single line item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `estimate` ([Estimate](estimate/Estimate.java), many-to-one, not null, lazy fetch)
    - `workItem` ([WorkItem](workitem/WorkItem.java), many-to-one, not null, lazy fetch)
    - `quantity` (double, not null)
    - `estimateStrategy` ([EstimateLineStrategy](estimate/EstimateLineStrategy.java), enum, not null)
    - `multiplier` (double, not null, default 1.0)
    - `computedCost` (BigDecimal, precision 17, scale 2)
    - `group` ([EstimateGroup](estimate/EstimateGroup.java), many-to-one, lazy fetch)
- **Relationships:**
    - Many-to-one with [Estimate](estimate/Estimate.java), FK: `estimate_id`
    - Many-to-one with [WorkItem](workitem/WorkItem.java), FK: `work_item_id`
    - Many-to-one with [EstimateGroup](estimate/EstimateGroup.java), FK: `group_id`
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Validation:**
    - Quantity must be >= 0

### [WorkItem](workitem/WorkItem.java)

- **Purpose:** Represents a unit of work or cost item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `code` (String, not null, max 50)
    - `name` (String, not null, max 250)
    - `description` (String, max 1000)
    - `optional` (boolean, not null)
    - `user` ([User](user/User.java), many-to-one, not null, lazy fetch)
    - `defaultGroupName` (String, not null, default "Unassigned")
    - `domain` ([WorkItemDomain](workitem/WorkItemDomain.java), enum, not null, default PUBLIC)
- **Relationships:**
    - Many-to-one with [User](user/User.java) (owner), FK: `user_id`
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Validation:**
    - Code cannot be blank
    - Name cannot be blank
    - defaultGroupName defaults to "Unassigned" if null/blank

### [Quote](quote/Quote.java)

- **Purpose:** Represents a supplier quote for a work item.
- **Fields:**
    - `id` (UUID, primary key)
    - `workItem` ([WorkItem](workitem/WorkItem.java), many-to-one, not null, lazy fetch)
    - `createdBy` ([User](user/User.java), many-to-one, not null, bidirectional, lazy fetch)
    - `supplier` ([User](user/User.java), many-to-one, not null, bidirectional, lazy fetch)
    - `unit` ([QuoteUnit](quote/QuoteUnit.java), enum, not null)
    - `unitPrice` (BigDecimal, not null, precision 17, scale 2)
    - `currency` (Currency, not null)
    - `domain` ([QuoteDomain](quote/QuoteDomain.java), enum, not null)
    - `location` ([QuoteLocation](quote/QuoteLocation.java), many-to-one, not null, cascade all, lazy fetch)
    - `valid` (boolean, not null, default true)
- **Relationships:**
    - Many-to-one with [WorkItem](workitem/WorkItem.java), FK: `work_item_id`
    - Many-to-one with [User](user/User.java) (createdBy), FK: `created_by_id`, bidirectional
    - Many-to-one with [User](user/User.java) (supplier), FK: `supplier_id`, bidirectional
    - Many-to-one with [QuoteLocation](quote/QuoteLocation.java), FK: `location_id`, cascade all
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)

### [QuoteLocation](quote/QuoteLocation.java)

- **Purpose:** Represents the address/location for a quote.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Inheritance:**
    - Extends [BaseAddress](base/BaseAddress.java)

## Enums

### [ContactLabel](user/ContactLabel.java)
- **Purpose:** Used for categorizing contacts.
- **Values:** SUPPLIER, OWNER, LENDER, BUILDER, SUBCONTRACTOR, PERMIT_AUTHORITY, OTHER

### [EstimateLineStrategy](estimate/EstimateLineStrategy.java)
- **Purpose:** Used to specify the strategy for an estimate line.
- **Values:** AVERAGE, LATEST, LOWEST

### [WorkItemDomain](workitem/WorkItemDomain.java)
- **Purpose:** Used to specify the domain/scope of a work item.
- **Values:** PUBLIC, PRIVATE

### [QuoteUnit](quote/QuoteUnit.java)
- **Purpose:** Used to specify the unit of measurement for quotes.

### [QuoteDomain](quote/QuoteDomain.java)
- **Purpose:** Used to specify the domain/scope of a quote.

## Base Classes

### [UpdatableEntity](base/UpdatableEntity.java)
- **Purpose:** Base class for entities that track creation and update timestamps.
- **Fields:**
    - `createdAt` (Instant, not null)
    - `lastUpdatedAt` (Instant, not null)

### [BaseAddress](base/BaseAddress.java)
- **Purpose:** Base class for address-related entities.
- **Fields:**
    - `unitNumber` (String, max 20)
    - `streetNumber` (String, max 20)
    - `streetName` (String, max 200)
    - `city` (String, max 100)
    - `stateOrProvince` (String, max 100)
    - `postalOrZipCode` (String, max 20)
    - `country` (String, max 100)

## Repositories

### User Package
- [UserRepository](user/UserRepository.java): JPA repository for User entity
- [ContactRepository](user/ContactRepository.java): JPA repository for Contact entity
- [ContactAddressRepository](user/ContactAddressRepository.java): JPA repository for ContactAddress entity

### Project Package
- [ProjectRepository](project/ProjectRepository.java): JPA repository for Project entity
- [ProjectLocationRepository](project/ProjectLocationRepository.java): JPA repository for ProjectLocation entity

### Estimate Package
- [EstimateRepository](estimate/EstimateRepository.java): JPA repository for Estimate entity
- [EstimateLineRepository](estimate/EstimateLineRepository.java): JPA repository for EstimateLine entity
- [EstimateGroupRepository](estimate/EstimateGroupRepository.java): JPA repository for EstimateGroup entity

### WorkItem Package
- [WorkItemRepository](workitem/WorkItemRepository.java): JPA repository for WorkItem entity

### Quote Package
- [QuoteRepository](quote/QuoteRepository.java): JPA repository for Quote entity
- [QuoteLocationRepository](quote/QuoteLocationRepository.java): JPA repository for QuoteLocation entity

## Relationships Diagram

```
User 1---1 Contact 1---1 ContactAddress
User 1---* Project (as builder, owner)
User 1---* Quote (as creator, supplier)
User 1---* WorkItem (as owner)

Project 1---1 ProjectLocation
Project 1---* Estimate

Estimate 1---* EstimateGroup 1---* EstimateLine
EstimateLine *---1 WorkItem

Quote *---1 WorkItem
Quote *---1 QuoteLocation
```

## Key Package Organization

- **user/**: User management and contact information
- **project/**: Project entities and locations
- **estimate/**: Cost estimation system
- **workitem/**: Work item management
- **quote/**: Supplier quotation system
- **base/**: Shared base classes and utilities
- **dto/**: Data transfer objects and mapping utilities
- **util/**: Utility classes
- **config/**: Configuration and security
