package dev.hr.rezaei.buildflow.data.migration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

/**
 * Utility class for loading JSON data from files, with support for both classpath and filesystem resolution.
 * <p>
 * This class provides reusable methods for reading JSON arrays into typed lists, primarily intended for
 * loading mock/migration data from the {@code mock-data/} directory at the project root.
 * </p>
 *
 * <h3>Key Features:</h3>
 * <ul>
 *   <li>Automatic fallback from classpath to filesystem when loading JSON files</li>
 *   <li>Consistent ObjectMapper configuration with JavaTimeModule for date/time handling</li>
 *   <li>Type-safe JSON deserialization using Jackson's TypeReference</li>
 *   <li>Defensive programming: returns empty lists instead of null on errors</li>
 *   <li>Detailed logging for troubleshooting file resolution and parsing issues</li>
 * </ul>
 *
 * <h3>Usage Examples:</h3>
 * <pre>{@code
 * // Load a list of User POJOs from mock-data/Users.json
 * List<User> users = JsonLoadUtil.loadJsonArray("Users.json", new TypeReference<List<User>>() {});
 *
 * // Load with custom base directory
 * List<Project> projects = JsonLoadUtil.loadJsonArray(
 *     Paths.get("custom-data"), "Projects.json", new TypeReference<List<Project>>() {}
 * );
 * }</pre>
 *
 * <h3>File Resolution Strategy:</h3>
 * <ol>
 *   <li>Attempts to load from classpath: {@code ../../../mock-data/<filename>}</li>
 *   <li>Falls back to filesystem: {@code <baseDir>/<filename>} (default baseDir is "mock-data")</li>
 *   <li>Returns empty list if file not found or parsing fails</li>
 * </ol>
 *
 * <h3>Error Handling:</h3>
 * <ul>
 *   <li>Missing files: logs warning and returns empty list</li>
 *   <li>Parsing errors: logs error with stack trace and returns empty list</li>
 *   <li>IO errors: logs error with details and returns empty list</li>
 * </ul>
 *
 * @since 1.0
 */
@Slf4j
public final class JsonLoadUtil {

    /**
     * Default base directory for JSON files (relative to project root).
     */
    private static final String DEFAULT_BASE_DIR = "mock-data";

    /**
     * Classpath prefix for resolving files from the compiled resources.
     * Adjusts for the package depth relative to resources root.
     */
    private static final String CLASSPATH_PREFIX = "../../../mock-data/";

    /**
     * Shared ObjectMapper instance configured with JavaTimeModule for ISO-8601 date/time parsing.
     */
    private static final ObjectMapper OBJECT_MAPPER = createObjectMapper();

    /**
     * Private constructor to prevent instantiation.
     * This is a utility class with only static methods.
     */
    private JsonLoadUtil() {
        throw new UnsupportedOperationException("Utility class should not be instantiated");
    }

