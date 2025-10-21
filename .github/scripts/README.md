# GitHub Workflow Scripts

This directory contains utility scripts used for validating the BuildFlow codebase.

## Scripts

### `validate_dto_coverage.sh`

**Purpose:** Validates complete DTO coverage between backend Java DTOs and frontend TypeScript DTOs.

**Usage:**
```bash
./.github/scripts/validate_dto_coverage.sh
```

**What it checks:**
- Every backend DTO class has a corresponding frontend TypeScript interface/type
- Proper mapping for DTOs with different frontend names (e.g., `JwtAuthenticationResponse` → `AuthResponse`)
- Special cases like `UpdatableEntityDto` (fields embedded inline)

**Exit codes:**
- `0` - Success: 100% coverage achieved
- `1` - Failure: One or more backend DTOs missing frontend equivalents

**Example output:**
```
🔍 Validating DTO Coverage...

📊 Backend DTOs to validate: 29

✅ BaseAddressDto
⚠️  UpdatableEntityDto (fields embedded inline - OK)
✅ ErrorResponse
✅ MessageResponse
✅ JwtAuthenticationResponse → AuthResponse
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Coverage Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found:   29
Missing: 0
Total:   29
Coverage: 100%

🎉 SUCCESS: All backend DTOs have frontend equivalents!
```

**Maintenance:**
When adding new backend DTOs, update the `BACKEND_DTOS` array in the script:
- Use format `"BackendName:FrontendName"` if names differ
- Use format `"Name"` if names are identical

**Integration:**
This script can be integrated into CI/CD pipelines to ensure DTO parity is maintained:

```yaml
# Example GitHub Actions workflow
- name: Validate DTO Coverage
  run: ./.github/scripts/validate_dto_coverage.sh
```
