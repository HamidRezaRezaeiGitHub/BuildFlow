# Quote Model Package Overview

This package defines the core entities and repositories for managing supplier quotes in BuildFlow. It supports quote
creation, supplier and creator tracking, work item association, and location management.

## Entities

### [Quote](Quote.java)

- Represents a supplier quote for a work item.
- Fields:
    - `id` (UUID, primary key)
    - `workItem` ([WorkItem](../workitem/WorkItem.java), many-to-one, not null)
    - `createdBy` ([User](../user/User.java), many-to-one, not null, bidirectional)
    - `supplier` ([User](../user/User.java), many-to-one, not null, bidirectional)
    - `unit` ([QuoteUnit](QuoteUnit.java), enum, not null)
    - `unitPrice` (BigDecimal, not null)
    - `currency` (Currency, not null)
    - `domain` ([QuoteDomain](QuoteDomain.java), enum, not null)
    - `location` ([QuoteLocation](QuoteLocation.java), many-to-one, not null, cascade all)
    - `valid` (boolean, not null)
- Relationships:
    - Many-to-one with WorkItem (FK: work_item_id in quotes)
    - Many-to-one with User (createdBy, FK: created_by_id in quotes, bidirectional)
    - Many-to-one with User (supplier, FK: supplier_id in quotes, bidirectional)
    - Many-to-one with QuoteLocation (FK: location_id in quotes, cascade all)

### [QuoteLocation](QuoteLocation.java)

- Represents the address/location for a quote.
- Fields:
    - `id` (UUID, primary key)
    - Inherits address fields from [BaseAddress](../base/BaseAddress.java)
- Relationships:
    - Referenced by Quote entities (FK: location_id in quotes)

## Enums

- [QuoteUnit](QuoteUnit.java): Specifies the unit for the quote (e.g., SQFT, LUMP_SUM).
- [QuoteDomain](QuoteDomain.java): Specifies the domain of the quote (e.g., PUBLIC, PRIVATE).

## Repositories

- [QuoteRepository](QuoteRepository.java): JPA repository for Quote entity.
- [QuoteLocationRepository](QuoteLocationRepository.java): JPA repository for QuoteLocation entity.

## Relationships Diagram

- [Quote](Quote.java) *---1 [WorkItem](../estimate/WorkItem.java)
- [Quote](Quote.java) *---1 [User](../../user/User.java) (createdBy, supplier, bidirectional)
- [Quote](Quote.java) *---1 [QuoteLocation](QuoteLocation.java)
- [User](../../user/User.java) 1---* [Quote](Quote.java) (createdQuotes, suppliedQuotes)

## Entity Lifecycle & User Stories

- When a new [Quote](Quote.java) is created, it must be associated with a work item, a creator, a supplier, and a
  location.
- Each quote must specify its unit, price, currency, domain, and validity.
- Locations can be reused across multiple quotes.
- Users can navigate to their created and supplied quotes (bidirectional).
