# BuildFlow Application

This is the root package of the BuildFlow application - a comprehensive full-stack construction project management platform. BuildFlow provides an integrated solution for managing construction projects, estimates, quotes, work items, and user relationships through a modern Spring Boot backend with React frontend.

## Summary

BuildFlow is the complete backend application package providing construction project management capabilities with hierarchical domain organization, comprehensive security, and full-stack integration support.

## Files Structure

```
buildflow/
├── base/
│   ├── BaseAddress.java                  # Abstract entity for address fields
│   ├── BaseAddressDto.java               # Abstract DTO for address fields
│   ├── DuplicateUserException.java       # Exception for duplicate user attempts
│   ├── UpdatableEntity.java              # Abstract entity with audit fields
│   ├── UpdatableEntityDto.java           # Abstract DTO with audit fields
│   ├── UpdatableEntityDtoMapper.java     # Base mapper for entity-DTO conversions
│   ├── UserNotAuthorizedException.java   # Exception for authorization failures
│   ├── UserNotFoundException.java        # Exception for user lookup failures
│   └── README.md                         # Base package documentation
├── config/
│   ├── mvc/
│   │   ├── dto/
│   │   │   ├── ErrorResponse.java                 # Unified error response
│   │   │   ├── MessageResponse.java               # Success message response
│   │   │   └── README.md                          # MVC DTO documentation
│   │   ├── AbstractAuthorizationHandler.java      # Base authorization handler
│   │   ├── GlobalExceptionHandler.java            # Centralized exception handling
│   │   ├── OpenApiConfig.java                     # API documentation config
│   │   ├── PagedResponseBuilder.java              # Paginated response builder
│   │   ├── PaginationHelper.java                  # Pagination helper utility
│   │   ├── README.md                              # MVC package documentation
│   │   ├── ResponseErrorType.java                 # Error type categorization
│   │   ├── ResponseFacilitator.java               # Response formatting utility
│   │   ├── SpaPathResourceResolver.java           # SPA routing resolver
│   │   └── WebMvcConfig.java                      # Central MVC configuration
│   ├── security/
│   │   ├── dto/
│   │   │   ├── JwtAuthenticationResponse.java     # JWT token response
│   │   │   ├── LoginRequest.java                  # Login request DTO
│   │   │   ├── SignUpRequest.java                 # Registration request DTO
│   │   │   ├── UserAuthenticationDto.java         # Secure user auth DTO
│   │   │   ├── UserSummaryResponse.java           # User summary response
│   │   │   └── README.md                          # Security DTO documentation
│   │   ├── AdminUserInitializer.java              # Admin user bootstrap
│   │   ├── AuthController.java                    # Authentication endpoints
│   │   ├── AuthService.java                       # Authentication service
│   │   ├── CustomUserDetailsService.java          # User details service
│   │   ├── JwtAuthenticationFilter.java           # JWT filter
│   │   ├── JwtTokenProvider.java                  # JWT provider
│   │   ├── MockDataInitializer.java               # Mock data generator
│   │   ├── README.md                              # Security package documentation
│   │   ├── RateLimitingFilter.java                # Rate limiting filter
│   │   ├── Role.java                              # Role enum
│   │   ├── SecurityAuditService.java              # Audit service
│   │   ├── SecurityConfig.java                    # Security configuration
│   │   ├── SecurityController.java                # Security test endpoints
│   │   ├── SecurityExceptionHandler.java          # Security exception handler
│   │   ├── UserAuthentication.java                # Authentication entity
│   │   ├── UserAuthenticationRepository.java      # Authentication repository
│   │   └── UserPrincipal.java                     # User principal
│   └── README.md                                  # Config package documentation
├── dto/
│   ├── Dto.java                          # Marker interface for all DTOs
│   ├── DtoMappingException.java          # Exception for DTO mapping failures
│   └── README.md                         # Core DTO documentation
├── estimate/
│   ├── Estimate.java                      # Main estimate entity
│   ├── EstimateDto.java                   # DTO for estimate operations
│   ├── EstimateDtoMapper.java             # MapStruct mapper for Estimate
│   ├── EstimateGroup.java                 # Group entity for line items
│   ├── EstimateGroupDto.java              # DTO for estimate group
│   ├── EstimateGroupDtoMapper.java        # MapStruct mapper for EstimateGroup
│   ├── EstimateGroupRepository.java       # JPA repository for groups
│   ├── EstimateGroupService.java          # Business logic for groups
│   ├── EstimateLine.java                  # Line item entity
│   ├── EstimateLineDto.java               # DTO for estimate line
│   ├── EstimateLineDtoMapper.java         # MapStruct mapper for EstimateLine
│   ├── EstimateLineRepository.java        # JPA repository for lines
│   ├── EstimateLineService.java           # Business logic for lines
│   ├── EstimateLineStrategy.java          # Strategy enum for calculations
│   ├── EstimateRepository.java            # JPA repository for estimates
│   ├── EstimateService.java               # Business logic for estimates
│   └── README.md                          # Estimate package documentation
├── project/
│   ├── dto/
│   │   ├── CreateProjectRequest.java          # Request for creating projects
│   │   ├── CreateProjectResponse.java         # Response with created project
│   │   ├── ProjectLocationRequestDto.java     # Location info for creation
│   │   └── README.md                          # Project DTO documentation
│   ├── Project.java                           # Core project entity
│   ├── ProjectAuthService.java                # Authorization service
│   ├── ProjectController.java                 # REST API controller
│   ├── ProjectDto.java                        # DTO for project operations
│   ├── ProjectDtoMapper.java                  # MapStruct mapper for Project
│   ├── ProjectLocation.java                   # Location entity
│   ├── ProjectLocationDto.java                # DTO for location
│   ├── ProjectLocationDtoMapper.java          # MapStruct mapper for Location
│   ├── ProjectLocationRepository.java         # JPA repository for locations
│   ├── ProjectLocationService.java            # Business logic for locations
│   ├── ProjectRepository.java                 # JPA repository for projects
│   ├── ProjectService.java                    # Business logic for projects
│   └── README.md                              # Project package documentation
├── quote/
│   ├── Quote.java                         # Main quote entity
│   ├── QuoteDto.java                      # DTO for quote operations
│   ├── QuoteDtoMapper.java                # MapStruct mapper for Quote
│   ├── QuoteDomain.java                   # Domain classification enum
│   ├── QuoteLocation.java                 # Location entity for quotes
│   ├── QuoteLocationDto.java              # DTO for quote location
│   ├── QuoteLocationDtoMapper.java        # MapStruct mapper for QuoteLocation
│   ├── QuoteLocationRepository.java       # JPA repository for locations
│   ├── QuoteLocationService.java          # Business logic for locations
│   ├── QuoteRepository.java               # JPA repository for quotes
│   ├── QuoteService.java                  # Business logic for quotes
│   ├── QuoteUnit.java                     # Unit of measurement enum
│   └── README.md                          # Quote package documentation
├── user/
│   ├── dto/
│   │   ├── ContactAddressRequestDto.java      # Address info for creation
│   │   ├── ContactRequestDto.java             # Contact info for creation
│   │   ├── CreateUserRequest.java             # Request for creating users
│   │   ├── CreateUserResponse.java            # Response with created user
│   │   └── README.md                          # User DTO documentation
│   ├── Contact.java                           # Contact information entity
│   ├── ContactAddress.java                    # Address entity for contacts
│   ├── ContactAddressDto.java                 # DTO for contact address
│   ├── ContactAddressDtoMapper.java           # MapStruct mapper for ContactAddress
│   ├── ContactAddressRepository.java          # JPA repository for addresses
│   ├── ContactAddressService.java             # Business logic for addresses
│   ├── ContactDto.java                        # DTO for contact operations
│   ├── ContactDtoMapper.java                  # MapStruct mapper for Contact
│   ├── ContactLabel.java                      # Contact role/type enum
│   ├── ContactRepository.java                 # JPA repository for contacts
│   ├── ContactService.java                    # Business logic for contacts
│   ├── User.java                              # Core user entity
│   ├── UserController.java                    # REST API controller
│   ├── UserDto.java                           # DTO for user operations
│   ├── UserDtoMapper.java                     # MapStruct mapper for User
│   ├── UserRepository.java                    # JPA repository for users
│   ├── UserService.java                       # Business logic for users
│   └── README.md                              # User package documentation
├── util/
│   ├── EnumUtil.java                     # Enum conversion utilities
│   ├── StringUtil.java                   # String manipulation utilities
│   └── README.md                         # Util package documentation
├── workitem/
│   ├── dto/
│   │   ├── CreateWorkItemRequest.java         # Request for creating work items
│   │   ├── CreateWorkItemResponse.java        # Response with created work item
│   │   └── README.md                          # Work item DTO documentation
│   ├── WorkItem.java                          # Core work item entity
│   ├── WorkItemController.java                # REST API controller
│   ├── WorkItemDomain.java                    # Domain classification enum
│   ├── WorkItemDto.java                       # DTO for work item operations
│   ├── WorkItemDtoMapper.java                 # MapStruct mapper for WorkItem
│   ├── WorkItemRepository.java                # JPA repository for work items
│   ├── WorkItemService.java                   # Business logic for work items
│   └── README.md                              # Work item package documentation
├── BuildFlowApplication.java             # Main Spring Boot application
└── README.md                             # This file
```

