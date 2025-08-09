# BuildFlow Model Package Overview

This package contains all core domain entities, enums, and repositories for the BuildFlow application. It models users,
contacts, projects, estimates, work items, quotes, and their relationships, supporting business logic for construction
and supplier management.

## Entities

### [User](user/User.java)

- **Purpose:** Represents an application user.
- **Fields:**
    - `id` (UUID, primary key)
    - `username` (String)
    - `email` (String)
    - `registered` (boolean, not null)
    - `contact` ([Contact](user/Contact.java), one-to-one, not null, no cascade)
- **Relationships:**
    - One-to-one with [Contact](user/Contact.java) (not null, no cascade)
    - Bidirectional one-to-many with [Project](project/Project.java) as builder and owner
    - Bidirectional one-to-many with [Quote](quote/Quote.java) as creator and supplier

### [Contact](user/Contact.java)

- **Purpose:** Represents a user's contact profile.
- **Fields:**
    - `id` (UUID, primary key)
    - `firstName` (String, not null)
    - `lastName` (String, not null)
    - `labels` (List of [ContactLabel](user/ContactLabel.java), enum collection, not null)
    - `email` (String, not null, unique)
    - `phone` (String)
    - `address` ([ContactAddress](user/ContactAddress.java), one-to-one, not null, cascade all)
- **Relationships:**
    - One-to-one with [ContactAddress](user/ContactAddress.java) (not null, cascade all)
    - Has a list of [ContactLabel](user/ContactLabel.java) for categorization
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ElementCollection`, `@Enumerated`, `@CollectionTable`, `@Column`
    - Lombok: `@Builder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [ContactAddress](user/ContactAddress.java)

- **Purpose:** Represents a physical address for a contact.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`, `@ToString`

### [Project](project/Project.java)

- **Purpose:** Represents a construction project.
- **Fields:**
    - `id` (UUID, primary key)
    - `builderUser` ([User](user/User.java), many-to-one, not null, bidirectional)
    - `owner` ([User](user/User.java), many-to-one, not null, bidirectional)
    - `location` ([ProjectLocation](project/ProjectLocation.java), one-to-one, not null, cascade all, orphan removal)
    - `estimates` (List of [Estimate](estimate/Estimate.java), one-to-many, not null, cascade all, orphan removal)
- **Relationships:**
    - Many-to-one with builderUser and owner ([User](user/User.java)), bidirectional
    - One-to-one with [ProjectLocation](project/ProjectLocation.java), cascade all, orphan removal
    - One-to-many with [Estimate](estimate/Estimate.java), cascade all, orphan removal
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@OneToOne`, `@OneToMany`, `@JoinColumn`, `@Column`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [ProjectLocation](project/ProjectLocation.java)

