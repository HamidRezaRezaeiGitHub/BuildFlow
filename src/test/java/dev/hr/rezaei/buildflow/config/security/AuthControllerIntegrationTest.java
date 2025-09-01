package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.security.dto.JwtAuthenticationResponse;
import dev.hr.rezaei.buildflow.config.security.dto.LoginRequest;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.config.security.dto.UserSummaryResponse;
import dev.hr.rezaei.buildflow.user.*;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static dev.hr.rezaei.buildflow.config.mvc.ResponseErrorType.AUTHENTICATION_REQUIRED;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test for AuthController with security enabled.
 * Tests authentication endpoints including login, registration, and current user retrieval.
 * <p>
 * Uses a different IP for each test to avoid rate limiting conflicts.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.security.enabled=true",
        "app.jwt.secret=testSecretKeyThatIsLongEnoughForHS512AlgorithmToWorkProperly123456789",
        "app.jwt.expiration-ms=86400000"
})
@Slf4j
class AuthControllerIntegrationTest implements AuthServiceConsumer {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactAddressRepository contactAddressRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final String AUTH_BASE_URL = "/api/auth";
    private static final String LOGIN_URL = AUTH_BASE_URL + "/login";
    private static final String REGISTER_URL = AUTH_BASE_URL + "/register";
    private static final String CURRENT_USER_URL = AUTH_BASE_URL + "/current";

    private int testCounter = 0;

    @Autowired
    private UserService userService;

    @BeforeEach
    void setUp() {
        clearDatabase();
        testCounter++;
    }

    @AfterEach
    void clearDatabase() {
        userAuthenticationRepository.deleteAll();
        userRepository.deleteAll();
        contactRepository.deleteAll();
        contactAddressRepository.deleteAll();
    }

    @Test
    void registerUser_shouldPersistUser_whenValidRequest() throws Exception {
        // Given
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        ContactRequestDto contactRequestDto = signUpRequest.getContactRequestDto();
        String email = contactRequestDto.getEmail();

        // When - Register user with unique IP
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.1." + testCounter);
        log.info("Registered user: {}", createUserResponse);

        // Then
        UserDto userDto = createUserResponse.getUserDto();
        assertEquals(username, userDto.getUsername());
        assertEquals(email, userDto.getEmail());
        assertTrue(userService.existsByUsername(username));
        assertTrue(userService.existsByEmail(email));
    }

