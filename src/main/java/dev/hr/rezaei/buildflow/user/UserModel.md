# User Model Package Overview

This package contains the core user-related entities and their repositories for the BuildFlow application. Below is a
summary of each entity and their relationships:

## Entities

### [User](User.java)

- **Purpose:** Represents an application user.
- **Fields:**
    - `id` (UUID, primary key)
    - `username` (String, not null, unique)
    - `email` (String, not null, unique)
    - `registered` (boolean, not null)
    - `contact` ([Contact](Contact.java), not null, one-to-one, eager fetch)
    - `builtProjects` (List of [Project](../project/Project.java), one-to-many, mapped by builderUser)
    - `ownedProjects` (List of [Project](../project/Project.java), one-to-many, mapped by owner)
    - `createdQuotes` (List of [Quote](../quote/Quote.java), one-to-many, mapped by createdBy)
    - `suppliedQuotes` (List of [Quote](../quote/Quote.java), one-to-many, mapped by supplier)
- **Relationships:**
    - One-to-one with [Contact](Contact.java) (each user has a contact profile, eager fetch, no cascade)
    - Bidirectional one-to-many with [Project](../project/Project.java) as builder (user.builtProjects,
      project.builderUser)
    - Bidirectional one-to-many with [Project](../project/Project.java) as owner (user.ownedProjects, project.owner)
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as creator (user.createdQuotes, quote.createdBy)
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as supplier (user.suppliedQuotes, quote.supplier)

### [Contact](Contact.java)

- **Purpose:** Represents a user's contact profile.
- **Fields:**
    - `id` (UUID, primary key)
    - `firstName` (String, not null)
    - `lastName` (String, not null)
    - `labels` (List of [ContactLabel](ContactLabel.java), enum collection, not null)
    - `email` (String, not null, unique)
    - `phone` (String)
    - `address` ([ContactAddress](ContactAddress.java), not null, one-to-one, cascade all, eager fetch)
- **Relationships:**
    - One-to-one with [ContactAddress](ContactAddress.java) (contact address, cascade all, eager fetch)
    - Has a list of [ContactLabel](ContactLabel.java) (enum) for categorization (e.g., SUPPLIER, OWNER, BUILDER, etc.)

### [ContactAddress](ContactAddress.java)

- **Purpose:** Represents a physical address for a contact.
- **Fields:**
    - `id` (UUID, primary key)
    - Inherits all address fields from [BaseAddress](../base/BaseAddress.java): `unitNumber`, `streetNumber`,
      `streetName`, `city`, `stateOrProvince`, `postalOrZipCode`, `country`

### [ContactLabel](ContactLabel.java)

- **Purpose:** Enum for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER, BUILDER, SUBCONTRACTOR, PERMIT_AUTHORITY,
  OTHER).
- **Usage:** Used as a collection in [Contact](Contact.java).

## Repositories

- [UserRepository](UserRepository.java): JPA repository for `User` entity.
- [ContactRepository](ContactRepository.java): JPA repository for `Contact` entity.
- [ContactAddressRepository](ContactAddressRepository.java): JPA repository for `ContactAddress` entity.

## Relationships Diagram

- [User](User.java) 1---1 [Contact](Contact.java) 1---1 [ContactAddress](ContactAddress.java)
- [Contact](Contact.java) 1---* [ContactLabel](ContactLabel.java) (enum collection)
- [User](User.java) 1---* [Project](../project/Project.java) (builtProjects, ownedProjects)
- [User](User.java) 1---* [Quote](../quote/Quote.java) (createdQuotes, suppliedQuotes)

## Entity Lifecycle & User Stories

- When a new [User](User.java) is created, a [Contact](Contact.java) is also created and associated. The `contact`
  field in `User` is never null. The association does not cascade.
- When a new [Contact](Contact.java) is created, a [ContactAddress](ContactAddress.java) is also created and
  associated. The `address` field in `Contact` is never null and cascades all operations.