    /**
     * Creates and configures an ObjectMapper with standard settings for the project.
     *
     * @return configured ObjectMapper instance
     */
    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        // Add any other global configuration here (e.g., FAIL_ON_UNKNOWN_PROPERTIES)
        return mapper;
    }

    /**
     * Loads a JSON array from a file and deserializes it into a typed list.
     * Uses the default base directory ({@code mock-data/}).
     *
     * @param filename      the name of the JSON file (e.g., "Users.json")
     * @param typeReference Jackson TypeReference for type-safe deserialization
     * @param <T>           the type of objects in the list
     * @return list of deserialized objects, or empty list if file not found or parsing fails
     */
    public static <T> List<T> loadJsonArray(String filename, TypeReference<List<T>> typeReference) {
        return loadJsonArray(Paths.get(DEFAULT_BASE_DIR), filename, typeReference);
    }

    /**
     * Loads a JSON array from a file and deserializes it into a typed list.
     * Supports custom base directory for filesystem resolution.
     *
     * @param baseDir       the base directory path (relative to project root)
     * @param filename      the name of the JSON file (e.g., "Users.json")
     * @param typeReference Jackson TypeReference for type-safe deserialization
     * @param <T>           the type of objects in the list
     * @return list of deserialized objects, or empty list if file not found or parsing fails
     */
    public static <T> List<T> loadJsonArray(Path baseDir, String filename, TypeReference<List<T>> typeReference) {
        if (filename == null || filename.trim().isEmpty()) {
            log.warn("Filename is null or empty, returning empty list");
            return Collections.emptyList();
        }

        try {
            // Try classpath first
            List<T> result = tryLoadFromClasspath(filename, typeReference);
            if (result != null) {
                return result;
            }

            // Fall back to filesystem
            result = tryLoadFromFilesystem(baseDir, filename, typeReference);
            if (result != null) {
                return result;
            }

            // File not found in either location
            log.warn("Could not find '{}' in classpath or filesystem (baseDir: {})", filename, baseDir);
            return Collections.emptyList();

        } catch (Exception e) {
            log.error("Unexpected error loading JSON file '{}': {}", filename, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Attempts to load JSON from classpath resources.
     *
     * @param filename      the JSON filename
     * @param typeReference type reference for deserialization
     * @param <T>           element type
     * @return deserialized list, or null if resource not found
     */
    private static <T> List<T> tryLoadFromClasspath(String filename, TypeReference<List<T>> typeReference) {
        String classpathPath = CLASSPATH_PREFIX + filename;
        
        try (InputStream is = JsonLoadUtil.class.getClassLoader().getResourceAsStream(classpathPath)) {
            if (is != null) {
                log.info("Loading JSON from classpath: {}", classpathPath);
                List<T> result = OBJECT_MAPPER.readValue(is, typeReference);
                log.debug("Successfully loaded {} items from classpath: {}", result.size(), filename);
                return result != null ? result : Collections.emptyList();
            }
        } catch (IOException e) {
            log.error("Error reading JSON from classpath '{}': {}", classpathPath, e.getMessage(), e);
            return Collections.emptyList();
        }

        return null; // Not found in classpath
    }

    /**
     * Attempts to load JSON from filesystem.
     *
     * @param baseDir       base directory for the file
     * @param filename      the JSON filename
     * @param typeReference type reference for deserialization
     * @param <T>           element type
     * @return deserialized list, or null if file not found
     */
    private static <T> List<T> tryLoadFromFilesystem(Path baseDir, String filename, TypeReference<List<T>> typeReference) {
        Path filePath = baseDir.resolve(filename);
        File file = filePath.toFile();

        if (!file.exists()) {
            log.debug("File does not exist on filesystem: {}", file.getAbsolutePath());
            return null; // Not found
        }

        if (!file.canRead()) {
            log.warn("File exists but is not readable: {}", file.getAbsolutePath());
            return Collections.emptyList();
        }

        try {
            log.info("Loading JSON from filesystem: {}", file.getAbsolutePath());
            List<T> result = OBJECT_MAPPER.readValue(file, typeReference);
            log.debug("Successfully loaded {} items from filesystem: {}", result.size(), filename);
            return result != null ? result : Collections.emptyList();
        } catch (IOException e) {
            log.error("Error reading JSON from file '{}': {}", file.getAbsolutePath(), e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Loads a JSON array from a specific file path.
     * Does not attempt classpath resolution; reads directly from the provided file.
     *
     * @param file          the file to read
     * @param typeReference Jackson TypeReference for type-safe deserialization
     * @param <T>           the type of objects in the list
     * @return list of deserialized objects, or empty list if file not found or parsing fails
     */
    public static <T> List<T> loadJsonArrayFromFile(File file, TypeReference<List<T>> typeReference) {
        if (file == null) {
            log.warn("File is null, returning empty list");
            return Collections.emptyList();
        }

        if (!file.exists()) {
            log.warn("File does not exist: {}", file.getAbsolutePath());
            return Collections.emptyList();
        }

        if (!file.canRead()) {
            log.warn("File exists but is not readable: {}", file.getAbsolutePath());
            return Collections.emptyList();
        }

        try {
            log.info("Loading JSON from file: {}", file.getAbsolutePath());
            List<T> result = OBJECT_MAPPER.readValue(file, typeReference);
            log.debug("Successfully loaded {} items from file: {}", result.size(), file.getName());
            return result != null ? result : Collections.emptyList();
        } catch (IOException e) {
            log.error("Error reading JSON from file '{}': {}", file.getAbsolutePath(), e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Checks if a list is null or empty.
     * Utility method for defensive checks in calling code.
     *
     * @param list the list to check
     * @return true if list is null or empty, false otherwise
     */
    public static boolean isNullOrEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }

    /**
     * Returns an unmodifiable empty list if the input is null.
     * Utility method for null-safe list handling.
     *
     * @param list the list to check
     * @param <T>  element type
     * @return the original list if not null, or an empty unmodifiable list
     */
    public static <T> List<T> nullSafe(List<T> list) {
        return list != null ? list : Collections.emptyList();
    }
}