## Subfolder References

### [base/](base/) - Foundation Package
Base classes, DTOs, exceptions providing foundational infrastructure for all domain packages including audit trails, address handling, and common exception types.

### [config/](config/) - Configuration Package
Application configuration with MVC and Security sub-packages providing web layer setup, SPA integration, JWT authentication, and role-based access control.

### [dto/](dto/) - Core DTO Package
Core DTO interfaces and exceptions providing the foundational DTO framework that all domain DTOs build upon.

### [util/](util/) - Utility Package
Utility functions for enum processing, string manipulation, validation, and data sanitization used throughout all packages.

### [user/](user/) - User Management Package
User, contact, and address management with comprehensive CRUD operations, flexible contact labeling, and REST endpoints for user administration.

### [project/](project/) - Project Management Package
Construction project management with builder/owner assignments, location tracking, authorization controls, and paginated endpoints.

### [workitem/](workitem/) - Work Item Management Package
Work item management with detailed task breakdown, user assignments, domain classification, and REST endpoints.

### [estimate/](estimate/) - Estimate Management Package
Hierarchical cost estimation with multi-level organization (Estimate → EstimateGroup → EstimateLine) and various calculation strategies.

### [quote/](quote/) - Quote Management Package
Supplier quote management with pricing details, location information, domain classification, and supplier tracking.

