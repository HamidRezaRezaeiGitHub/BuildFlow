# BuildFlow Model Package Overview

This package contains all core domain entities, enums, and repositories for the BuildFlow application. It models users,
contacts, projects, estimates, work items, quotes, and their relationships, supporting business logic for construction
and supplier management.

## Entities

### [User](./user/User.java)

- **Purpose:** Represents an application user.
- **Fields:**
    - `id` (UUID, primary key)
    - `username` (String)
    - `email` (String)
    - `registered` (boolean, not null)
    - `contact` ([Contact](./user/Contact.java), one-to-one, not null, no cascade)
- **Relationships:**
    - One-to-one with [Contact](./user/Contact.java) (not null, no cascade)
    - Bidirectional one-to-many with [Project](./project/Project.java) as builder and owner
    - Bidirectional one-to-many with [Quote](./quote/Quote.java) as creator and supplier

### [Contact](./user/Contact.java)

- **Purpose:** Represents a user's contact profile.
- **Fields:**
    - `id` (UUID, primary key)
    - `firstName` (String)
    - `lastName` (String)
    - `labels` (List of [ContactLabel](./user/ContactLabel.java), enum collection)
    - `email` (String)
    - `phone` (String)
    - `address` ([ContactAddress](./user/ContactAddress.java), one-to-one, not null, cascade all)
- **Relationships:**
    - One-to-one with [ContactAddress](./user/ContactAddress.java) (not null, cascade all)
    - Has a list of [ContactLabel](./user/ContactLabel.java) for categorization

### [ContactAddress](./user/ContactAddress.java)

- **Purpose:** Represents a physical address for a contact.
- **Fields:**
    - `id` (UUID, primary key)
    - `unitNumber` (String)
    - `streetNumber` (String)
    - `streetName` (String)
    - `city` (String)
    - `stateOrProvince` (String)
    - `postalOrZipCode` (String)
    - `country` (String)

### [Project](./project/Project.java)

- **Purpose:** Represents a construction project.
- **Fields:**
    - `id` (UUID, primary key)
    - `builderUser` ([User](./user/User.java), many-to-one, not null, bidirectional)
    - `owner` ([User](./user/User.java), many-to-one, not null, bidirectional)
    - `location` ([ProjectLocation](./project/ProjectLocation.java), one-to-one, not null, cascade all, orphan removal)
    - `estimates` (List of [Estimate](./estimate/Estimate.java), one-to-many, cascade all, orphan removal)
- **Relationships:**
    - Many-to-one with builderUser and owner ([User](./user/User.java)), bidirectional
    - One-to-one with [ProjectLocation](./project/ProjectLocation.java), cascade all, orphan removal
    - One-to-many with [Estimate](./estimate/Estimate.java), cascade all, orphan removal

### [ProjectLocation](./project/ProjectLocation.java)

- **Purpose:** Represents the address/location of a project.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](./base/BaseAddress.java)
- **Relationships:**
    - Linked to a project (one-to-one, referenced by `location_id` in `projects`)

### [Estimate](./estimate/Estimate.java)

- **Purpose:** Represents a cost estimate for a project.
- **Fields:**
    - `id` (UUID, primary key)
    - `project` ([Project](./project/Project.java), many-to-one)
    - `overallMultiplier` (double)
    - `groups` (Set of [EstimateGroup](./estimate/EstimateGroup.java), one-to-many)
- **Relationships:**
    - Many-to-one with [Project](./project/Project.java)
    - One-to-many with [EstimateGroup](./estimate/EstimateGroup.java)

### [EstimateGroup](./estimate/EstimateGroup.java)

- **Purpose:** Represents a grouping of estimate lines for organizational purposes.
- **Fields:**
    - `id` (UUID, primary key)
    - `name` (String)
    - `description` (String)
    - `estimate` ([Estimate](./estimate/Estimate.java), many-to-one)
    - `estimateLines` (Set of [EstimateLine](./estimate/EstimateLine.java), one-to-many)
- **Relationships:**
    - Many-to-one with [Estimate](./estimate/Estimate.java)
    - One-to-many with [EstimateLine](./estimate/EstimateLine.java)

### [EstimateLine](./estimate/EstimateLine.java)

- **Purpose:** Represents a single line item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `estimate` ([Estimate](./estimate/Estimate.java), many-to-one)
    - `workItem` ([WorkItem](./estimate/WorkItem.java), many-to-one)
    - `quantity` (double)
    - `estimateStrategy` ([EstimateLineStrategy](./estimate/EstimateLineStrategy.java), enum)
    - `multiplier` (double)
    - `computedCost` (BigDecimal)
    - `group` ([EstimateGroup](./estimate/EstimateGroup.java), many-to-one)
- **Relationships:**
    - Many-to-one with [Estimate](./estimate/Estimate.java)
    - Many-to-one with [WorkItem](./estimate/WorkItem.java)
    - Many-to-one with [EstimateGroup](./estimate/EstimateGroup.java)

### [WorkItem](./estimate/WorkItem.java)

- **Purpose:** Represents a unit of work or cost item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `code` (String)
    - `name` (String)
    - `description` (String)
    - `optional` (boolean)
    - `owner` ([User](./user/User.java), many-to-one, not null)
    - `defaultGroupName` (String)
    - `domain` ([WorkItemDomain](./estimate/WorkItemDomain.java), enum)
- **Relationships:**
    - Many-to-one with [User](./user/User.java) (not optional)

### [Quote](./quote/Quote.java)

