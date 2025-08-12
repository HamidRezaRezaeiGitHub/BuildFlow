# BuildFlow Backend

A Spring Boot REST API for construction project management with comprehensive estimate and project tracking capabilities.

## 🚀 Quick Start

```bash
# Build the application
./mvnw clean compile

# Run the application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Access the application at http://localhost:8080
# H2 Database Console: http://localhost:8080/h2-console
```

## 📋 Available Maven Commands

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `./mvnw spring-boot:run`   | Start development server with hot reload |
| `./mvnw clean package`     | Build production JAR file               |
| `./mvnw test`              | Run test suite                          |
| `./mvnw clean compile`     | Compile the application                 |

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/dev/hr/rezaei/buildflow/
│   │   ├── BuildFlowApplication.java    # Main Spring Boot application
│   │   ├── base/                        # Base entities and utilities
│   │   ├── config/                      # Configuration classes
│   │   │   └── security/               # Security configuration
│   │   ├── dto/                        # Data Transfer Objects
│   │   ├── estimate/                   # Estimate domain (entities, services, DTOs)
│   │   ├── project/                    # Project domain (entities, services, DTOs)
│   │   ├── quote/                      # Quote domain (entities, services, DTOs)
│   │   ├── user/                       # User domain (entities, services, DTOs)
│   │   ├── util/                       # Utility classes
│   │   └── workitem/                   # Work item domain
│   └── resources/
│       ├── application.yml             # Application configuration
│       └── logback.xml                 # Logging configuration
└── test/                               # Test classes
```

## 🎯 Current Application State

### Technology Stack

- **Framework**: Spring Boot 3.5.3
- **Java Version**: 21
- **Database**: H2 (file-based for development)
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with OAuth2 Client support
- **Build Tool**: Maven 3.x
- **Testing**: Spring Boot Test with JUnit 5
- **Code Generation**: Lombok for boilerplate reduction
- **Monitoring**: Spring Boot Actuator

### Core Domain Models Implemented

1. **Project Management**
   - **Project**: Core project entity with builder relationships
   - **ProjectLocation**: Physical location details for projects
   - Complete CRUD operations with JPA repositories
   - DTO mapping for clean API responses

2. **Estimation System**
   - **Estimate**: Project cost estimates with hierarchical structure
   - **EstimateGroup**: Logical grouping of estimate line items
   - **EstimateLine**: Individual line items with quantities and pricing
   - **EstimateLineStrategy**: Strategy pattern for different estimation approaches
   - Complex relationships supporting detailed cost breakdowns

3. **User Management**
   - **User**: Core user entity with contact information
   - **Contact**: Contact details and communication preferences
   - **ContactAddress**: Address management for users and projects
   - Support for user roles and project assignments

4. **Work Items & Quotes**
   - **WorkItem**: Task and work breakdown structure
   - **Quote**: Client quotations based on estimates
   - **QuoteLocation**: Location-specific quote details

### API & Configuration

- **REST API**: Security controller providing public/private endpoints (`/api/security/*`)
- **Database**: H2 file-based database with web console access
- **Security**: Configurable security (currently disabled for development)
- **Actuator Endpoints**: Health, metrics, info, and monitoring endpoints
- **Logging**: Comprehensive logging with file rotation and archiving

### Development Features

- **Hot Reload**: Spring Boot DevTools integration
- **Database Console**: H2 web console for development debugging
- **Test Coverage**: Comprehensive integration and unit tests for all domains
- **DTO Mapping**: Clean separation between entities and API responses
- **Validation**: Entity validation with JPA constraints

### Current Development Status

- ✅ Complete domain model implementation (Project, Estimate, User, WorkItem, Quote)
- ✅ Spring Data JPA repositories for all entities
- ✅ Service layer with business logic
- ✅ DTO pattern implementation with mappers
- ✅ Comprehensive test suite with integration tests
- ✅ Security framework setup (OAuth2 ready)
- ✅ Database persistence with H2
- ✅ Actuator monitoring and health checks
- ✅ Logging configuration with file archiving
- 🔄 REST API endpoints (basic security endpoints implemented)
- 🔄 Full CRUD REST controllers for all domains
- 🔄 Authentication and authorization implementation

### Configuration

- **Server Port**: 8080
- **Database**: File-based H2 (`./data/buildflow-db`)
- **Security**: Currently disabled for development
- **JPA**: Auto DDL updates enabled
- **Logging**: Configured with daily rotation and archiving

This backend provides a solid foundation for the BuildFlow construction management platform, with a well-structured domain model and comprehensive testing framework ready for REST API development.

