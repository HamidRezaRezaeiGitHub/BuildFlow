# BuildFlow Application

This is the root package of the BuildFlow application - a comprehensive full-stack construction project management platform. BuildFlow provides an integrated solution for managing construction projects, estimates, quotes, work items, and user relationships through a modern Spring Boot backend with React frontend.

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