- **Purpose:** Represents a supplier quote for a work item.
- **Fields:**
    - `id` (UUID, primary key)
    - `workItem` ([WorkItem](./estimate/WorkItem.java), many-to-one)
    - `createdBy` ([User](./user/User.java), many-to-one, bidirectional)
    - `supplier` ([User](./user/User.java), many-to-one, bidirectional)
    - `unit` ([QuoteUnit](./quote/QuoteUnit.java), enum)
    - `unitPrice` (BigDecimal)
    - `currency` (Currency)
    - `domain` ([QuoteDomain](./quote/QuoteDomain.java), enum)
    - `location` ([QuoteLocation](./quote/QuoteLocation.java), many-to-one)
    - `valid` (boolean)
- **Relationships:**
    - Many-to-one with [WorkItem](./estimate/WorkItem.java)
    - Many-to-one with [User](./user/User.java) (createdBy, supplier)
    - Many-to-one with [QuoteLocation](./quote/QuoteLocation.java)

### [QuoteLocation](./quote/QuoteLocation.java)

- **Purpose:** Represents the address/location for a quote.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](./base/BaseAddress.java)
- **Relationships:**
    - Many-to-one with [Quote](./quote/Quote.java)

## Enums

### [ContactLabel](./user/ContactLabel.java)

- **Purpose:** Used for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER).

### [EstimateLineStrategy](./estimate/EstimateLineStrategy.java)

- **Purpose:** Used to specify the strategy for an estimate line. Values: `AVERAGE`, `LATEST`, `LOWEST`.

### [WorkItemDomain](./estimate/WorkItemDomain.java)

- **Purpose:** Used to specify the domain of a work item. Values: `PUBLIC`, `PRIVATE`.

### [QuoteUnit](./quote/QuoteUnit.java)

- **Purpose:** Specifies the unit for the quote (e.g., SQFT, LUMP_SUM).

### [QuoteDomain](./quote/QuoteDomain.java)

- **Purpose:** Specifies the domain of the quote (e.g., PUBLIC, PRIVATE).

## Repositories

- [UserRepository](./user/UserRepository.java): JPA repository for `User` entity.
- [ContactRepository](./user/ContactRepository.java): JPA repository for `Contact` entity.
- [ContactAddressRepository](./user/ContactAddressRepository.java): JPA repository for `ContactAddress` entity.
- [ProjectRepository](./project/ProjectRepository.java): JPA repository for `Project` entity.
- [ProjectLocationRepository](./project/ProjectLocationRepository.java): JPA repository for `ProjectLocation` entity.
- [EstimateRepository](./estimate/EstimateRepository.java): JPA repository for `Estimate` entity.
- [EstimateLineRepository](./estimate/EstimateLineRepository.java): JPA repository for `EstimateLine` entity.
- [EstimateGroupRepository](./estimate/EstimateGroupRepository.java): JPA repository for `EstimateGroup` entity.
- [WorkItemRepository](./estimate/WorkItemRepository.java): JPA repository for `WorkItem` entity.
- [QuoteRepository](./quote/QuoteRepository.java): JPA repository for `Quote` entity.
- [QuoteLocationRepository](./quote/QuoteLocationRepository.java): JPA repository for `QuoteLocation` entity.

## Relationships Diagram

- [User](./user/User.java) 1---1 [Contact](./user/Contact.java) 1---1 [ContactAddress](./user/ContactAddress.java)
- [User](./user/User.java) *---1 [Project](./project/Project.java) (builderUser, owner)
- [User](./user/User.java) 1---* [Quote](./quote/Quote.java) (createdQuotes, suppliedQuotes)
- [Project](./project/Project.java) 1---1 [ProjectLocation](./project/ProjectLocation.java)
- [Project](./project/Project.java) 1---* [Estimate](./estimate/Estimate.java)
- [Estimate](./estimate/Estimate.java) 1---* [EstimateGroup](./estimate/EstimateGroup.java)
- [EstimateGroup](./estimate/EstimateGroup.java) 1---* [EstimateLine](./estimate/EstimateLine.java)
- [EstimateLine](./estimate/EstimateLine.java) *---1 [WorkItem](./estimate/WorkItem.java)
- [WorkItem](./estimate/WorkItem.java) *---1 [User](./user/User.java)
- [Quote](./quote/Quote.java) *---1 [WorkItem](./estimate/WorkItem.java)
- [Quote](./quote/Quote.java) *---1 [User](./user/User.java) (createdBy, supplier)
- [Quote](./quote/Quote.java) *---1 [QuoteLocation](./quote/QuoteLocation.java)

## Entity Lifecycle & User Stories

- When a new [User](./user/User.java) is created, a [Contact](./user/Contact.java) is also created and associated. The
  `contact` field in `User` is never null.
- When a new [Contact](./user/Contact.java) is created, a [ContactAddress](./user/ContactAddress.java) is also created
  and associated. The `address` field in `Contact` is never null.
- When a new [Project](./project/Project.java) is created, it must have a builderUser, an owner, and a location. Each
  project can have multiple estimates and a unique location. Each user can be a builderUser or owner for multiple
  projects.
- When a new [Estimate](./estimate/Estimate.java) is created, it is linked to a project and can have multiple estimate
  groups.
- When a new [EstimateGroup](./estimate/EstimateGroup.java) is created, it must be associated with an estimate and can
  have multiple estimate lines.
- When a new [EstimateLine](./estimate/EstimateLine.java) is created, it must be associated with both an estimate and a
  work item, and can be grouped under an estimate group.
- Work items can be marked as optional and must have an owner.
- When a new [Quote](./quote/Quote.java) is created, it must be associated with a work item, a creator, a supplier, and
  a location. Locations can be reused across multiple quotes. Users can navigate to their created and supplied quotes.
