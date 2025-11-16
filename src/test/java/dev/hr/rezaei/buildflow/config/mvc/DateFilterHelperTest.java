package dev.hr.rezaei.buildflow.config.mvc;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for DateFilterHelper
 * Tests date filter parameter parsing, validation, and error handling
 */
class DateFilterHelperTest {

    // ============================================
    // Valid Timestamp Parsing Tests
    // ============================================
    
    @Test
    void createDateFilter_withAllValidTimestamps_shouldParseCorrectly() {
        String createdAfter = "2024-01-01T00:00:00Z";
        String createdBefore = "2024-12-31T23:59:59Z";
        String updatedAfter = "2024-11-01T00:00:00Z";
        String updatedBefore = "2024-11-30T23:59:59Z";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            createdAfter, createdBefore, updatedAfter, updatedBefore
        );
        
        assertNotNull(filter);
        assertTrue(filter.hasFilters());
        assertEquals(Instant.parse(createdAfter), filter.getCreatedAfter().orElse(null));
        assertEquals(Instant.parse(createdBefore), filter.getCreatedBefore().orElse(null));
        assertEquals(Instant.parse(updatedAfter), filter.getUpdatedAfter().orElse(null));
        assertEquals(Instant.parse(updatedBefore), filter.getUpdatedBefore().orElse(null));
    }
    
    @Test
    void createDateFilter_withSingleTimestamp_shouldParseCorrectly() {
        String createdAfter = "2024-01-01T00:00:00Z";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            createdAfter, null, null, null
        );
        
        assertNotNull(filter);
        assertTrue(filter.hasFilters());
        assertEquals(Instant.parse(createdAfter), filter.getCreatedAfter().orElse(null));
        assertFalse(filter.getCreatedBefore().isPresent());
        assertFalse(filter.getUpdatedAfter().isPresent());
        assertFalse(filter.getUpdatedBefore().isPresent());
    }
    
    @Test
    void createDateFilter_withWhitespace_shouldTrimAndParse() {
        String createdAfter = "  2024-01-01T00:00:00Z  ";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            createdAfter, null, null, null
        );
        
        assertNotNull(filter);
        assertEquals(Instant.parse("2024-01-01T00:00:00Z"), filter.getCreatedAfter().orElse(null));
    }
    
    // ============================================
    // Null and Empty Handling Tests
    // ============================================
    
    @Test
    void createDateFilter_withAllNullTimestamps_shouldReturnEmptyFilter() {
        DateFilter filter = DateFilterHelper.createDateFilter(null, null, null, null);
        
        assertNotNull(filter);
        assertFalse(filter.hasFilters());
        assertFalse(filter.getCreatedAfter().isPresent());
        assertFalse(filter.getCreatedBefore().isPresent());
        assertFalse(filter.getUpdatedAfter().isPresent());
        assertFalse(filter.getUpdatedBefore().isPresent());
    }
    
    @Test
    void createDateFilter_withBlankStrings_shouldReturnEmptyFilter() {
        DateFilter filter = DateFilterHelper.createDateFilter("", "  ", "\t", "\n");
        
        assertNotNull(filter);
        assertFalse(filter.hasFilters());
    }
    
    // ============================================
    // Invalid Format Handling Tests
    // ============================================
    
    @Test
    void createDateFilter_withInvalidTimestamp_shouldIgnoreAndLog() {
        String invalidTimestamp = "not-a-date";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            invalidTimestamp, null, null, null
        );
        
        assertNotNull(filter);
        assertFalse(filter.hasFilters());
        assertFalse(filter.getCreatedAfter().isPresent());
    }
    
    @Test
    void createDateFilter_withMixedValidAndInvalid_shouldParseOnlyValid() {
        String valid = "2024-01-01T00:00:00Z";
        String invalid = "invalid-date";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            valid, invalid, null, null
        );
        
        assertNotNull(filter);
        assertTrue(filter.hasFilters());
        assertEquals(Instant.parse(valid), filter.getCreatedAfter().orElse(null));
        assertFalse(filter.getCreatedBefore().isPresent());
    }
    
    @Test
    void createDateFilter_withPartialISO8601_shouldIgnore() {
        // Missing time zone
        String invalidTimestamp = "2024-01-01T00:00:00";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            invalidTimestamp, null, null, null
        );
        
        assertNotNull(filter);
        assertFalse(filter.hasFilters());
    }
    
    // ============================================
    // Edge Cases
    // ============================================
    
    @Test
    void createDateFilter_withEpoch_shouldParse() {
        String epoch = "1970-01-01T00:00:00Z";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            epoch, null, null, null
        );
        
        assertNotNull(filter);
        assertEquals(Instant.EPOCH, filter.getCreatedAfter().orElse(null));
    }
    
    @Test
    void createDateFilter_withFutureDate_shouldParse() {
        String futureDate = "2099-12-31T23:59:59Z";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            null, null, futureDate, null
        );
        
        assertNotNull(filter);
        assertEquals(Instant.parse(futureDate), filter.getUpdatedAfter().orElse(null));
    }
    
    @Test
    void createDateFilter_withMilliseconds_shouldParse() {
        String withMillis = "2024-01-01T00:00:00.123Z";
        
        DateFilter filter = DateFilterHelper.createDateFilter(
            withMillis, null, null, null
        );
        
        assertNotNull(filter);
        assertEquals(Instant.parse(withMillis), filter.getCreatedAfter().orElse(null));
    }
}