- **Purpose:** Represents the address/location of a project.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Inheritance:**
    - Extends [BaseAddress](base/BaseAddress.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`, `@ToString`

### [Estimate](estimate/Estimate.java)

- **Purpose:** Represents a cost estimate for a project.
- **Fields:**
    - `id` (UUID, primary key)
    - `project` ([Project](project/Project.java), many-to-one, not null)
    - `overallMultiplier` (double, default 1.0)
    - `groups` (Set of [EstimateGroup](estimate/EstimateGroup.java), one-to-many, not null, cascade all, orphan removal)
- **Relationships:**
    - Many-to-one with [Project](project/Project.java)
    - One-to-many with [EstimateGroup](estimate/EstimateGroup.java), cascade all, orphan removal
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@OneToMany`, `@JoinColumn`, `@Column`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [EstimateGroup](estimate/EstimateGroup.java)

- **Purpose:** Represents a grouping of estimate lines for organizational purposes.
- **Fields:**
    - `id` (UUID, primary key)
    - `name` (String, not null)
    - `description` (String)
    - `estimate` ([Estimate](estimate/Estimate.java), many-to-one, not null)
    - `estimateLines` (Set of [EstimateLine](estimate/EstimateLine.java), one-to-many, not null, cascade all, orphan removal)
- **Relationships:**
    - Many-to-one with [Estimate](estimate/Estimate.java)
    - One-to-many with [EstimateLine](estimate/EstimateLine.java), cascade all, orphan removal
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@OneToMany`, `@JoinColumn`, `@Column`
    - Lombok: `@Builder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [EstimateLine](estimate/EstimateLine.java)

- **Purpose:** Represents a single line item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `estimate` ([Estimate](estimate/Estimate.java), many-to-one, not null)
    - `workItem` ([WorkItem](workitem/WorkItem.java), many-to-one, not null)
    - `quantity` (double, not null)
    - `estimateStrategy` ([EstimateLineStrategy](estimate/EstimateLineStrategy.java), enum, not null)
    - `multiplier` (double, default 1.0)
    - `computedCost` (BigDecimal)
    - `group` ([EstimateGroup](estimate/EstimateGroup.java), many-to-one, not null)
- **Relationships:**
    - Many-to-one with [Estimate](estimate/Estimate.java)
    - Many-to-one with [WorkItem](workitem/WorkItem.java)
    - Many-to-one with [EstimateGroup](estimate/EstimateGroup.java)
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@Enumerated`, `@OneToMany`, `@JoinColumn`, `@Column`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [WorkItem](workitem/WorkItem.java)

- **Purpose:** Represents a unit of work or cost item in an estimate.
- **Fields:**
    - `id` (UUID, primary key)
    - `code` (String, not null)
    - `name` (String, not null)
    - `description` (String)
    - `optional` (boolean, not null)
    - `user` ([User](user/User.java), many-to-one, not null)
    - `defaultGroupName` (String, default "Unassigned")
    - `domain` ([WorkItemDomain](workitem/WorkItemDomain.java), enum, not null)
- **Relationships:**
    - Many-to-one with [User](user/User.java) (owner, not null)
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@JoinColumn`, `@Column`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [Quote](quote/Quote.java)

- **Purpose:** Represents a supplier quote for a work item.
- **Fields:**
    - `id` (UUID, primary key)
    - `workItem` ([WorkItem](workitem/WorkItem.java), many-to-one, not null)
    - `createdBy` ([User](user/User.java), many-to-one, not null)
    - `supplier` ([User](user/User.java), many-to-one, not null)
    - `unit` ([QuoteUnit](quote/QuoteUnit.java), enum, not null)
    - `unitPrice` (BigDecimal)
    - `currency` (Currency)
    - `domain` ([QuoteDomain](quote/QuoteDomain.java), enum, not null)
    - `location` ([QuoteLocation](quote/QuoteLocation.java), many-to-one, not null)
    - `valid` (boolean)
- **Relationships:**
    - Many-to-one with [WorkItem](workitem/WorkItem.java)
    - Many-to-one with [User](user/User.java) (createdBy, supplier)
    - Many-to-one with [QuoteLocation](quote/QuoteLocation.java)
- **Inheritance:**
    - Extends [UpdatableEntity](base/UpdatableEntity.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@Enumerated`, `@JoinColumn`, `@Column`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`

### [QuoteLocation](quote/QuoteLocation.java)

- **Purpose:** Represents the address/location for a quote.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](base/BaseAddress.java)
- **Inheritance:**
    - Extends [BaseAddress](base/BaseAddress.java)
- **Annotations:**
    - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
    - Lombok: `@SuperBuilder`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@EqualsAndHashCode`, `@ToString`

## Enums

### [ContactLabel](user/ContactLabel.java)

- **Purpose:** Used for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER).

### [EstimateLineStrategy](estimate/EstimateLineStrategy.java)

- **Purpose:** Used to specify the strategy for an estimate line. Values: `AVERAGE`, `LATEST`, `LOWEST`.

### [WorkItemDomain](workitem/WorkItemDomain.java)

- **Purpose:** Used to specify the domain/scope of a work item. Values: `PUBLIC`, `PRIVATE`.

### [QuoteUnit](quote/QuoteUnit.java)

- **Purpose:** Used to specify the unit of measurement for quotes.

### [QuoteDomain](quote/QuoteDomain.java)

- **Purpose:** Used to specify the domain/scope of a quote.

## Base Classes

### [UpdatableEntity](base/UpdatableEntity.java)

- **Purpose:** Base class for entities that track creation and update timestamps.
- **Fields:**
    - `createdAt` (Instant)
    - `lastUpdatedAt` (Instant)

### [BaseAddress](base/BaseAddress.java)

- **Purpose:** Base class for address-related entities.
- **Fields:**
    - `unitNumber` (String)
    - `streetNumber` (String)
    - `streetName` (String)
    - `city` (String)
    - `stateOrProvince` (String)
    - `postalOrZipCode` (String)
    - `country` (String)

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
