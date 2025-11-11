# Quote Management Package

This package provides comprehensive supplier quote management functionality for BuildFlow. It enables tracking of supplier quotes for work items, including pricing, location, and domain-specific categorization for construction project procurement.

## Summary

This package manages supplier quotes for construction work items with pricing details, location information, domain classification, and supplier tracking for procurement workflows.

## Files Structure

```
quote/
├── Quote.java                         # Main quote entity for supplier pricing
├── QuoteController.java               # REST API controller for quote management
├── QuoteDto.java                      # DTO for quote API operations
├── QuoteDtoMapper.java                # MapStruct mapper for Quote conversions
├── QuoteDomain.java                   # Domain classification enum (PUBLIC/PRIVATE)
├── QuoteLocation.java                 # Location/address entity specific to quotes
├── QuoteLocationDto.java              # DTO for quote location operations
├── QuoteLocationDtoMapper.java        # MapStruct mapper for QuoteLocation conversions
├── QuoteLocationRepository.java       # JPA repository for quote locations
├── QuoteLocationService.java          # Business logic for quote locations
├── QuoteRepository.java               # JPA repository for quotes
├── QuoteService.java                  # Business logic for quote operations
├── QuoteUnit.java                     # Unit of measurement enum for pricing
└── README.md                          # This file
```

## Package Contents

### Entity Classes

| File | Description |
|------|-------------|
| [Quote.java](Quote.java) | Main quote entity for supplier pricing and work item associations |
| [QuoteLocation.java](QuoteLocation.java) | Location/address information specific to quotes |

### Controller Classes

| File | Description |
|------|-------------|
| [QuoteController.java](QuoteController.java) | REST API controller for quote management operations |

### DTO Classes

| File | Description |
|------|-------------|
| [QuoteDto.java](QuoteDto.java) | Data transfer object for quote API operations |
| [QuoteLocationDto.java](QuoteLocationDto.java) | Data transfer object for quote location operations |

### Mapper Classes

| File | Description |
|------|-------------|
| [QuoteDtoMapper.java](QuoteDtoMapper.java) | MapStruct mapper for Quote entity-DTO conversions |
| [QuoteLocationDtoMapper.java](QuoteLocationDtoMapper.java) | MapStruct mapper for QuoteLocation entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [QuoteRepository.java](QuoteRepository.java) | Spring Data JPA repository for quote persistence |
| [QuoteLocationRepository.java](QuoteLocationRepository.java) | Spring Data JPA repository for quote location persistence |

### Service Classes

| File | Description |
|------|-------------|
| [QuoteService.java](QuoteService.java) | Business logic for quote management operations |
| [QuoteLocationService.java](QuoteLocationService.java) | Business logic for quote location management |

### Enums

| File | Description |
|------|-------------|
| [QuoteDomain.java](QuoteDomain.java) | Domain classification enum for quote categorization (PUBLIC/PRIVATE) |
| [QuoteUnit.java](QuoteUnit.java) | Unit of measurement enum for quote pricing |

## Technical Overview

### Quote Entity
Core entity representing a supplier quote for construction work items.

**Key Features:**
- **Work Item Association**: Each quote is linked to a specific work item
- **User Relationships** (unidirectional: Quote → User):
  - `createdBy`: User who created the quote (`@ManyToOne(fetch = LAZY)`)
  - `supplier`: Supplier providing the quote (`@ManyToOne(fetch = LAZY)`)
  - **Design Rationale**: Lazy loading prevents unnecessary User hydration; queries/endpoints support reverse lookup
- **Pricing Information**: Detailed pricing with unit and currency support
- **Location Integration**: Includes location-specific information
- **Domain Classification**: Categorizes quotes by public/private domains
- **Validity Tracking**: Manages quote validity status

**Structure:**
- `id` (UUID): Primary key
- `workItem` (WorkItem): Associated work item (many-to-one relationship)
- `createdBy` (User): User who created the quote (many-to-one relationship)
- `supplier` (User): Supplier providing the quote (many-to-one relationship)
- `unit` (QuoteUnit): Unit of measurement for pricing
- `unitPrice` (BigDecimal): Price per unit
- `currency` (Currency): Currency for pricing
- `domain` (QuoteDomain): Classification domain (PUBLIC/PRIVATE)
- `location` (QuoteLocation): Quote location information (many-to-one with cascade)
- `valid` (boolean): Quote validity status

**Relationships:**
- **WorkItem**: Many quotes can reference one work item
- **Users** (unidirectional: Quote → User):
  - `createdBy`: References User with LAZY fetch (prevents N+1 queries)
  - `supplier`: References User with LAZY fetch (prevents N+1 queries)
  - **Note**: Users do NOT store quote collections; use repository queries or API endpoints to list quotes by user
- **Location**: Each quote has one location with cascade operations

**Querying Quotes by User:**
- Repository methods: `QuoteRepository.findByCreatedById(UUID, Pageable)`, `QuoteRepository.findBySupplierId(UUID, Pageable)`
- REST API endpoints:
  - `GET /api/v1/quotes?createdById={userId}` - List quotes created by user (paginated)
  - `GET /api/v1/quotes?supplierId={userId}` - List quotes supplied by user (paginated)
  - `GET /api/v1/quotes/count/{userId}` - Get counts: `{createdCount: N, suppliedCount: M}`

