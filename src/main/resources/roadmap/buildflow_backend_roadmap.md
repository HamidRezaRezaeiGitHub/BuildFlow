# BuildFlow Backend & Database Roadmap

An 8-week plan for implementing the BuildFlow backend and database.

---

## Phase 1: Requirements & Design (Weeks 1–2)

1. **Detailed Domain Modeling**
   - Define entities: `Item`, `Quote`, `Project`, `Payee`, `Contract`, `Payment`
   - Specify attributes, enums (`costType`, `quoteStrategy`), and relationships
2. **API Specification**
   - Draft REST endpoints for each module (CRUD + queries)
   - Define request/response DTOs
   - Generate OpenAPI contract with SpringDoc
3. **Database Schema Design**
   - Translate domain model into SQL DDL
   - Plan keys and indexing for reporting
   - Support H2/SQLite now and PostgreSQL later

> **Milestone:** ER diagram, OpenAPI spec, initial SQL DDL

---

## Phase 2: Project Setup & Core Infrastructure (Week 3)

1. **Spring Boot Project Initialization**
   - Create Maven/Gradle modules (`core`, `web`, `persistence`)
   - Configure H2/SQLite datasource
2. **Common Libraries & Utilities**
   - Setup JPA/Hibernate
   - Configure Jackson JSON
   - Add global exception handling & SLF4J logging
3. **CI/CD Pipeline Kick-off**
   - GitHub Actions: build & test
   - Dockerfile for local development

> **Milestone:** Basic endpoint and green CI build

---

## Phase 3: Construction Cost Estimation Module (Weeks 4–5)

1. **Entities & Repositories**
   - Implement `ItemEntity`, `QuoteEntity`, `ProjectEntity`
   - Create Spring Data JPA repositories
2. **Service & Business Logic**
   - Quote aggregation (`average`, `latest`)
   - Cost calculation engine (sqft vs. lump sum + multipliers)
3. **Controllers & DTOs**
   - Endpoints:
     - `GET /items`, `POST /items`
     - `GET /projects/{id}/estimate`
   - Add validation with Bean Validation
4. **Basic Reporting**
   - Return JSON summaries for graphs
   - Stub for Google Docs export link

> **Milestone:** Working end-to-end estimation flow on H2

---

## Phase 4: Payment Tracking Module (Weeks 6–7)

1. **Entities & Repositories**
   - Implement `PayeeEntity`, `ContractEntity`, `PaymentEntity`
2. **Service & Business Logic**
   - Assign items to payees and track modifications
   - Process and record payments
3. **Controllers & DTOs**
   - Endpoints:
     - `POST /contracts`, `GET /contracts/{id}`
     - `POST /payments`, `GET /projects/{id}/payments-summary`
4. **Reporting & Summaries**
   - Pivot-style financial overviews
   - Chart-ready JSON output

> **Milestone:** Complete payment tracking CRUD + summary endpoint

---

## Phase 5: Security, Backup & Deployment (Week 8)

1. **Authentication & Authorization**
   - Integrate Spring Security + OAuth2 (Google)
   - Define roles: `ADMIN`, `PROJECT_MANAGER`, `VIEWER`
2. **Data Backup Strategy**
   - Scheduled job to export DB dump to Google Drive
   - Configure retention policy
3. **Production Deployment**
   - Prepare Heroku/DigitalOcean setup
   - Set environment variables (OAuth, Stripe keys)
   - Smoke tests on staging
4. **Documentation & Handoff**
   - Update README (setup, migrations, backups, deployment)
   - Publish API docs via Swagger UI

> **Milestone:** Secure, deployed backend with daily backups

---

## Next Steps (Post-MVP)

- **Scalability Enhancements**: Migrate to AWS RDS (PostgreSQL), optimize pooling
- **Advanced Reporting**: Pre-aggregated tables, caching layers
- **Subscription Billing**: Stripe webhooks, plan management
- **Monitoring & Alerting**: Integrate Prometheus/Grafana or platform add-ons

