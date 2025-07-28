# User Model Package Overview

This package contains the core user-related entities and their repositories for the BuildFlow application. Below is a
summary of each entity and their relationships:

## Entities

### [User](./User.java)

- Represents an application user.
- Fields: `id` (UUID, primary key), `username`, `email`, `registered` (boolean, not null), `contact` (not null,
  one-to-one, no cascade).
- Relationships:
    - One-to-one with [Contact](./Contact.java) (each user has a contact profile, **no cascade**).
    - Bidirectional one-to-many with [Project](../project/Project.java) as builder (user.builtProjects,
      project.builder).
    - Bidirectional one-to-many with [Project](../project/Project.java) as owner (user.ownedProjects, project.owner).
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as creator (user.createdQuotes, quote.createdBy).
    - Bidirectional one-to-many with [Quote](../quote/Quote.java) as supplier (user.suppliedQuotes, quote.supplier).

### [Contact](./Contact.java)

- Represents a user's contact profile.
- Fields: `id` (UUID, primary key), `firstName`, `lastName`, `labels` (List of [ContactLabel](./ContactLabel.java), enum
  collection), `email`, `phone`, `address` (not null, one-to-one, cascade all).
- Relationships:
    - One-to-one with [Address](./ContactAddress.java) (contact address, cascade all).
    - Has a list of [ContactLabel](./ContactLabel.java) (enum) for categorization (e.g., SUPPLIER, OWNER).

### [Address (ContactAddress)](./ContactAddress.java)

- Represents a physical address for a contact.
- Fields: `id` (UUID, primary key), `unitNumber`, `streetNumber`, `streetName`, `city`, `stateOrProvince`,
  `postalOrZipCode`, `country`.

### [ContactLabel](./ContactLabel.java)

- Enum for categorizing contacts (e.g., SUPPLIER, OWNER, LENDER).
- Used as a collection in [Contact](./Contact.java).

## Repositories

- [UserRepository](./UserRepository.java): JPA repository for `User` entity.
- [ContactRepository](./ContactRepository.java): JPA repository for `Contact` entity.
- [ContactAddressRepository](./ContactAddressRepository.java): JPA repository for `Address` entity.

## Relationships Diagram

- [User](./User.java) 1---1 [Contact](./Contact.java) 1---1 [Address](./ContactAddress.java)
- [Contact](./Contact.java) 1---* [ContactLabel](./ContactLabel.java) (enum collection)

## Entity Lifecycle & User Stories

- When a new [User](./User.java) is created, a [Contact](./Contact.java) is also created and associated. The `contact`
  field in `User` is never null. The association does not cascade.
- When a new [Contact](./Contact.java) is created, a [ContactAddress](./ContactAddress.java) is also created and
  associated. The `address` field in `Contact` is never null and cascades all operations.
