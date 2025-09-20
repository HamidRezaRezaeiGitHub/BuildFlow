package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DataJpaTest
class JwtAuthenticationFilterTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class JwtAuthenticationFilterTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }

        @Bean
        public CustomUserDetailsService customUserDetailsService(UserService userService,
                                                                 UserAuthenticationRepository userAuthenticationRepository) {
            return new CustomUserDetailsService(userService, userAuthenticationRepository);
        }

        @Bean
        public JwtTokenProvider jwtTokenProvider() {
            String testSecret = "MyTestSecretKeyThatIsLongEnoughForHS256Algorithm";
            int testExpiration = 3600000; // 1 hour
            return new JwtTokenProvider(testSecret, testExpiration);
        }

        @Bean
        public SecurityAuditService securityAuditService() {
            return new SecurityAuditService();
        }

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                                               CustomUserDetailsService customUserDetailsService,
                                                               SecurityAuditService securityAuditService) {
            return new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService, securityAuditService);
        }
    }

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    private AutoCloseable mockitoCloseable;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpServletResponse mockResponse;

    @Mock
    private FilterChain mockFilterChain;

    @Mock
    private SecurityContext mockSecurityContext;

    private User testUser;
    private String validToken;

    @BeforeEach
    void setUp() {
        mockitoCloseable = MockitoAnnotations.openMocks(this);

        // Create and persist test user with authentication
        testUser = createRandomBuilderUser();
        persistUserDependencies(testUser);
        testUser = userRepository.save(testUser);

        // "password"
        UserAuthentication testUserAuth = UserAuthentication.builder()
                .username(testUser.getUsername())
                .passwordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFO3Q8E7cgJ5VB5lzqOQnN6") // "password"
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(testUserAuth);

        // Generate valid token for the test user
        UserPrincipal testUserPrincipal = UserPrincipal.builder()
                .username(testUser.getUsername())
                .email(testUser.getEmail())
                .password("encoded-password")
                .enabled(true)
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(testUserPrincipal);
        validToken = jwtTokenProvider.generateToken(mockAuth).getValue();

        when(mockRequest.getRequestURI()).thenReturn("/api/v1/auth/token");

        // Setup SecurityContextHolder mock
        SecurityContextHolder.setContext(mockSecurityContext);
    }

    @AfterEach
    void tearDown() throws Exception {
        userAuthenticationRepository.deleteAll();
        userRepository.deleteAll();
        SecurityContextHolder.clearContext();
        mockitoCloseable.close();
    }

    @Test
    void doFilterInternal_shouldSetAuthentication_whenValidTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext).setAuthentication(any(Authentication.class));
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenNoTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(null);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenInvalidTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer invalid.token.here");

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenTokenWithoutBearerPrefix() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(validToken);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenEmptyTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer ");

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenBlankTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer   ");

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldHandleUserNotFound_whenValidTokenButUserDoesNotExist() throws ServletException, IOException {
        // Given - Create token for non-existent user
        UserPrincipal nonExistentUser = UserPrincipal.builder()
                .username("nonexistentuser")
                .email("nonexistent@example.com")
                .password("encoded-password")
                .enabled(true)
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(nonExistentUser);
        String tokenForNonExistentUser = jwtTokenProvider.generateToken(mockAuth).getValue();

        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + tokenForNonExistentUser);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldSetAuthentication_whenValidTokenForDisabledUser() throws ServletException, IOException {
        // Given - Create disabled user with authentication
        String disabledUsername = "disabled_user";
        User disabledUser = createRandomBuilderUser();
        disabledUser.setUsername(disabledUsername);
        disabledUser.setEmail("disabled@example.com");
        disabledUser.setRegistered(false); // Disabled user
        persistUserDependencies(disabledUser);
        userRepository.save(disabledUser);

        UserAuthentication disabledAuth = UserAuthentication.builder()
                .username(disabledUsername)
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(disabledAuth);

        UserPrincipal disabledUserPrincipal = UserPrincipal.builder()
                .username(disabledUsername)
                .email("disabled@example.com")
                .password("encoded-password")
                .enabled(false)
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(disabledUserPrincipal);
        String tokenForDisabledUser = jwtTokenProvider.generateToken(mockAuth).getValue();

        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + tokenForDisabledUser);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        // Authentication should still be set even for disabled user - Spring Security will handle authorization
        verify(mockSecurityContext).setAuthentication(any(Authentication.class));
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldContinueFilterChain_whenExceptionOccurs() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        doThrow(new RuntimeException("Test exception")).when(mockSecurityContext).setAuthentication(any());

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldHandleNullAuthorizationHeader_whenHeaderIsNull() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(null);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext, never()).setAuthentication(any());
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldSetAuthenticationWithCorrectDetails_whenValidTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(mockRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(mockRequest.getHeader("User-Agent")).thenReturn("Test-Agent");

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext).setAuthentication(argThat(auth -> {
            assertNotNull(auth);
            assertInstanceOf(org.springframework.security.authentication.UsernamePasswordAuthenticationToken.class, auth);
            assertInstanceOf(UserDetails.class, auth.getPrincipal());
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            assertEquals(testUser.getUsername(), userDetails.getUsername());
            assertNotNull(auth.getDetails());
            return true;
        }));
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldLoadRealUserFromDatabase_whenValidTokenProvided() throws ServletException, IOException {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext).setAuthentication(argThat(auth -> {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            // Verify that the user was actually loaded from the database
            assertEquals(testUser.getUsername(), userDetails.getUsername());
            assertInstanceOf(UserPrincipal.class, userDetails);
            UserPrincipal userPrincipal = (UserPrincipal) userDetails;
            assertEquals(testUser.getEmail(), userPrincipal.getEmail());
            assertEquals(testUser.isRegistered(), userPrincipal.isEnabled());
            return true;
        }));
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void getJwtFromRequest_shouldReturnToken_whenValidBearerTokenProvided() {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);

        // When
        String extractedToken = jwtAuthenticationFilter.getJwtFromRequest(mockRequest);

        // Then
        assertEquals(validToken, extractedToken);
    }

    @Test
    void getJwtFromRequest_shouldReturnNull_whenNoBearerPrefix() {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(validToken);

        // When
        String extractedToken = jwtAuthenticationFilter.getJwtFromRequest(mockRequest);

        // Then
        assertNull(extractedToken);
    }

    @Test
    void getJwtFromRequest_shouldReturnNull_whenNoAuthorizationHeader() {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(null);

        // When
        String extractedToken = jwtAuthenticationFilter.getJwtFromRequest(mockRequest);

        // Then
        assertNull(extractedToken);
    }

    @Test
    void getJwtFromRequest_shouldReturnNull_whenEmptyAuthorizationHeader() {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("");

        // When
        String extractedToken = jwtAuthenticationFilter.getJwtFromRequest(mockRequest);

        // Then
        assertNull(extractedToken);
    }

    @Test
    void getJwtFromRequest_shouldReturnEmptyString_whenOnlyBearerPrefix() {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer ");

        // When
        String extractedToken = jwtAuthenticationFilter.getJwtFromRequest(mockRequest);

        // Then
        assertEquals("", extractedToken);
    }

    @Test
    void doFilterInternal_shouldAlwaysContinueFilterChain_whenAnyScenario() throws ServletException, IOException {
        // Test multiple scenarios to ensure filter chain always continues
        String[] testHeaders = {
                null,
                "",
                "Bearer ",
                "Bearer invalid.token",
                "Invalid-Format",
                "Bearer " + validToken
        };

        for (String header : testHeaders) {
            // Reset mocks
            reset(mockFilterChain, mockSecurityContext);
            SecurityContextHolder.setContext(mockSecurityContext);

            // Given
            when(mockRequest.getHeader("Authorization")).thenReturn(header);

            // When
            jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

            // Then
            verify(mockFilterChain).doFilter(mockRequest, mockResponse);
        }
    }

    @Test
    void doFilterInternal_shouldHandleMultipleUsers_whenDifferentTokensProvided() throws ServletException, IOException {
        // Given - Create another user
        User anotherUser = createRandomOwnerUser();
        persistUserDependencies(anotherUser);
        anotherUser = userRepository.save(anotherUser);

        UserAuthentication anotherUserAuth = UserAuthentication.builder()
                .username(anotherUser.getUsername())
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(anotherUserAuth);

        UserPrincipal anotherUserPrincipal = UserPrincipal.builder()
                .username(anotherUser.getUsername())
                .email(anotherUser.getEmail())
                .password("encoded-password")
                .enabled(true)
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(anotherUserPrincipal);
        String anotherToken = jwtTokenProvider.generateToken(mockAuth).getValue();

        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + anotherToken);

        // Capture the username for lambda usage
        final String expectedUsername = anotherUser.getUsername();

        // When
        jwtAuthenticationFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockSecurityContext).setAuthentication(argThat(auth -> {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            assertEquals(expectedUsername, userDetails.getUsername());
            return true;
        }));
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }
}
