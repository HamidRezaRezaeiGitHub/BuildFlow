# User Domain Model Overview

This package defines the core user-related entities, their relationships, and persistence rules for the BuildFlow application. The model is designed for strong data integrity, clear separation of concerns, and support for complex business operations.

## Entities & Relationships

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

## Entity Lifecycle & Cascade Rules
- **User creation:** Requires a new Contact (no cascade, must be managed independently).
- **Contact creation:** Requires a new ContactAddress (cascade all, address is managed via Contact).
- **Address save/delete:** Always performed via Contact (never directly).
- **All entity IDs:** Auto-generated UUIDs, immutable after creation.

## Business & Data Integrity Rules
- User email and username must be unique across the system.
- Each user must have associated contact information.
- Contact email addresses must be unique across all contacts.
- Contact addresses are uniquely associated with contacts (one-to-one constraint).
- Contact labels are stored in a separate join table for normalization and query performance.
- Address information cannot have pre-existing IDs during user creation.
- Registration status determines user access level.

## Relationships Diagram

- User 1---1 Contact 1---1 ContactAddress
- Contact 1---* ContactLabel (enum collection in separate table)
- User 1---* Project (builtProjects, ownedProjects)
- User 1---* Quote (createdQuotes, suppliedQuotes)

## Database Schema Notes
- **Table Names:** Plural (users, contacts, contact_addresses, contact_labels)
- **Foreign Key Naming:** `fk_{table}_{referenced_table}`
- **Unique Constraint Naming:** `uk_{table}_{column}`
- **Column Lengths:** Explicit for all String fields
- **Cascade Behavior:** Only Contact → ContactAddress uses cascade operations

This model ensures strong referential integrity, clear separation of user and contact data, and supports complex business operations and queries.
