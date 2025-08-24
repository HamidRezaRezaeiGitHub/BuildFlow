package dev.hr.rezaei.buildflow.config.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigTest {

    // Exact pattern matching tests
    @Test
    void matches_shouldReturnTrue_whenExactMatch() {
        assertTrue(SecurityConfig.matches("/api/auth/login", "/api/auth/login"));
        assertTrue(SecurityConfig.matches("/", "/"));
        assertTrue(SecurityConfig.matches("/home", "/home"));
    }

    @Test
    void matches_shouldReturnFalse_whenExactMismatch() {
        assertFalse(SecurityConfig.matches("/api/auth/login", "/api/auth/register"));
        assertFalse(SecurityConfig.matches("/home", "/"));
        assertFalse(SecurityConfig.matches("/api/auth", "/api/auth/login"));
    }

    // Single wildcard (*) tests
    @Test
    void matches_shouldReturnTrue_whenSingleWildcardMatches() {
        assertTrue(SecurityConfig.matches("/*.js", "/app.js"));
        assertTrue(SecurityConfig.matches("/*.css", "/styles.css"));
        assertTrue(SecurityConfig.matches("/*.ico", "/favicon.ico"));
        assertTrue(SecurityConfig.matches("/assets/*", "/assets/image.png"));
        assertTrue(SecurityConfig.matches("/static/*", "/static/script.js"));
        assertTrue(SecurityConfig.matches("/static/*", "/static/"));
        assertTrue(SecurityConfig.matches("/*.js", "/.js"));
    }

    @Test
    void matches_shouldReturnFalse_whenSingleWildcardDoesNotMatch() {
        assertFalse(SecurityConfig.matches("*.js", "app.css"));
        assertFalse(SecurityConfig.matches("/assets/*", "/assets/sub/image.png"));
    }

    @Test
    void matches_shouldReturnTrue_whenMultipleSingleWildcardsMatch() {
        assertTrue(SecurityConfig.matches("/api/*/public/*", "/api/v1/public/data"));
        assertTrue(SecurityConfig.matches("/*/*", "/api/auth"));
    }

    @Test
    void matches_shouldReturnFalse_whenMultipleSingleWildcardsDoNotMatch() {
        assertFalse(SecurityConfig.matches("/api/*/public/*", "/api/v1/public/data/nested"));
        assertFalse(SecurityConfig.matches("/*/*", "/api/auth/login"));
        assertFalse(SecurityConfig.matches("*.*", "file.txt"));
    }

    // Double wildcard (/**) tests
    @Test
    void matches_shouldReturnTrue_whenDoubleWildcardMatches() {
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth"));
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/"));
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/login"));
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/user/profile"));
        assertTrue(SecurityConfig.matches("/swagger-ui/**", "/swagger-ui/index.html"));
        assertTrue(SecurityConfig.matches("/swagger-ui/**", "/swagger-ui/css/swagger-ui.css"));
    }

    @Test
    void matches_shouldReturnFalse_whenDoubleWildcardDoesNotMatch() {
        assertFalse(SecurityConfig.matches("/api/auth/**", "/api/user"));
        assertFalse(SecurityConfig.matches("/api/auth/**", "/api"));
        assertFalse(SecurityConfig.matches("/swagger-ui/**", "/swagger"));
        assertFalse(SecurityConfig.matches("/assets/**", "/static/file.js"));
    }

    // Combination of single and double wildcards
    @Test
    void matches_shouldReturnTrue_whenCombinedWildcardsMatch() {
        assertTrue(SecurityConfig.matches("/api/*/public/**", "/api/v1/public"));
        assertTrue(SecurityConfig.matches("/api/*/public/**", "/api/v1/public/"));
        assertTrue(SecurityConfig.matches("/api/*/public/**", "/api/v1/public/data"));
        assertTrue(SecurityConfig.matches("/api/*/public/**", "/api/v1/public/data/nested"));
        assertTrue(SecurityConfig.matches("/*.js/**", "/app.js"));
        assertTrue(SecurityConfig.matches("/*.js/**", "/app.js/"));
        assertTrue(SecurityConfig.matches("/*.js/**", "/app.js/source"));
    }

    @Test
    void matches_shouldReturnFalse_whenCombinedWildcardsDoNotMatch() {
        assertFalse(SecurityConfig.matches("/api/*/public/**", "/api/public"));
        assertFalse(SecurityConfig.matches("/api/*/public/**", "/api/v1/private"));
        assertFalse(SecurityConfig.matches("*.js/**", "app.css"));
        assertFalse(SecurityConfig.matches("*.js/**", "app"));
    }

    // Unsupported patterns (double wildcard in middle)
    @Test
    void matches_shouldReturnFalse_whenDoubleWildcardInMiddle() {
        assertFalse(SecurityConfig.matches("/api/**/auth", "/api/v1/auth"));
        assertFalse(SecurityConfig.matches("/api/**/auth", "/api/auth"));
        assertFalse(SecurityConfig.matches("/**/public", "/api/public"));
        assertFalse(SecurityConfig.matches("/static/**/css", "/static/assets/css"));
    }

    // Edge cases
    @Test
    void matches_shouldHandleEmptyStrings() {
        assertFalse(SecurityConfig.matches("", ""));
        assertFalse(SecurityConfig.matches("", "/api"));
        assertFalse(SecurityConfig.matches("/api", ""));
    }

    @Test
    void matches_shouldHandleRootPath() {
        assertTrue(SecurityConfig.matches("/", "/"));
        assertFalse(SecurityConfig.matches("/", "/home"));
        assertFalse(SecurityConfig.matches("/home", "/"));
    }

    @Test
    void matches_shouldHandleTrailingSlashes() {
        assertFalse(SecurityConfig.matches("/api/auth", "/api/auth/"));
        assertFalse(SecurityConfig.matches("/api/auth/", "/api/auth"));
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/"));
    }

    @Test
    void matches_shouldHandleSpecialCharacters() {
        assertTrue(SecurityConfig.matches("/api-v1", "/api-v1"));
        assertTrue(SecurityConfig.matches("/api_v1", "/api_v1"));
        assertTrue(SecurityConfig.matches("/api.v1", "/api.v1"));
        assertFalse(SecurityConfig.matches("/api-v1", "/api_v1"));
    }

    @Test
    void matches_shouldHandleNumericPaths() {
        assertTrue(SecurityConfig.matches("/api/*/auth", "/api/1/auth"));
        assertTrue(SecurityConfig.matches("/version/*", "/version/123"));
        assertTrue(SecurityConfig.matches("/v*.json", "/v1.json"));
        assertTrue(SecurityConfig.matches("/v*.json", "/v123.json"));
    }

    @Test
    void matches_shouldHandleComplexRealWorldPatterns() {
        // Test patterns from PUBLIC_URLS
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/register"));
        assertTrue(SecurityConfig.matches("/api/auth/**", "/api/auth/login"));
        assertTrue(SecurityConfig.matches("/api/public/**", "/api/public/health"));
        assertTrue(SecurityConfig.matches("/api/*/public/**", "/api/v1/public/status"));
        assertTrue(SecurityConfig.matches("/swagger-ui/**", "/swagger-ui/index.html"));
        assertTrue(SecurityConfig.matches("/v3/api-docs/**", "/v3/api-docs/swagger-config"));
        assertTrue(SecurityConfig.matches("/*.js", "/app.js"));
        assertTrue(SecurityConfig.matches("/*.css", "/styles.css"));
        assertTrue(SecurityConfig.matches("/*.ico", "/favicon.ico"));
        assertTrue(SecurityConfig.matches("/assets/**", "/assets/images/logo.png"));
        assertTrue(SecurityConfig.matches("/static/**", "/static/css/main.css"));
    }

    @Test
    void matches_shouldRejectComplexRealWorldMismatches() {
        assertFalse(SecurityConfig.matches("/api/auth/**", "/api/user/profile"));
        assertFalse(SecurityConfig.matches("/api/public/**", "/api/private/data"));
        assertFalse(SecurityConfig.matches("/swagger-ui/**", "/swagger/ui/index.html"));
        assertFalse(SecurityConfig.matches("/*.js", "/scripts/app.js"));
        assertFalse(SecurityConfig.matches("/assets/**", "/static/image.png"));
    }

    // Test case sensitivity
    @Test
    void matches_shouldBeCaseSensitive() {
        assertFalse(SecurityConfig.matches("/API/AUTH/**", "/api/auth/login"));
        assertFalse(SecurityConfig.matches("/api/auth/**", "/API/AUTH/LOGIN"));
        assertFalse(SecurityConfig.matches("*.JS", "app.js"));
        assertTrue(SecurityConfig.matches("/*.JS", "/app.JS"));
    }
}
