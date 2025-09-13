# BuildFlow: Full-Stack Construction Management Platform

**CRITICAL**: Always reference these instructions first and only fallback to search or additional context gathering if the information here is incomplete or found to be in error.

BuildFlow is a comprehensive full-stack Spring Boot application with an integrated React frontend for construction project management. The application creates a **single deployable JAR** containing both frontend and backend components.

## 🔧 Working Effectively

### Prerequisites - Java Version Requirement
- **CRITICAL**: Java 21 is REQUIRED. Java 17 will fail compilation with "release version 21 not supported"
- Install Java 21: `sudo apt update && sudo apt install -y openjdk-21-jdk`
- Set environment variables:
  ```bash
  export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
  export PATH=$JAVA_HOME/bin:$PATH
  ```
- Verify installation: `java -version` should show "openjdk version 21.0.x"

### Build and Test Process (VALIDATED COMMANDS)
Execute these commands in order for complete setup:

1. **Backend Compilation** (6-8 seconds):
   ```bash
   ./mvnw clean compile
   ```

2. **Frontend Build** (3-5 seconds):
   ```bash
   cd frontend
   npm install    # ~30 seconds - installs 283 packages with deprecation warnings (normal)
   npm run build  # ~3 seconds - creates frontend/dist/ directory
   cd ..
   ```

3. **Complete Full-Stack Build** (8-18 seconds) - NEVER CANCEL:
   ```bash
   ./mvnw clean package -DskipTests
   # Timeout recommendation: 60+ minutes (actual: ~18 seconds)
   # Creates target/BuildFlow-0.0.1-SNAPSHOT.jar with integrated frontend
   ```

4. **Test Suite** (35-37 seconds) - NEVER CANCEL:
   ```bash
   ./mvnw test
   # Timeout recommendation: 30+ minutes (actual: ~37 seconds)
   # Runs 294 tests, typically 1 skipped, 0 failures
   ```

### Running the Application

#### Production Mode (JAR deployment):
```bash
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar
# Starts in ~7-8 seconds
# Available at: http://localhost:8080/
```

#### Development Mode (Maven with hot reload):
```bash
./mvnw spring-boot:run
# Starts in ~4-5 seconds
# Available at: http://localhost:8080/
```

#### Profile-Specific Deployment:
```bash
# UAT environment
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar --spring.profiles.active=uat

# Production environment  
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
```

## 🌐 Application Endpoints

### Core Endpoints (VALIDATED):
- **Frontend**: `http://localhost:8080/` (React SPA)
- **API Base**: `http://localhost:8080/api/*`
- **Public API**: `http://localhost:8080/api/security/public` (returns "This is a public endpoint.")
- **Health Check**: `http://localhost:8080/actuator/health` (shows database, disk, ping, SSL status)
- **H2 Console**: `http://localhost:8080/h2-console` (dev/uat only)
- **Management**: `http://localhost:8081/actuator/*` (uat/production profiles)

### Database Access
- **Default Profile**: File-based H2 at `./data/buildflow-db`
- **UAT Profile**: `./data/buildflow-uat-db` with credentials `buildflow-uat/uat-password`
- **Production Profile**: `./data/buildflow-production-db` with credentials `buildflow/production-password`
- **JDBC URL**: `jdbc:h2:file:./data/buildflow-db` (for H2 console)

## 🏗️ Architecture Overview

### Technology Stack
**Backend**: Spring Boot 3.5.3, Java 21, H2 Database, JPA/Hibernate, Spring Security, Maven
**Frontend**: React 18.3.1, TypeScript, Vite 5.4.0, Tailwind CSS v4, Radix UI components

### Domain Models (IMPLEMENTED)
- **Project Management**: Project entities with locations and ownership
- **Estimation System**: Hierarchical estimates with groups and line items  
- **User Management**: User/Contact entities with authentication
- **Work Items & Quotes**: Task breakdown and client quotations

