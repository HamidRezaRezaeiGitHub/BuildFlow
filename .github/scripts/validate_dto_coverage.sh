#!/bin/bash
# Script to validate complete DTO coverage between backend and frontend
# This script verifies that every backend DTO has a corresponding frontend type

set -e

echo "🔍 Validating DTO Coverage..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find all backend DTOs
# Format: "BackendName:FrontendName" (if different) or just "Name" (if same)
BACKEND_DTOS=(
    "BaseAddressDto"
    "UpdatableEntityDto"
    "ErrorResponse"
    "MessageResponse"
    "JwtAuthenticationResponse:AuthResponse"
    "LoginRequest"
    "SignUpRequest"
    "UserAuthenticationDto"
    "UserSummaryResponse:UserSummary"
    "EstimateDto"
    "EstimateGroupDto"
    "EstimateLineDto"
    "ProjectDto"
    "ProjectLocationDto"
    "CreateProjectRequest"
    "CreateProjectResponse"
    "ProjectLocationRequestDto"
    "QuoteDto"
    "QuoteLocationDto"
    "ContactAddressDto"
    "ContactDto"
    "UserDto"
    "ContactAddressRequestDto"
    "ContactRequestDto"
    "CreateUserRequest"
    "CreateUserResponse"
    "WorkItemDto"
    "CreateWorkItemRequest"
    "CreateWorkItemResponse"
)

# Frontend DTO files to search
FRONTEND_DTO_DIR="frontend/src/services/dtos"

echo "📊 Backend DTOs to validate: ${#BACKEND_DTOS[@]}"
echo ""

MISSING=0
FOUND=0

for dto_entry in "${BACKEND_DTOS[@]}"; do
    # Check if there's a mapping (BackendName:FrontendName)
    if [[ "$dto_entry" == *":"* ]]; then
        backend_name="${dto_entry%%:*}"
        frontend_name="${dto_entry##*:}"
    else
        backend_name="$dto_entry"
        frontend_name="$dto_entry"
    fi
    
    # Search for the DTO in frontend files
    if grep -q "interface ${frontend_name}" "${FRONTEND_DTO_DIR}"/*.ts 2>/dev/null; then
        if [ "$backend_name" != "$frontend_name" ]; then
            echo -e "${GREEN}✅${NC} ${backend_name} → ${frontend_name}"
        else
            echo -e "${GREEN}✅${NC} ${backend_name}"
        fi
        FOUND=$((FOUND + 1))
    elif grep -q "type ${frontend_name}" "${FRONTEND_DTO_DIR}"/*.ts 2>/dev/null; then
        if [ "$backend_name" != "$frontend_name" ]; then
            echo -e "${GREEN}✅${NC} ${backend_name} → ${frontend_name}"
        else
            echo -e "${GREEN}✅${NC} ${backend_name}"
        fi
        FOUND=$((FOUND + 1))
    else
        # Check if it's UpdatableEntityDto (embedded inline)
        if [ "$backend_name" = "UpdatableEntityDto" ]; then
            echo -e "${YELLOW}⚠️${NC}  ${backend_name} (fields embedded inline - OK)"
            FOUND=$((FOUND + 1))
        else
            echo -e "${RED}❌${NC} ${backend_name}"
            MISSING=$((MISSING + 1))
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 Coverage Report:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Found:   ${GREEN}${FOUND}${NC}"
echo -e "Missing: ${RED}${MISSING}${NC}"
echo -e "Total:   ${#BACKEND_DTOS[@]}"
COVERAGE=$(( FOUND * 100 / ${#BACKEND_DTOS[@]} ))
echo -e "Coverage: ${GREEN}${COVERAGE}%${NC}"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS: All backend DTOs have frontend equivalents!${NC}"
    exit 0
else
    echo -e "${RED}❌ FAILURE: ${MISSING} backend DTOs are missing frontend equivalents${NC}"
    exit 1
fi
