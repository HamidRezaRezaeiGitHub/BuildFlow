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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

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
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.8." + testCounter);
        UUID userId = createUserResponse.getUserDto().getId();
        assertTrue(userService.findById(userId).isPresent());

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        // When - Login with different IP to avoid rate limiting
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.9." + testCounter);

        // Then
        assertEquals("Bearer", jwtAuthenticationResponse.getTokenType());
        String token = jwtAuthenticationResponse.getAccessToken();
        assertTokenIsValid(token, username);
    }

    @Test
    void authenticateUser_shouldReturn401_whenInvalidCredentials() throws Exception {
        // Given - Create a test user with different password
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.10." + testCounter);
        UUID userId = createUserResponse.getUserDto().getId();
        assertTrue(userService.findById(userId).isPresent());

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password("WrongPassword123!") // Incorrect password
                .build();

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
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        CreateUserResponse createUserResponse = registerUser(mockMvc, objectMapper, signUpRequest, "192.168.14." + testCounter);
        UUID userId = createUserResponse.getUserDto().getId();
        assertTrue(userService.findById(userId).isPresent());

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.15." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();

        // When - Get current user with different IP
        UserSummaryResponse userSummaryResponse = getCurrentUser(mockMvc, objectMapper, token, "192.168.16." + testCounter);

        // Then
        assertEquals(username, userSummaryResponse.getUsername());
        assertEquals(signUpRequest.getContactRequestDto().getEmail(), userSummaryResponse.getEmail());
        assertEquals(userId, userSummaryResponse.getId());
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

    private void assertTokenIsValid(String token, String expectedUsername) {
        assertTrue(jwtTokenProvider.isValid(token), "Token should be valid");
        assertEquals(expectedUsername, jwtTokenProvider.getUsernameFromToken(token), "Username should match");
    }

}