### QuoteLocation Entity
Address/location information specific to quotes, extending the base address structure.

**Key Features:**
- **Address Inheritance**: Extends BaseAddress for consistent address handling
- **Quote Integration**: Dedicated location entity for quote-specific addresses
- **Cascade Operations**: Managed through quote entity lifecycle
- **Geographic Information**: Supports full address details for quote context

**Structure:**
- `id` (UUID): Primary key
- Inherits all address fields from BaseAddress:
  - `unitNumber`, `streetNumber`, `streetName`
  - `city`, `stateOrProvince`, `postalOrZipCode`, `country`

### QuoteDomain Enum
Classification system for quote categorization.

**Values:**
- **PUBLIC**: Quotes for public sector projects
- **PRIVATE**: Quotes for private sector projects

**Usage:**
- Project type classification
- Reporting and filtering
- Compliance and regulatory requirements
- Business intelligence and analytics

### QuoteUnit Enum
Comprehensive unit of measurement system for quote pricing.

**Measurement Categories:**

**Area Measurements:**
- `SQUARE_METER` ("m²"): Square meters
- `SQUARE_FOOT` ("ft²"): Square feet

**Volume Measurements:**
- `CUBIC_METER` ("m³"): Cubic meters
- `CUBIC_FOOT` ("ft³"): Cubic feet

**Linear Measurements:**
- `METER` ("m"): Meters
- `FOOT` ("ft"): Feet

**Quantity Measurements:**
- `EACH` ("each"): Individual items

**Weight Measurements:**
- `KILOGRAM` ("kg"): Kilograms
- `TON` ("ton"): Tons

**Volume (Liquid) Measurements:**
- `LITER` ("L"): Liters
- `MILLILITER` ("mL"): Milliliters

**Time Measurements:**
- `HOUR` ("hr"): Hours
- `DAY` ("day"): Days

## Business Logic

### Quote Management
- **Supplier Relations**: Manages relationships with multiple suppliers
- **Price Comparison**: Enables comparison of quotes for the same work item
- **Validity Management**: Tracks quote expiration and validity
- **Geographic Context**: Location-specific pricing considerations

### Pricing Strategy
- **Unit-Based Pricing**: Flexible unit system for various construction measurements
- **Currency Support**: Multi-currency support for international suppliers
- **Price History**: Maintains historical pricing data for analysis
- **Cost Estimation**: Feeds into project cost estimation processes

### Domain-Based Organization
- **Public Sector**: Special handling for government and public works projects
- **Private Sector**: Commercial and residential project support
- **Compliance**: Domain-specific regulatory and compliance considerations
- **Reporting**: Domain-based analytics and reporting capabilities

## Data Flow Patterns

### Quote Creation Workflow
```
1. Select work item for quote request
2. Identify supplier and create quote
3. Set pricing information:
   ├── Unit type and price
   ├── Currency specification
   └── Domain classification
4. Add location information
5. Set validity status
6. Save quote with full audit trail
```

### Quote Comparison Process
```
1. Retrieve all quotes for work item
2. Group by domain (PUBLIC/PRIVATE)
3. Compare pricing across suppliers
4. Analyze unit consistency
5. Generate comparison reports
6. Support decision-making process
```

## Integration Points

This package integrates with:
- **WorkItem Package**: Quotes are created for specific work items
- **User Package**: Integration with user management for creators and suppliers
- **Estimate Package**: Quote data feeds into project cost estimation
- **Project Package**: Location data relates to project addresses
- **Base Package**: Inherits audit functionality and address handling

## Relationship Patterns

### Entity Relationships
```
Quote
├── WorkItem (many-to-one): Multiple quotes per work item
├── User (createdBy, many-to-one): Quote creator tracking
├── User (supplier, many-to-one): Supplier relationship
└── QuoteLocation (many-to-one, cascade): Location information

QuoteLocation
└── BaseAddress (inheritance): Consistent address structure
```

### Business Relationships
```
Supplier Management:
- Users can be both creators and suppliers
- Bidirectional relationships for comprehensive tracking
- Supplier performance analytics through quote history

Work Item Integration:
- Multiple quotes per work item for competitive pricing
- Quote data influences work item cost calculations
- Historical pricing supports future estimates
```

## Repository and Service Architecture

### Repository Layer
- **Standard CRUD**: Basic create, read, update, delete operations
- **Custom Queries**: Business-specific queries for quote analysis
- **Performance Optimization**: Lazy loading and optimized fetching
- **Relationship Management**: Proper cascade and orphan removal

### Service Layer
- **QuoteService**: Main quote operations and business logic
- **QuoteLocationService**: Location-specific operations
- **Transaction Management**: Ensures data consistency
- **Business Rules**: Enforces quote validation and integrity

## Design Principles

- **Supplier-Centric**: Designed around supplier relationship management
- **Measurement Flexibility**: Comprehensive unit system for diverse construction needs
- **Geographic Awareness**: Location-specific quote handling
- **Domain Separation**: Clear distinction between public and private sector work
- **Price History**: Maintains comprehensive pricing history for analysis
- **Integration Ready**: Designed to integrate with estimation and project management workflows