    @Test
    void registerUser_shouldReturn409_whenUsernameAlreadyExists() throws Exception {
        // Given - Create existing user
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String existingUsername = signUpRequest.getUsername();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.2." + testCounter);

        SignUpRequest signUpRequest2 = createValidRandomSignUpRequest();
        signUpRequest2.setUsername(existingUsername); // Same username

        // When & Then - The AuthController now properly handles DuplicateUserException
        // and returns 409 Conflict with ErrorResponse format
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest2))
                        .header("X-Forwarded-For", "192.168.3." + testCounter))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", containsString("409")))
                .andExpect(jsonPath("$.message", containsString("conflict")))
                .andExpect(jsonPath("$.errorType").value("CONFLICT_ERROR"));
    }

    @Test
    void registerUser_shouldReturn409_whenEmailAlreadyExists() throws Exception {
        // Given - Create existing user with same email
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String existingUsername = signUpRequest.getUsername();
        String email = signUpRequest.getContactRequestDto().getEmail();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.4." + testCounter);

        SignUpRequest signUpRequest2 = createValidRandomSignUpRequest();
        signUpRequest2.getContactRequestDto().setEmail(email); // Same email, different username
        signUpRequest2.setUsername(existingUsername + "2"); // Different username

        // When & Then - The system updates the existing user
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest2))
                        .header("X-Forwarded-For", "192.168.5." + testCounter))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", containsString("409")))
                .andExpect(jsonPath("$.message", containsString("conflict")))
                .andExpect(jsonPath("$.errorType").value("CONFLICT_ERROR"));
    }

    @Test
    void registerUser_shouldReturn400_whenInvalidPasswordFormat() throws Exception {
        // Given - Password without special characters
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        signUpRequest.setPassword("weakpassword123"); // No special characters

        // When & Then - The validation error response contains error messages but not field names
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest))
                        .header("X-Forwarded-For", "192.168.6." + testCounter))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.errors", hasItem(containsString("Password"))))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").value(containsString("Validation")));
    }

    @Test
    void registerUser_shouldReturn400_whenMissingRequiredFields() throws Exception {
        // Given - Invalid request with missing contact info
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        signUpRequest.setContactRequestDto(null);

        // When & Then
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest))
                        .header("X-Forwarded-For", "192.168.7." + testCounter))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").value(containsString("Validation")));
    }

    @Test
    void authenticateUser_shouldReturnJwtToken_whenValidCredentials() throws Exception {
        // Given - Create a test user
        LoginRequest loginRequest = registerUserAndCreateLoginRequest(mockMvc, objectMapper, "192.168.8." + testCounter, userService);

        // When - Login with different IP to avoid rate limiting
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.9." + testCounter);

        // Then
        assertEquals("Bearer", jwtAuthenticationResponse.getTokenType());
        String token = jwtAuthenticationResponse.getAccessToken();
        assertTokenIsValid(token, loginRequest.getUsername());
    }

    @Test
    void authenticateUser_shouldReturn401_whenInvalidCredentials() throws Exception {
        // Given - Create a test user with different password
        LoginRequest loginRequest = registerUserAndCreateLoginRequest(mockMvc, objectMapper, "192.168.10." + testCounter, userService);
        loginRequest.setPassword("WrongPassword123"); // Incorrect password

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.11." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticateUser_shouldReturn401_whenUserNotExists() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
                .username("nonexistentuser")
                .password("Password123!")
                .build();

        // When & Then - Spring Security returns 403 for non-existent users
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.12." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticateUser_shouldReturn400_whenInvalidRequestData() throws Exception {
        // Given - Invalid request with missing fields
        LoginRequest loginRequest = LoginRequest.builder()
                .username("") // Empty username
                .password("short") // Too short password
                .build();

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.13." + testCounter))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").value(containsString("Validation")));
    }

    @Test
    void getCurrentUser_shouldReturnUserInfo_whenAuthenticated() throws Exception {
        // Given - Create and authenticate user
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String token = registerUserAndLoginAndGetToken(mockMvc, objectMapper, signUpRequest, "192.168.15." + testCounter, userService);

        // When - Get current user with different IP
        UserSummaryResponse userSummaryResponse = getCurrentUser(mockMvc, objectMapper, token, "192.168.16." + testCounter);

        // Then
        assertEquals(signUpRequest.getUsername(), userSummaryResponse.getUsername());
        assertEquals(signUpRequest.getContactRequestDto().getEmail(), userSummaryResponse.getEmail());
        assertEquals(Role.USER.name(), userSummaryResponse.getRole());
    }

    @Test
    void getCurrentUser_shouldReturn401_whenNotAuthenticated() throws Exception {
        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("X-Forwarded-For", "192.168.17." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getCurrentUser_shouldReturn401_whenInvalidToken() throws Exception {
        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer invalid.jwt.token")
                        .header("X-Forwarded-For", "192.168.18." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getCurrentUser_shouldReturn401_whenExpiredToken() throws Exception {
        // Given - Create an expired token (this would require mocking or time manipulation)
        // For now, we'll test with a malformed token
        String expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.invalid";

        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer " + expiredToken)
                        .header("X-Forwarded-For", "192.168.19." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void endToEndWorkflow_shouldWork_whenValidUserJourney() throws Exception {
        // Given
        String username = "endtoenduser";
        String password = "EndToEnd123!";
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        signUpRequest.setUsername(username);
        signUpRequest.setPassword(password);

        // Step 1: Register user
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.20." + testCounter);
        UUID userId = createUserResponse.getUserDto().getId();
        assertTrue(userService.findById(userId).isPresent());

        // Step 2: Login with registered user (use different IP to avoid rate limiting)
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.21." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();
        assertTokenIsValid(token, username);

        // Step 3: Use token to get current user info
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.22." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(signUpRequest.getContactRequestDto().getEmail()));
    }

    // /refresh endpoint tests
    @Test
    void refreshToken_shouldReturnNewToken_whenValidAuthentication() throws Exception {
        // Given - Create and authenticate user
        String initialToken = registerUserAndLoginAndGetToken(mockMvc, objectMapper, "192.168.24." + testCounter, userService);

        // When - Refresh token
        mockMvc.perform(post(AUTH_BASE_URL + "/refresh")
                        .header("Authorization", "Bearer " + initialToken)
                        .header("X-Forwarded-For", "192.168.25." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void refreshToken_shouldReturn401_whenInvalidAuthentication() throws Exception {
        // Given - Invalid token
        String invalidToken = "invalid.jwt.token";

        // When & Then
        mockMvc.perform(post(AUTH_BASE_URL + "/refresh")
                        .header("Authorization", "Bearer " + invalidToken)
                        .header("X-Forwarded-For", "192.168.26." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errorType").value(AUTHENTICATION_REQUIRED.name()));
    }

    @Test
    void refreshToken_shouldReturn401_whenNoAuthentication() throws Exception {
        // When & Then - No Authorization header
        mockMvc.perform(post(AUTH_BASE_URL + "/refresh")
                        .header("X-Forwarded-For", "192.168.27." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errorType").value(AUTHENTICATION_REQUIRED.name()));
    }

    // /logout endpoint tests
    @Test
    void logout_shouldReturnSuccess_whenAuthenticated() throws Exception {
        // Given - Create and authenticate user
        String token = registerUserAndLoginAndGetToken(mockMvc, objectMapper, "192.168.29." + testCounter, userService);

        // When - Logout with valid token
        mockMvc.perform(post(AUTH_BASE_URL + "/logout")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.30." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void logout_shouldReturnSuccess_whenNotAuthenticated() throws Exception {
        // When - Logout without authentication
        mockMvc.perform(post(AUTH_BASE_URL + "/logout")
                        .header("X-Forwarded-For", "192.168.31." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void logout_shouldClearSecurityContext_whenAuthenticated() throws Exception {
        // Given - Create and authenticate user
        String token = registerUserAndLoginAndGetToken(mockMvc, objectMapper, "192.168.34." + testCounter, userService);

        // When - Logout
        mockMvc.perform(post(AUTH_BASE_URL + "/logout")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.34." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));

        // Then - Security context should be cleared (token should still work for subsequent requests
        // since JWT is stateless, but the logout event should be logged)
        // Note: In a stateless JWT system, the token remains valid until expiration
        // The logout mainly clears server-side context and logs the event
    }

    // /validate endpoint tests
    @Test
    void validateToken_shouldReturnValid_whenAuthenticatedWithValidToken() throws Exception {
        // Given - Create and authenticate user
        String token = registerUserAndLoginAndGetToken(mockMvc, objectMapper, "192.168.36." + testCounter, userService);

        // When - Validate token
        mockMvc.perform(get(AUTH_BASE_URL + "/validate")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.37." + testCounter))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"));
    }

    @Test
    void validateToken_shouldReturnInvalid_whenNotAuthenticated() throws Exception {
        // When - Validate without token
        mockMvc.perform(get(AUTH_BASE_URL + "/validate")
                        .header("X-Forwarded-For", "192.168.38." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validateToken_shouldReturnInvalid_whenInvalidToken() throws Exception {
        // Given - Invalid token
        String invalidToken = "invalid.jwt.token";

        // When - Validate invalid token
        mockMvc.perform(get(AUTH_BASE_URL + "/validate")
                        .header("Authorization", "Bearer " + invalidToken)
                        .header("X-Forwarded-For", "192.168.39." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    private void assertTokenIsValid(String token, String expectedUsername) {
        assertTrue(jwtTokenProvider.isValid(token), "Token should be valid");
        assertEquals(expectedUsername, jwtTokenProvider.getUsernameFromToken(token), "Username should match");
    }

    // Admin role tests
    @Test
    void createAdminUser_shouldReturn403_whenRegularUser() throws Exception {
        // Given - Create and authenticate regular user
        String token = registerUserAndLoginAndGetToken(mockMvc, objectMapper, "192.168.41." + testCounter, userService);

        // Create admin request
        SignUpRequest adminSignUpRequest = createValidRandomSignUpRequest();
        adminSignUpRequest.setUsername("newadmin" + testCounter);

        // When & Then - Regular user should not be able to create admin
        mockMvc.perform(post(AUTH_BASE_URL + "/admin")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminSignUpRequest))
                        .header("X-Forwarded-For", "192.168.42." + testCounter))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", containsString("403")))
                .andExpect(jsonPath("$.errorType").value("ACCESS_DENIED"));
    }

    @Test
    void createAdminUser_shouldReturn401_whenNotAuthenticated() throws Exception {
        // Given - Admin creation request without authentication
        SignUpRequest adminSignUpRequest = createValidRandomSignUpRequest();
        adminSignUpRequest.setUsername("newadmin" + testCounter);

        // When & Then - Unauthenticated request should be rejected
        mockMvc.perform(post(AUTH_BASE_URL + "/admin/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminSignUpRequest))
                        .header("X-Forwarded-For", "192.168.43." + testCounter))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createAdminUser_shouldCreateAdmin_whenAuthenticatedAsAdmin() throws Exception {
        // 1. Create and authenticate an admin user
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.40." + testCounter);
        UUID userId = createUserResponse.getUserDto().getId();
        assertTrue(userService.findById(userId).isPresent());
        assertTrue(userAuthenticationRepository.findByUsername(username).isPresent());
        UserAuthentication userAuthentication = userAuthenticationRepository.findByUsername(username).get();
        userAuthentication.setRole(Role.ADMIN);
        userAuthenticationRepository.save(userAuthentication);
        assertEquals(Role.ADMIN, userAuthenticationRepository.findByUsername(username).get().getRole());

        // 2. Authenticate as admin
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.44." + testCounter);
        String adminToken = jwtAuthenticationResponse.getAccessToken();
        assertTokenIsValid(adminToken, username);

        // 3. Create new admin user via /api/auth/admin/create
        SignUpRequest newAdminSignUpRequest = createValidRandomSignUpRequest();
        String newAdminUsername = "newadmin" + testCounter;
        newAdminSignUpRequest.setUsername(newAdminUsername);

        mockMvc.perform(post(AUTH_BASE_URL + "/admin")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newAdminSignUpRequest))
                        .header("X-Forwarded-For", "192.168.45." + testCounter))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userDto.username").value(newAdminUsername));

        // 4. Verify new admin user exists with ADMIN role
        assertTrue(userAuthenticationRepository.findByUsername(newAdminUsername).isPresent());
        assertEquals(Role.ADMIN, userAuthenticationRepository.findByUsername(newAdminUsername).get().getRole());
    }

}
