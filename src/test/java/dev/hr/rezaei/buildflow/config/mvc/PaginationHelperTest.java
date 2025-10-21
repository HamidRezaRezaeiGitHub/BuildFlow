package dev.hr.rezaei.buildflow.config.mvc;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PaginationHelper
 * Tests pagination parameter parsing, validation, and default values
 */
class PaginationHelperTest {

    private PaginationHelper paginationHelper;
    
    private static final Set<String> ALLOWED_FIELDS = Set.of("lastUpdatedAt", "createdAt", "name");
    private static final String DEFAULT_FIELD = "lastUpdatedAt";
    private static final Sort.Direction DEFAULT_DIRECTION = Sort.Direction.DESC;

    @BeforeEach
    void setUp() {
        paginationHelper = new PaginationHelper(ALLOWED_FIELDS, DEFAULT_FIELD, DEFAULT_DIRECTION);
    }

    // ============================================
    // createPageable - Basic Parameter Tests
    // ============================================

    @Test
    void createPageable_withNullParameters_shouldUseDefaults() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, null, null);
        
        assertEquals(0, pageable.getPageNumber(), "Default page should be 0");
        assertEquals(25, pageable.getPageSize(), "Default page size should be 25");
        assertEquals(Sort.by(DEFAULT_DIRECTION, DEFAULT_FIELD), pageable.getSort(), "Should use default sort");
    }

    @Test
    void createPageable_withValidPageAndSize_shouldUseProvidedValues() {
        Pageable pageable = paginationHelper.createPageable(2, 50, null, null, null);
        
        assertEquals(2, pageable.getPageNumber());
        assertEquals(50, pageable.getPageSize());
    }

    @Test
    void createPageable_withZeroPage_shouldUseZero() {
        Pageable pageable = paginationHelper.createPageable(0, 10, null, null, null);
        
        assertEquals(0, pageable.getPageNumber());
    }

    // ============================================
    // createPageable - Sort Parameter Tests
    // ============================================

    @Test
    void createPageable_withValidSortParameter_shouldParseCorrectly() {
        String[] sort = new String[]{"createdAt,ASC"};
        Pageable pageable = paginationHelper.createPageable(null, null, sort, null, null);
        
        Sort expectedSort = Sort.by(Sort.Direction.ASC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withSortParameterWithoutDirection_shouldUseDefaultDirection() {
        String[] sort = new String[]{"createdAt"};
        Pageable pageable = paginationHelper.createPageable(null, null, sort, null, null);
        
        Sort expectedSort = Sort.by(DEFAULT_DIRECTION, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withMultipleSortParameters_shouldParseAll() {
        String[] sort = new String[]{"createdAt,ASC", "name,DESC"};
        Pageable pageable = paginationHelper.createPageable(null, null, sort, null, null);
        
        Sort expectedSort = Sort.by(
            new Sort.Order(Sort.Direction.ASC, "createdAt"),
            new Sort.Order(Sort.Direction.DESC, "name")
        );
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withInvalidSortField_shouldUseDefault() {
        String[] sort = new String[]{"invalidField,ASC"};
        Pageable pageable = paginationHelper.createPageable(null, null, sort, null, null);
        
        // Should fallback to default field but preserve the requested direction
        Sort expectedSort = Sort.by(Sort.Direction.ASC, DEFAULT_FIELD);
        assertEquals(expectedSort, pageable.getSort());
    }

    // ============================================
    // createPageable - OrderBy+Direction Tests
    // ============================================

    @Test
    void createPageable_withValidOrderByAndDirection_shouldParseCorrectly() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", "ASC");
        
        Sort expectedSort = Sort.by(Sort.Direction.ASC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withOrderByOnly_shouldUseDefaultDirection() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", null);
        
        Sort expectedSort = Sort.by(DEFAULT_DIRECTION, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withInvalidOrderBy_shouldUseDefault() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "invalidField", "ASC");
        
        Sort expectedSort = Sort.by(Sort.Direction.ASC, DEFAULT_FIELD);
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withInvalidDirection_shouldUseDefaultDirection() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", "INVALID");
        
        Sort expectedSort = Sort.by(DEFAULT_DIRECTION, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withBlankOrderBy_shouldUseDefault() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "  ", "ASC");
        
        Sort expectedSort = Sort.by(DEFAULT_DIRECTION, DEFAULT_FIELD);
        assertEquals(expectedSort, pageable.getSort());
    }

    // ============================================
    // Priority Tests (sort > orderBy > default)
    // ============================================

    @Test
    void createPageable_withBothSortAndOrderBy_shouldPrioritizeSortParameter() {
        String[] sort = new String[]{"name,ASC"};
        Pageable pageable = paginationHelper.createPageable(null, null, sort, "createdAt", "DESC");
        
        // Sort parameter should take precedence
        Sort expectedSort = Sort.by(Sort.Direction.ASC, "name");
        assertEquals(expectedSort, pageable.getSort());
    }

    // ============================================
    // Case Sensitivity Tests
    // ============================================

    @Test
    void createPageable_withLowercaseDirection_shouldParseCorrectly() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", "asc");
        
        Sort expectedSort = Sort.by(Sort.Direction.ASC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withMixedCaseDirection_shouldParseCorrectly() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", "DeSc");
        
        Sort expectedSort = Sort.by(Sort.Direction.DESC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    // ============================================
    // Whitespace Handling Tests
    // ============================================

    @Test
    void createPageable_withWhitespaceInOrderBy_shouldTrimAndValidate() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "  createdAt  ", "ASC");
        
        Sort expectedSort = Sort.by(Sort.Direction.ASC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }

    @Test
    void createPageable_withWhitespaceInDirection_shouldTrimAndParse() {
        Pageable pageable = paginationHelper.createPageable(null, null, null, "createdAt", "  DESC  ");
        
        Sort expectedSort = Sort.by(Sort.Direction.DESC, "createdAt");
        assertEquals(expectedSort, pageable.getSort());
    }
}
