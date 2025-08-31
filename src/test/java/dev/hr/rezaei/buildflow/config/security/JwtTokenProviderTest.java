package dev.hr.rezaei.buildflow.config.security;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Slf4j
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private Authentication mockAuthentication;
    private UserPrincipal mockUserPrincipal;

    @BeforeEach
    void setUp() {
        // Use all-args constructor with test values
        String testSecret = "MyTestSecretKeyThatIsLongEnoughForHS256Algorithm";
        int testExpiration = 3600000; // 1 hour
        jwtTokenProvider = new JwtTokenProvider(testSecret, testExpiration);

        mockAuthentication = mock(Authentication.class);
        mockUserPrincipal = UserPrincipal.builder()
                .username("testuser")
                .email("test@example.com")
                .password("encoded-password")
                .enabled(true)
                .build();
        when(mockAuthentication.getPrincipal()).thenReturn(mockUserPrincipal);
    }

    @Test
    void generateToken_shouldReturnValidToken_whenAuthenticationProvided() {
        String token = jwtTokenProvider.generateToken(mockAuthentication);
        log.debug("Generated token: {}", token);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.contains("."));
    }

    @Test
    void getUsernameFromToken_shouldReturnCorrectUsername_whenValidTokenProvided() {
        String token = jwtTokenProvider.generateToken(mockAuthentication);
        log.debug("Generated token for username extraction: {}", token);

        String username = jwtTokenProvider.getUsernameFromToken(token);
        log.debug("Extracted username from token: {}", username);

        assertEquals(mockUserPrincipal.getUsername(), username);
    }

    @Test
    void isValid_shouldReturnTrue_whenValidTokenProvided() {
        String token = jwtTokenProvider.generateToken(mockAuthentication);

        boolean isValid = jwtTokenProvider.isValid(token);

        assertTrue(isValid);
    }

    @Test
    void isValid_shouldReturnFalse_whenInvalidTokenProvided() {
        String invalidToken = "invalid.jwt.token";

        boolean isValid = jwtTokenProvider.isValid(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void isValid_shouldReturnFalse_whenMalformedTokenProvided() {
        String malformedToken = "malformed-token";

        boolean isValid = jwtTokenProvider.isValid(malformedToken);

        assertFalse(isValid);
    }

    @Test
    void isValid_shouldReturnFalse_whenEmptyTokenProvided() {
        boolean isValid = jwtTokenProvider.isValid("");

        assertFalse(isValid);
    }

    @Test
    void isValid_shouldReturnFalse_whenNullTokenProvided() {
        boolean isValid = jwtTokenProvider.isValid(null);

        assertFalse(isValid);
    }

    @Test
    void getUsernameFromToken_shouldThrowException_whenInvalidTokenProvided() {
        String invalidToken = "invalid.jwt.token";

        assertThrows(Exception.class, () -> jwtTokenProvider.getUsernameFromToken(invalidToken));
    }

    @Test
    void generateToken_shouldGenerateDifferentTokens_whenCalledMultipleTimes() throws InterruptedException {
        String token1 = jwtTokenProvider.generateToken(mockAuthentication);
        // Add a sufficient delay to ensure different timestamps (JWT uses seconds precision)
        Thread.sleep(1000);
        String token2 = jwtTokenProvider.generateToken(mockAuthentication);

        assertNotEquals(token1, token2);
    }

    @Test
    void generateToken_shouldHaveProperJwtStructure_whenTokenGenerated() {
        String token = jwtTokenProvider.generateToken(mockAuthentication);

        // JWT tokens should have 3 parts separated by dots
        String[] parts = token.split("\\.");
        assertEquals(3, parts.length);

        // Each part should be non-empty
        for (String part : parts) {
            assertFalse(part.isEmpty());
        }
    }

    @Test
    void generateToken_shouldIncludeSubject_whenTokenGenerated() {
        String token = jwtTokenProvider.generateToken(mockAuthentication);
        String extractedUsername = jwtTokenProvider.getUsernameFromToken(token);

        assertEquals(mockUserPrincipal.getUsername(), extractedUsername);
    }

    @Test
    void constructor_shouldThrowException_whenSecretIsEmpty() {
        assertThrows(IllegalStateException.class, () -> {
            new JwtTokenProvider("", 3600000);
        });
    }

    @Test
    void constructor_shouldThrowException_whenSecretIsNull() {
        assertThrows(IllegalStateException.class, () -> {
            new JwtTokenProvider(null, 3600000);
        });
    }

    @Test
    void constructor_shouldThrowException_whenSecretIsTooShort() {
        // JWT library enforces minimum 256 bits (32 characters) for security
        assertThrows(Exception.class, () -> {
            JwtTokenProvider provider = new JwtTokenProvider("short", 3600000);
            // The exception will be thrown when trying to use the key, not during construction
            provider.generateToken(mockAuthentication);
        });
    }

    @Test
    void constructor_shouldNotThrow_whenValidParametersProvided() {
        assertDoesNotThrow(() -> {
            new JwtTokenProvider("MyValidSecretKeyThatIsLongEnoughForHS256", 3600000);
        });
    }
}