### Project Structure
```
src/main/java/dev/hr/rezaei/buildflow/
├── BuildFlowApplication.java          # Main Spring Boot application
├── config/security/                   # Security and authentication  
├── config/mvc/WebMvcConfig.java       # SPA routing configuration
├── {domain}/                          # Domain packages (project, estimate, user, etc.)
│   ├── entities/                      # JPA entities
│   ├── repositories/                  # Spring Data repositories  
│   ├── services/                      # Business logic
│   ├── dto/                          # Data transfer objects
│   └── controllers/                   # REST endpoints
frontend/
├── src/                              # React TypeScript source
├── dist/                             # Build output (copied to JAR)
└── package.json                      # Frontend dependencies
```

## 🚨 Critical Build Requirements

### Frontend Integration Process
The Maven build does NOT automatically build the frontend. You MUST build it manually:

1. **Build Frontend First**:
   ```bash
   cd frontend && npm install && npm run build
   ```
   
2. **Then Build Complete Application**:
   ```bash
   ./mvnw clean package
   ```

3. **Verify Frontend Inclusion**: Look for log message:
   ```
   [INFO] Copying 4 resources from frontend/dist to target/classes/static
   ```

### Known Issues and Workarounds
- **Frontend Linting**: `npm run lint` fails due to ESLint configuration issues - this is a known issue, skip linting
- **Security**: Frontend endpoints may return 401 in default profile due to security configuration
- **Frontend Plugin Missing**: No frontend-maven-plugin configured - manual frontend build required

## 🧪 Validation and Testing

### Always Test After Changes
1. **Compile Backend**: `./mvnw clean compile` (should complete in ~6 seconds)
2. **Build Frontend**: `cd frontend && npm run build` (should complete in ~3 seconds)  
3. **Integration Test**: `./mvnw clean package` (should include frontend resources)
4. **Run Application**: Test startup and endpoint accessibility
5. **Health Verification**: `curl http://localhost:8080/actuator/health`

### Manual Scenario Testing
After making changes, always verify:
- Application starts without errors (~7 seconds)
- Database initializes and admin user is created
- API endpoints respond correctly (`/api/security/public`)
- Health endpoint shows all components UP
- H2 console accessible (if enabled for profile)

## 🛠️ Development Guidelines

### Package Documentation
Each domain package contains detailed `.md` files:
- `{Domain}Model.md` - Entity documentation
- `{Domain}Services.md` - Business logic documentation  
- `{Domain}Dtos.md` - Data transfer object documentation
- `{Domain}Controllers.md` - REST endpoint documentation

### Database Profiles
- **Development** (default): H2 console enabled, security customizable, schema auto-update
- **UAT**: Production-like security, H2 console enabled for inspection, schema validation only
- **Production**: Full security enabled, H2 console disabled, schema validation only

### Common Development Tasks
- **View H2 Data**: Access `/h2-console` with JDBC URL from logs
- **API Testing**: Use `/api/security/public` as a connectivity test
- **Health Monitoring**: Check `/actuator/health` for component status
- **Log Analysis**: Application logs show Hibernate DDL and initialization status

## ⚠️ Important Timing and Timeout Guidelines

### Build Time Expectations (MEASURED)
- **Compilation**: 6-8 seconds (set timeout: 2+ minutes)
- **Frontend Build**: 3-5 seconds  
- **Full Package**: 8-18 seconds (set timeout: 60+ minutes)
- **Test Suite**: 35-37 seconds (set timeout: 30+ minutes)
- **Application Startup**: 7-8 seconds

### **NEVER CANCEL BUILDS OR TESTS**
- All builds and tests complete successfully within measured timeframes
- Use generous timeouts for automated processes
- Build failures indicate real issues, not timeout problems

## 🎯 Current Implementation Status

✅ **Completed**:
- Complete domain model with all entities and relationships
- Spring Data JPA repositories and service layers
- Comprehensive integration test suite (294 tests)  
- Security framework with authentication
- React frontend with build integration
- Single JAR deployment capability
- Multi-profile configuration (dev/uat/production)
- Health monitoring and management endpoints

🔄 **In Progress**:
- Complete REST API endpoint implementation
- Frontend-backend API integration
- Authentication UI components

This application provides a solid foundation for construction project management with proven build processes and comprehensive testing coverage.