## Application Structure

### Main Application

| File | Description |
|------|-------------|
| [BuildFlowApplication.java](BuildFlowApplication.java) | Main Spring Boot application entry point |

### Core Packages

| Directory | Description |
|-----------|-------------|
| [base/](base/) | Foundation classes, base entities, DTOs, exceptions, and common utilities |
| [config/](config/) | Application configuration including MVC setup and security infrastructure |
| [dto/](dto/) | Core DTO interfaces and mapping exception handling |
| [util/](util/) | Utility classes for enum processing and string operations |

### Domain Packages

| Directory | Description |
|-----------|-------------|
| [user/](user/) | User management, contacts, and address information |
| [project/](project/) | Project management with builder/owner assignments and location data |
| [workitem/](workitem/) | Work item management with domain classification and user assignments |
| [estimate/](estimate/) | Hierarchical cost estimation system (estimates → groups → line items) |
| [quote/](quote/) | Supplier quote management with pricing and location information |

## Technical Architecture

### Application Overview
BuildFlow is designed as a comprehensive construction management platform that integrates:

- **User Management**: Complete user profiles with contact information and role-based access
- **Project Lifecycle**: Full project management from creation to completion
- **Cost Estimation**: Detailed hierarchical estimation with grouping and strategy-based calculations
- **Supplier Integration**: Quote management with supplier relationships and competitive pricing
- **Work Breakdown**: Task-based work item management with domain classification

### Technology Stack

**Backend Framework:**
- **Spring Boot 3.5.3**: Core application framework
- **Java 21**: Programming language and runtime
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data persistence layer
- **H2 Database**: Embedded database for development and deployment

**Frontend Integration:**
- **React 18.3.1**: Single Page Application frontend
- **TypeScript**: Type-safe frontend development
- **Vite 5.4.0**: Modern build tooling
- **Tailwind CSS v4**: Utility-first CSS framework

**Development Tools:**
- **Maven**: Dependency management and build automation
- **MapStruct**: Entity-DTO mapping
- **OpenAPI/Swagger**: API documentation
- **JWT**: Stateless authentication tokens

### Domain Model Relationships

#### Core Entity Relationships
```
User (Authentication & Profile)
├── Contact (Personal Information)
│   └── ContactAddress (Address Details)
├── Projects (as Builder or Owner)
├── WorkItems (Assignments)
└── Quotes (Created or Supplied)

Project (Construction Projects)
├── ProjectLocation (Site Address)
├── Estimates (Cost Calculations)
└── User Relationships (Builder/Owner)

Estimate (Cost Planning)
├── EstimateGroups (Organization)
│   └── EstimateLines (Individual Items)
└── WorkItem References (Detailed Specifications)

Quote (Supplier Pricing)
├── QuoteLocation (Supplier Address)
├── WorkItem (Item Being Quoted)
└── User Relationships (Creator/Supplier)

WorkItem (Task Breakdown)
├── User Assignment (Responsibility)
├── EstimateLines (Cost Calculations)
└── Quotes (Supplier Pricing)
```

#### Business Process Flow
```
1. Project Creation:
   User (Builder) → Project → ProjectLocation → Initial Setup

2. Work Breakdown:
   Project → WorkItems → User Assignments → Task Organization

3. Cost Estimation:
   Project → Estimates → EstimateGroups → EstimateLines → WorkItem References

4. Supplier Management:
   WorkItems → Quotes → Supplier Users → Pricing Information

5. Project Execution:
   Estimates → Quote Selection → Work Assignments → Progress Tracking
```

### Security Architecture

