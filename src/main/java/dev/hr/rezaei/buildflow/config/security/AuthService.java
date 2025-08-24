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
        String username = signUpRequest.getUsername();
        ContactRequestDto contactRequestDto = signUpRequest.getContactRequestDto();
        String email = contactRequestDto.getEmail();

        // Check if username already exists
        if (userAuthenticationRepository.existsByUsername(username)) {
            securityAuditService.logRegistrationAttempt(username, email, false, "Username already taken");
            throw new DuplicateUserException("Username is already taken: " + username);
        }

        // Check if user with email already exists
        if (userService.existsByEmail(email)) {
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
        log.info("Created new user: {}", user.getId());

        // Create authentication entry
        UserAuthentication userAuth = UserAuthentication.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .enabled(true)
                .build();
        userAuthenticationRepository.save(userAuth);

        securityAuditService.logRegistrationAttempt(username, email, true, "User registered successfully");
        return response;
    }

    public Optional<User> findUserByUsername(String username) {
        return userService.findByUsername(username);
    }
}
