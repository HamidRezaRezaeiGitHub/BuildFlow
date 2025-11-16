package dev.hr.rezaei.buildflow.config.mvc;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.format.DateTimeParseException;

/**
 * Helper for parsing date filter parameters from request.
 * Converts ISO 8601 timestamp strings to Instant objects.
 * 
 * Provides centralized, safe parsing of date filter parameters with:
 * - Null and blank value handling
 * - ISO 8601 format validation
 * - Error logging for invalid formats
 * - Graceful degradation (invalid values ignored)
 */
@Slf4j
public class DateFilterHelper {
    
    /**
     * Private constructor prevents instantiation.
     * This is a utility class with only static methods.
     */
    private DateFilterHelper() {
        throw new AssertionError("DateFilterHelper is a utility class and should not be instantiated");
    }
    
    /**
     * Creates a DateFilter from request parameters.
     * Safely parses ISO 8601 timestamps, logging warnings for invalid values.
     * Invalid values are ignored and set to null in the returned filter.
     * 
     * @param createdAfter ISO 8601 timestamp string (optional, may be null or blank)
     * @param createdBefore ISO 8601 timestamp string (optional, may be null or blank)
     * @param updatedAfter ISO 8601 timestamp string (optional, may be null or blank)
     * @param updatedBefore ISO 8601 timestamp string (optional, may be null or blank)
     * @return DateFilter object (never null, may be empty if all params are null/invalid)
     */
    public static DateFilter createDateFilter(
            String createdAfter, 
            String createdBefore,
            String updatedAfter, 
            String updatedBefore
    ) {
        return DateFilter.builder()
            .createdAfter(parseInstant(createdAfter, "createdAfter"))
            .createdBefore(parseInstant(createdBefore, "createdBefore"))
            .updatedAfter(parseInstant(updatedAfter, "updatedAfter"))
            .updatedBefore(parseInstant(updatedBefore, "updatedBefore"))
            .build();
    }
    
    /**
     * Safely parses an ISO 8601 timestamp string to Instant.
     * Handles null, blank, and invalid formats gracefully.
     * 
     * @param timestamp ISO 8601 string (may be null or blank)
     * @param paramName Parameter name for logging purposes
     * @return Instant object or null if timestamp is null, blank, or invalid
     */
    private static Instant parseInstant(String timestamp, String paramName) {
        if (timestamp == null || timestamp.isBlank()) {
            return null;
        }
        
        try {
            return Instant.parse(timestamp.trim());
        } catch (DateTimeParseException e) {
            log.warn("Invalid {} timestamp: '{}', ignoring filter. Expected ISO 8601 format.", 
                paramName, timestamp);
            return null;
        }
    }
}