#### Authentication System
- **JWT-Based**: Stateless token authentication
- **Role Hierarchy**: VIEWER → USER → PREMIUM_USER → ADMIN
- **Authority-Based**: Granular permissions for specific operations
- **Rate Limiting**: Protection against brute force attacks

#### Authorization Framework
```
Role-Based Permissions:
- VIEWER: Read-only access to public information
- USER: Project CRUD operations, work item management
- PREMIUM_USER: Enhanced features and capabilities
- ADMIN: System administration and user management
```

### API Architecture

#### RESTful Design
- **Resource-Based URLs**: Clear resource identification
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Status Codes**: Appropriate HTTP status code usage
- **Content Negotiation**: JSON request/response format

#### Response Standardization
```
Success Response:
{
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-01T12:00:00Z"
}

Error Response:
{
  "timestamp": "2024-01-01T12:00:00Z",
  "status": "400",
  "message": "Validation failed",
  "errors": ["Field 'name' is required"],
  "path": "/api/projects",
  "method": "POST"
}
```

### Frontend Integration

#### Single Page Application Support
- **Static Asset Serving**: Efficient serving of React build artifacts
- **Client-Side Routing**: SPA routing with fallback to index.html
- **API Integration**: Seamless frontend-backend communication
- **Development Support**: Hot reload and development server integration

#### Build Process
```
1. Frontend Build: npm run build → static assets
2. Maven Package: Includes assets in JAR
3. Spring Boot Serving: WebMvcConfig serves assets
4. SPA Routing: Custom resolver handles client routes
```

## Package Documentation Structure

Each package contains comprehensive documentation:

### Foundation Packages
- **[base/](base/)**: Core infrastructure including BaseAddress, UpdatableEntity, exceptions
- **[dto/](dto/)**: DTO framework with type-safe interfaces and mapping support
- **[util/](util/)**: Utilities for enum processing and string manipulation
- **[config/](config/)**: Application configuration with MVC and security setup

### Domain Packages
- **[user/](user/)**: Complete user management with contacts and addresses
- **[project/](project/)**: Project lifecycle management with authorization
- **[workitem/](workitem/)**: Work breakdown structure with domain classification
- **[estimate/](estimate/)**: Hierarchical cost estimation with strategy patterns
- **[quote/](quote/)**: Supplier quote management with competitive pricing

### Configuration Packages
- **[config/mvc/](config/mvc/)**: Web configuration, exception handling, SPA support
- **[config/security/](config/security/)**: Security framework with JWT and role-based access

## Business Capabilities

### Project Management
- **Project Creation**: Complete project setup with location and user assignments
- **User Assignment**: Builder and owner role management
- **Location Management**: Geographic information for project sites
- **Authorization**: Role-based access control for project operations

### Cost Management
- **Hierarchical Estimates**: Organized estimate structure with groups and line items
- **Multiple Strategies**: Different calculation approaches (AVERAGE, LATEST, LOWEST)
- **Comparative Analysis**: Multiple estimates per project for cost comparison
- **Multiplier Support**: Global and line-item level cost adjustments

### Supplier Relations
- **Quote Management**: Comprehensive supplier quote tracking
- **Competitive Pricing**: Multiple quotes per work item
- **Location-Aware**: Geographic context for supplier relationships
- **Domain Classification**: Public/private sector quote handling

### Work Organization
- **Task Breakdown**: Detailed work item management
- **User Assignment**: Clear responsibility and ownership tracking
- **Domain Classification**: Public/private sector work categorization
- **Integration**: Seamless integration with estimation and quoting

## Development Features

### Developer Experience
- **Comprehensive Documentation**: Package-level README files with technical details
- **Type Safety**: Strong typing through Java and TypeScript
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Testing Support**: Comprehensive test suite with 294+ tests

### Deployment
- **Single JAR**: Complete application in one deployable artifact
- **Environment Profiles**: Different configurations for dev/uat/production
- **Health Monitoring**: Built-in health checks and metrics
- **Database Migration**: Automatic schema management

### Monitoring and Audit
- **Security Audit**: Comprehensive security event logging
- **Performance Monitoring**: Health checks and metrics endpoints
- **Error Tracking**: Detailed error logging and reporting
- **User Activity**: Complete audit trail of user actions

## Design Principles

- **Domain-Driven Design**: Clear domain boundaries and business logic separation
- **Security First**: Built-in security considerations at every level
- **Full-Stack Integration**: Seamless frontend-backend integration
- **Scalability**: Designed for growth and performance
- **Maintainability**: Clear package structure and comprehensive documentation
- **Extensibility**: Easy addition of new domains and features
- **Standards Compliance**: Following Java, Spring, and web standards

This comprehensive platform provides construction companies with a complete digital solution for project management, cost estimation, supplier relations, and team collaboration.