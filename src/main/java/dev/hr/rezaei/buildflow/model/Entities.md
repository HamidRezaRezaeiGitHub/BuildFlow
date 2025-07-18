# Entity Classes Summary

Below is a summary of all available entity classes in the `model` package:

---

## [Address](address/Address.java)

Represents a physical address.

- JPA: `@Entity`, `@Table(name = "addresses")`
- Fields:
    - `id` (`UUID`): `@Id`, `@GeneratedValue`, `@Column(nullable = false, updatable = false)` (primary key,
      auto-generated, not nullable, not updatable)
    - `unitNumber` (`String`): `@Column(length = 20)`
    - `streetNumber` (`String`): `@Column(length = 20)`
    - `streetName` (`String`): `@Column(length = 200)`
    - `city` (`String`): `@Column(length = 100, nullable = false)`
    - `stateOrProvince` (`String`): `@Column(length = 100, nullable = false)`
    - `postalCode` (`String`): `@Column(length = 20, nullable = false)`
    - `country` (`String`): `@Column(length = 100, nullable = false)`

## [Contact](contact/Contact.java)

Represents a contact person or organization.

- JPA: `@Entity`, `@Table(name = "contacts")`
- Fields:
    - `id` (`UUID`): `@Id`, `@GeneratedValue`, `@Column(nullable = false, updatable = false)` (primary key,
      auto-generated, not nullable, not updatable)
    - `firstName` (`String`): `@Column(length = 100, nullable = false)`
    - `lastName` (`String`): `@Column(length = 100, nullable = false)`
    - `name` (`String`): `@Column(length = 100, nullable = false)`
    - `labels` (`List<ContactLabel>`): `@ElementCollection(targetClass = ContactLabel.class)`,
      `@Enumerated(EnumType.STRING)`, `@Column(name = "label", length = 50)` (collection of enums stored as strings)
    - `email` (`String`): `@Column(length = 100, nullable = true)`
    - `phone` (`String`): `@Column(length = 30, nullable = true)`
    - `notes` (`String`): `@Column(length = 255, nullable = true)`
    - `address` (`Address`): `@OneToOne`, `@JoinColumn(name = "address_id")` (one-way relationship, foreign key)

## [ContactLabel](contact/ContactLabel.java)

Enum for contact labels:

- `SUPPLIER`, `SUBCONTRACTOR`, `LENDER`, `PERMIT_AUTHORITY`, `OTHER`, `BUILDER`, `OWNER`

## [Group](group/Group.java)

Represents a group of users and work items.

- `UUID id`
- `String name`
- `String description`
- `User owner`
- `List<WorkItem> workItems`

## [Quote](quote/Quote.java)

Represents a quote for a work item.

- `UUID id`
- `WorkItem workItem`
- `LocalDate quoteDate`
- `String supplierName`
- `String supplierContact`
- `BigDecimal unitPrice`
- `double squareFootage`
- `Address address`
- `Currency currency`

## [User](user/User.java)

Represents a user of the application.

- `UUID id`
- `String username`
- `String email`
- `Contact contact`

## [CostType](workitem/CostType.java)

Enum for cost types:

- `PER_SQFT`, `LUMP_SUM`

## [WorkItem](workitem/WorkItem.java)

Represents a work item in a project.

- `UUID id`
- `String code`
- `String name`
- `CostType costType`
- `boolean optional`
- `User owner`
- `List<Group> groups`

## [EstimateLine](estimate/EstimateLine.java)

Represents a line item in an estimate.

- `UUID id`
- `Estimate estimate`
- `WorkItem workItem`
- `double quantity`
- `QuoteStrategy quoteStrategy`
- `double multiplier`
- `BigDecimal computedCost`

## [Estimate](estimate/Estimate.java)

Represents an estimate for a project.

- `UUID id`
- `Project project`
- `LocalDate creationDate`
- `List<EstimateLine> estimateLines`

## [QuoteStrategy](estimate/QuoteStrategy.java)

Enum for quote selection strategy:

- `AVERAGE`, `LATEST`

## [Project](project/Project.java)

Represents a construction project.

- `UUID id`
- `User createdBy`
- `User builder`
- `Contact owner`
- `Address address`
- `List<Estimate> estimates`

---

Each class is linked for quick access to its source file.
