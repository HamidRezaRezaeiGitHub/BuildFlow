# User Model Package Overview

This package contains the core user-related entities and their repositories for the BuildFlow application. Below is a summary of each entity and their relationships:

## Entities

### [User](User.java)

- **Purpose:** Represents an application user.
- **Table:** `users` with unique constraints on username, email, and contact_id
- **Fields:**
    - `id` (UUID, primary key, auto-generated, non-updatable)
    - `username` (String, length 100, not null, unique)
    - `email` (String, length 100, not null, unique)
    - `registered` (boolean, not null, default false)
    - `contact` ([Contact](Contact.java), not null, one-to-one, eager fetch, foreign key: contact_id)
    - `builtProjects` (List of [Project](../project/Project.java), one-to-many, lazy fetch, mapped by builderUser)
    - `ownedProjects` (List of [Project](../project/Project.java), one-to-many, lazy fetch, mapped by owner)
    - `createdQuotes` (List of [Quote](../quote/Quote.java), one-to-many, lazy fetch, mapped by createdBy)
    - `suppliedQuotes` (List of [Quote](../quote/Quote.java), one-to-many, lazy fetch, mapped by supplier)
- **Relationships:**
    - One-to-one with [Contact](Contact.java) (each user has a contact profile, eager fetch, no cascade)
    - Bidirectional one-to-many with [Project](../project/Project.java) as builder (user.builtProjects, project.builderUser)
    - Bidirectional one-to-many with [Project](../project/Project.java) as owner (user.ownedProjects, project.owner)
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as creator (user.createdQuotes, quote.createdBy)
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as supplier (user.suppliedQuotes, quote.supplier)
- **Unique Constraints:**
    - `uk_users_username` on username column
    - `uk_users_email` on email column
    - `uk_users_contact_id` on contact_id column
- **Foreign Keys:**
    - `fk_users_contact` references contact_id

### [Contact](Contact.java)

- **Purpose:** Represents a user's contact profile.
- **Table:** `contacts` with unique constraints on email and address_id
- **Fields:**
    - `id` (UUID, primary key, auto-generated, non-updatable)
    - `firstName` (String, length 100, not null)
    - `lastName` (String, length 100, not null)
    - `labels` (List of [ContactLabel](ContactLabel.java), enum collection, not null, eager fetch, stored in contact_labels table)
    - `email` (String, length 100, not null, unique)
    - `phone` (String, length 30, optional)
    - `address` ([ContactAddress](ContactAddress.java), not null, one-to-one, cascade all, eager fetch, foreign key: address_id)
- **Relationships:**
    - One-to-one with [ContactAddress](ContactAddress.java) (contact address, cascade all, eager fetch)
    - Has a collection of [ContactLabel](ContactLabel.java) (enum) for categorization stored in separate table `contact_labels`
- **Unique Constraints:**
    - `uk_contacts_email` on email column
    - `uk_contacts_address_id` on address_id column
- **Foreign Keys:**
    - `fk_contacts_address` references address_id
    - `fk_contact_labels_contact` in contact_labels table references contact_id

### [ContactAddress](ContactAddress.java)

- **Purpose:** Represents a physical address for a contact.
- **Table:** `contact_addresses`
- **Fields:**
    - `id` (UUID, primary key, auto-generated, non-updatable)
    - Inherits all address fields from [BaseAddress](../base/BaseAddress.java): `unitNumber`, `streetNumber`, `streetName`, `city`, `stateOrProvince`, `postalOrZipCode`, `country`
- **Inheritance:** Extends [BaseAddress](../base/BaseAddress.java) using `@SuperBuilder`

### [ContactLabel](ContactLabel.java)

- **Purpose:** Enum for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER, BUILDER, SUBCONTRACTOR, PERMIT_AUTHORITY, OTHER).
- **Usage:** Used as a collection in [Contact](Contact.java), stored as strings in the `contact_labels` table.
- **Storage:** Element collection with eager fetch, mapped to separate table with foreign key constraint

## Repositories

- [UserRepository](UserRepository.java): JPA repository for `User` entity with custom queries for email and username lookup
- [ContactRepository](ContactRepository.java): JPA repository for `Contact` entity with email-based queries
- [ContactAddressRepository](ContactAddressRepository.java): JPA repository for `ContactAddress` entity

## Relationships Diagram

- [User](User.java) 1---1 [Contact](Contact.java) 1---1 [ContactAddress](ContactAddress.java)
- [Contact](Contact.java) 1---* [ContactLabel](ContactLabel.java) (enum collection in separate table)
- [User](User.java) 1---* [Project](../project/Project.java) (builtProjects, ownedProjects)
- [User](User.java) 1---* [Quote](../quote/Quote.java) (createdQuotes, suppliedQuotes)

## Entity Lifecycle & Business Rules

- When a new [User](User.java) is created, a [Contact](Contact.java) must be associated. The `contact` field in `User` is never null. The association does not cascade - contacts are managed independently.
- When a new [Contact](Contact.java) is created, a [ContactAddress](ContactAddress.java) is also created and associated. The `address` field in `Contact` is never null and cascades all operations (save, update, delete).
- All entity IDs are auto-generated UUIDs that cannot be updated after creation.
- Email addresses must be unique across all users and contacts.
- Usernames must be unique across all users.
- Contact addresses are uniquely associated with contacts (one-to-one constraint).
- Contact labels are stored in a separate join table for normalization and better query performance.

## Database Schema Notes

- **Table Names:** Uses plural form (users, contacts, contact_addresses, contact_labels)
- **Foreign Key Naming:** Follows pattern `fk_{table}_{referenced_table}` 
- **Unique Constraint Naming:** Follows pattern `uk_{table}_{column}`
- **Column Lengths:** String fields have explicit length constraints for database optimization
- **Cascade Behavior:** Only Contact → ContactAddress relationship uses cascade operations
