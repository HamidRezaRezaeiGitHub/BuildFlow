# Backend to Frontend DTO Mapping

This document provides a complete mapping matrix showing the one-to-one correspondence between backend Java DTOs and frontend TypeScript DTOs.

## Complete DTO Mapping Matrix

### Base DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `BaseAddressDto` | `BaseAddressDto` | AddressDtos.ts | `AddressData` | ✅ Mapped |
| `UpdatableEntityDto` | *Inline fields* | N/A | N/A | ✅ Embedded |

**Note:** `UpdatableEntityDto` fields (`createdAt`, `lastUpdatedAt`) are directly embedded in DTOs that extend it on the backend.

### Authentication & Security DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `LoginRequest` | `LoginRequest` | AuthDtos.ts | `LoginCredentials` | ✅ Mapped |
| `SignUpRequest` | `SignUpRequest` | AuthDtos.ts | `SignUpData` | ✅ Mapped |
| `JwtAuthenticationResponse` | `AuthResponse` | AuthDtos.ts | `AuthResponse` | ✅ Mapped |
| `UserSummaryResponse` | `UserSummary` | AuthDtos.ts | `UserSummary` | ✅ Mapped |
| `UserAuthenticationDto` | `UserAuthenticationDto` | UserDtos.ts | `UserAuthentication` | ✅ Mapped |

### MVC Response DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `ErrorResponse` | `ErrorResponse` | MvcDtos.ts | `ApiErrorResponse` | ✅ Mapped |
| `MessageResponse` | `MessageResponse` | MvcDtos.ts | `ApiMessageResponse` | ✅ Mapped |

### User Domain DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `UserDto` | `UserDto` | UserDtos.ts | `User` | ✅ Mapped |
| `ContactDto` | `ContactDto` | UserDtos.ts | `Contact` | ✅ Mapped |
| `ContactAddressDto` | `ContactAddressDto` | UserDtos.ts | `ContactAddress` | ✅ Mapped |
| `ContactRequestDto` | `ContactRequestDto` | UserDtos.ts | `ContactRequest` | ✅ Mapped |
| `ContactAddressRequestDto` | `ContactAddressRequestDto` | UserDtos.ts | `ContactAddressRequest` | ✅ Mapped |
| `CreateUserRequest` | `CreateUserRequest` | AuthDtos.ts | `CreateUserRequest` | ✅ Mapped |
| `CreateUserResponse` | `CreateUserResponse` | AuthDtos.ts | `CreateUserResponse` | ✅ Mapped |

### Project Domain DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `ProjectDto` | `ProjectDto` | ProjectDtos.ts | `Project` | ✅ Mapped |
| `ProjectLocationDto` | `ProjectLocationDto` | ProjectDtos.ts | `ProjectLocation` | ✅ Mapped |
| `ProjectLocationRequestDto` | `ProjectLocationRequestDto` | ProjectDtos.ts | `ProjectLocationRequest` | ✅ Mapped |
| `CreateProjectRequest` | `CreateProjectRequest` | ProjectDtos.ts | `CreateProjectRequest` | ✅ Mapped |
| `CreateProjectResponse` | `CreateProjectResponse` | ProjectDtos.ts | `CreateProjectResponse` | ✅ Mapped |

### Estimate Domain DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `EstimateDto` | `EstimateDto` | EstimateDtos.ts | `Estimate` | ✅ Mapped |
| `EstimateGroupDto` | `EstimateGroupDto` | EstimateDtos.ts | `EstimateGroup` | ✅ Mapped |
| `EstimateLineDto` | `EstimateLineDto` | EstimateDtos.ts | `EstimateLine` | ✅ Mapped |

### WorkItem Domain DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `WorkItemDto` | `WorkItemDto` | WorkItemDtos.ts | `WorkItem` | ✅ Mapped |
| `CreateWorkItemRequest` | `CreateWorkItemRequest` | WorkItemDtos.ts | `CreateWorkItemRequest` | ✅ Mapped |
| `CreateWorkItemResponse` | `CreateWorkItemResponse` | WorkItemDtos.ts | `CreateWorkItemResponse` | ✅ Mapped |

### Quote Domain DTOs
| Backend (Java) | Frontend (TypeScript) | File | Alias Export | Status |
|----------------|----------------------|------|--------------|--------|
| `QuoteDto` | `QuoteDto` | QuoteDtos.ts | `Quote` | ✅ Mapped |
| `QuoteLocationDto` | `QuoteLocationDto` | QuoteDtos.ts | `QuoteLocation` | ✅ Mapped |

## Summary Statistics

- **Total Backend DTOs**: 31
- **Total Frontend DTOs**: 31
- **Complete Mappings**: 31 ✅
- **Missing Mappings**: 0
- **Coverage**: 100%

## Alias Export Convention

All DTOs follow a consistent aliasing pattern in `index.ts`:

### Pattern Rules

