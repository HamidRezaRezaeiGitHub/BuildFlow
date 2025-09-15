package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.base.DuplicateUserException;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for handling authentication-related operations while maintaining proper layered architecture.
 * This service integrates authentication concerns with the business domain through UserService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserAuthenticationRepository userAuthenticationRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityAuditService securityAuditService;

    /**
     * Registers a new user with complete contact information and authentication credentials.
     * Uses the existing UserService to maintain proper domain separation.
     *
     * @param signUpRequest Registration request containing username, password, and contact info
     * @return The created User entity
     */
    @Transactional
    public CreateUserResponse registerUser(SignUpRequest signUpRequest) {
        return registerUserWithRole(signUpRequest, Role.USER);
    }

    /**
     * Registers a new user with a specific role.
     * Used for creating admin users or when role needs to be explicitly set.
     *
     * @param signUpRequest Registration request containing username, password, and contact info
     * @param role          The role to assign to the new user
     * @return The created User entity
     */
    @Transactional
    public CreateUserResponse registerUserWithRole(SignUpRequest signUpRequest, Role role) {
        String username = signUpRequest.getUsername();
        ContactRequestDto contactRequestDto = signUpRequest.getContactRequestDto();
        String email = contactRequestDto.getEmail();

        // Check if username already exists
        if (userAuthExistsByUsername(username) || userExistsByUsername(username)) {
            securityAuditService.logRegistrationAttempt(username, email, false, "Username already taken");
            throw new DuplicateUserException("Username is already taken: " + username);
        }

        // Check if user with email already exists
        if (userExistsByEmail(email)) {
            securityAuditService.logRegistrationAttempt(username, email, false, "Email already in use");
            throw new DuplicateUserException("There is already a user with the email: " + email);
        }

        // Create new user using UserService with proper Contact information
        CreateUserRequest createUserRequest = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(contactRequestDto)
                .username(username)
                .build();

        CreateUserResponse response = userService.createUser(createUserRequest);
        User user = userService.findById(response.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("Failed to create user"));
        log.info("Created new user: {} with role: {}", user.getId(), role);

        // Create authentication entry with specified role
        UserAuthentication userAuth = UserAuthentication.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(role)
                .enabled(true)
                .build();
        userAuthenticationRepository.save(userAuth);

        securityAuditService.logRegistrationAttempt(username, email, true, "User registered successfully");
        return response;
    }

    /**
     * Creates an admin user with elevated privileges.
     * This method should be used carefully and typically only during system setup.
     *
     * @param signUpRequest Registration request containing username, password, and contact info
     * @return The created User entity with admin role
     */
    @Transactional
    public CreateUserResponse createAdminUser(SignUpRequest signUpRequest) {
        return registerUserWithRole(signUpRequest, Role.ADMIN);
    }

    public Optional<User> findUserByUsername(String username) {
        return userService.findByUsername(username);
    }

    public boolean userExistsByUsername(String username) {
        return userAuthenticationRepository.existsByUsername(username);
    }

    public boolean userExistsByEmail(String email) {
        return userService.existsByEmail(email);
    }

    public Optional<UserAuthentication> findUserAuthByUsername(String username) {
        return userAuthenticationRepository.findByUsername(username);
    }

    public boolean userAuthExistsByUsername(String username) {
        return userAuthenticationRepository.existsByUsername(username);
    }

    public boolean isValidNewUsername(String username) {
        return !userAuthExistsByUsername(username) && !userExistsByUsername(username);
    }

    public List<UserAuthentication> findAllUserAuthentications() {
        return userAuthenticationRepository.findAll();
    }
}
