package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.security.dto.JwtAuthenticationResponse;
import dev.hr.rezaei.buildflow.config.security.dto.LoginRequest;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.*;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

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
    private AuthService authService;

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
        // Clean up all data before each test
        userAuthenticationRepository.deleteAll();
        userRepository.deleteAll();
        contactRepository.deleteAll();
        contactAddressRepository.deleteAll();
        testCounter++;
    }

    @Test
    void registerUser_shouldPersistUser_whenValidRequest() throws Exception {
        // Given
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        ContactRequestDto contactRequestDto = signUpRequest.getContactRequestDto();
        String email = contactRequestDto.getEmail();

        // When
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest);
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
        registerUser(mockMvc, objectMapper, signUpRequest);

        SignUpRequest signUpRequest2 = createValidRandomSignUpRequest();
        signUpRequest2.setUsername(existingUsername); // Same username

        // When & Then - The AuthController now properly handles DuplicateUserException
        // and returns 409 Conflict with ErrorResponse format
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest2))
                        .header("X-Forwarded-For", "192.168.6." + testCounter))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message", containsString("conflict")))
                .andExpect(jsonPath("$.errors[0]", containsString("already taken")))
                .andExpect(jsonPath("$.errorType").value("CONFLICT_ERROR"));
    }

    @Test
    void registerUser_shouldReturn409_whenEmailAlreadyExists() throws Exception {
        // Given - Create existing user with same email (this actually updates the user)
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String existingUsername = signUpRequest.getUsername();
        String email = signUpRequest.getContactRequestDto().getEmail();
        registerUser(mockMvc, objectMapper, signUpRequest);

        SignUpRequest signUpRequest2 = createValidRandomSignUpRequest();
        signUpRequest2.getContactRequestDto().setEmail(email); // Same email, different username
        signUpRequest2.setUsername(existingUsername + "2"); // Different username

        // When & Then - The system updates the existing user
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest2))
                        .header("X-Forwarded-For", "192.168.7." + testCounter))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message", containsString("conflict")))
                .andExpect(jsonPath("$.errors[0]", containsString("already taken")))
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
                        .header("X-Forwarded-For", "192.168.8." + testCounter))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.errors", hasItem(containsString("Password"))));
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
                        .header("X-Forwarded-For", "192.168.9." + testCounter))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void authenticateUser_shouldReturnJwtToken_whenValidCredentials() throws Exception {
        // Given - Create a test user
        String username = "testuser1";
        String password = "TestPassword123!";
        createTestUser(username, password);

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        // When & Then
        MvcResult result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.1." + testCounter))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andReturn();

        // Verify the token is valid
        String responseJson = result.getResponse().getContentAsString();
        JwtAuthenticationResponse response = objectMapper.readValue(responseJson, JwtAuthenticationResponse.class);

        String token = response.getAccessToken();
        assertTokenIsValid(token, username);
    }

    @Test
    void authenticateUser_shouldReturn403_whenInvalidCredentials() throws Exception {
        // Given - Create a test user with different password
        String username = "testuser2";
        createTestUser(username, "CorrectPassword123!");

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password("WrongPassword123!")
                .build();

        // When & Then - Spring Security returns 403 for bad credentials by default
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.2." + testCounter))
                .andExpect(status().isForbidden());
    }

    @Test
    void authenticateUser_shouldReturn403_whenUserNotExists() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
                .username("nonexistentuser")
                .password("Password123!")
                .build();

        // When & Then - Spring Security returns 403 for non-existent users
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", "192.168.3." + testCounter))
                .andExpect(status().isForbidden());
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
                        .header("X-Forwarded-For", "192.168.4." + testCounter))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void getCurrentUser_shouldReturnUserInfo_whenAuthenticated() throws Exception {
        // Given - Create and authenticate user
        String username = "testuser4";
        String password = "TestPassword123!";
        createTestUser(username, password);
        String token = authenticateAndGetToken(username, password, "192.168.10." + testCounter);

        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.11." + testCounter))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").exists());
    }

    @Test
    void getCurrentUser_shouldReturn401_whenNotAuthenticated() throws Exception {
        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("X-Forwarded-For", "192.168.12." + testCounter))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getCurrentUser_shouldReturn401_whenInvalidToken() throws Exception {
        // When & Then
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer invalid.jwt.token")
                        .header("X-Forwarded-For", "192.168.13." + testCounter))
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
                        .header("X-Forwarded-For", "192.168.14." + testCounter))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void endToEndWorkflow_shouldWork_whenValidUserJourney() throws Exception {
        // Given
        String username = "endtoenduser";
        String password = "EndToEnd123!";
        String clientIp = "192.168.15." + testCounter;
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        signUpRequest.setUsername(username);
        signUpRequest.setPassword(password);

        // Step 1: Register user
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest))
                        .header("X-Forwarded-For", clientIp))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));

        // Step 2: Login with registered user (use different IP to avoid rate limiting)
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        String loginIp = "192.168.16." + testCounter;
        MvcResult loginResult = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", loginIp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andReturn();

        // Step 3: Use token to get current user info
        String responseJson = loginResult.getResponse().getContentAsString();
        JwtAuthenticationResponse authResponse = objectMapper.readValue(responseJson, JwtAuthenticationResponse.class);

        String currentUserIp = "192.168.17." + testCounter;
        mockMvc.perform(get(CURRENT_USER_URL)
                        .header("Authorization", "Bearer " + authResponse.getAccessToken())
                        .header("X-Forwarded-For", currentUserIp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(signUpRequest.getContactRequestDto().getEmail()));
    }

    // Helper methods

    private void createTestUser(String username, String password) {
        createTestUserWithEmail(username, password, username + "@example.com");
    }

    private void createTestUserWithEmail(String username, String password, String email) {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        signUpRequest.setUsername(username);
        signUpRequest.setPassword(password);
        signUpRequest.getContactRequestDto().setEmail(email);
        authService.registerUser(signUpRequest);
    }


    private String authenticateAndGetToken(String username, String password, String clientIp) throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        MvcResult result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .header("X-Forwarded-For", clientIp))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        JwtAuthenticationResponse response = objectMapper.readValue(responseJson, JwtAuthenticationResponse.class);
        return response.getAccessToken();
    }

    private void assertTokenIsValid(String token, String expectedUsername) {
        assertTrue(jwtTokenProvider.validateToken(token), "Token should be valid");
        assertEquals(expectedUsername, jwtTokenProvider.getUsernameFromToken(token), "Username should match");
    }

}