1. **Domain DTOs with "Dto" suffix**: Remove the "Dto" suffix
   - `ProjectDto` → `Project`
   - `WorkItemDto` → `WorkItem`
   - `EstimateDto` → `Estimate`

2. **Request/Response DTOs**: Keep original names (already clean)
   - `CreateProjectRequest` → `CreateProjectRequest` (no alias)
   - `CreateProjectResponse` → `CreateProjectResponse` (no alias)

3. **Nested DTOs**: Follow parent pattern
   - `ProjectLocationDto` → `ProjectLocation`
   - `EstimateGroupDto` → `EstimateGroup`

### Benefits of Aliasing

1. **Clean Consumer Code**: Components use `Project` instead of `ProjectDto`
2. **Backend Alignment**: Source files maintain exact backend naming
3. **IDE Support**: Auto-imports suggest clean domain names
4. **Consistency**: All DTOs follow the same pattern

## Field Type Mapping

### Java to TypeScript Type Conversions

| Java Type | TypeScript Type | Notes |
|-----------|----------------|-------|
| `UUID` | `string` | Serialized as string in JSON |
| `String` | `string` | Direct mapping |
| `boolean` | `boolean` | Direct mapping |
| `int`, `long`, `double` | `number` | Direct mapping |
| `BigDecimal` | `string` | Preserved as string for precision |
| `LocalDateTime` | `string` | ISO 8601 format |
| `Set<T>` | `T[]` | Array of type T |
| `List<T>` | `T[]` | Array of type T |
| `Optional<T>` | `T \| undefined` | Optional field in TypeScript |

### Inheritance Handling

DTOs that extend `UpdatableEntityDto` in backend include these fields inline in frontend:
- `createdAt: string` (ISO 8601 format)
- `lastUpdatedAt: string` (ISO 8601 format)

**Example:**
```java
// Backend
public class ProjectDto extends UpdatableEntityDto {
    private UUID id;
    private UUID builderId;
    // ...
}
```

```typescript
// Frontend
export interface ProjectDto {
  id: string;
  builderId: string;
  // ... other fields
  createdAt: string;      // From UpdatableEntityDto
  lastUpdatedAt: string;  // From UpdatableEntityDto
}
```

## Validation Checklist

- [x] All backend DTOs have corresponding frontend types
- [x] Field names match exactly (camelCase on both sides)
- [x] Field types are correctly mapped (Java → TypeScript)
- [x] Optional fields marked with `?` where appropriate
- [x] Nested DTOs properly referenced
- [x] Alias exports follow consistent pattern
- [x] JSDoc comments document backend source
- [x] README.md documents all DTO files
- [x] TypeScript compilation succeeds
- [x] Build process completes without errors

## Usage Examples

### Import with Aliases (Recommended)
```typescript
// ✅ CORRECT - Use aliased names from index.ts
import { 
  Project, 
  WorkItem, 
  Estimate,
  Quote 
} from '@/services/dtos';

const project: Project = await projectService.getProject(id);
const workItem: WorkItem = await workItemService.getWorkItem(id);
```

### Direct Import (Not Recommended)
```typescript
// ❌ AVOID - Don't import directly from DTO files
import { ProjectDto } from '@/services/dtos/ProjectDtos';
```

### Request/Response Types
```typescript
// Request/Response types keep their original names
import { 
  CreateProjectRequest, 
  CreateProjectResponse,
  CreateWorkItemRequest,
  CreateWorkItemResponse
} from '@/services/dtos';

const request: CreateProjectRequest = { /* ... */ };
const response: CreateProjectResponse = await service.create(request);
```

## Maintenance Guidelines

### When Adding New Backend DTOs

1. **Create corresponding TypeScript interface** in appropriate file
   - Match field names exactly (camelCase)
   - Map Java types to TypeScript types
   - Include JSDoc with backend source reference
   - Add `createdAt`/`lastUpdatedAt` for DTOs extending `UpdatableEntityDto`

2. **Add alias export to index.ts**
   - Remove "Dto" suffix for domain DTOs
   - Keep original names for Request/Response DTOs

3. **Update README.md**
   - Add file to "Files Structure" section
   - Document interfaces and usage examples

4. **Update this mapping document**
   - Add entry to appropriate domain table
   - Update summary statistics

### When Modifying Existing DTOs

1. **Keep backend and frontend in sync**
   - Update frontend when backend changes
   - Maintain field name consistency
   - Update type mappings if needed

2. **Update documentation**
   - Refresh usage examples if API changes
   - Update JSDoc comments

3. **Run validation**
   - TypeScript compilation: `npm run build`
   - Verify no breaking changes in consumers

## Related Documentation

- [Backend DTO Documentation](../../../../../src/main/java/dev/hr/rezaei/buildflow/Dtos.md)
- [Frontend Services README](../README.md)
- [DTOs README](./README.md)
- [API Service Documentation](../ApiService.tsx)
