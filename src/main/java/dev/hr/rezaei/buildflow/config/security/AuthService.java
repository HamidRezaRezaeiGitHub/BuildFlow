package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.base.DuplicateUserException;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
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

    /**
     * Registers a new user with complete contact information and authentication credentials.
     * Uses the existing UserService to maintain proper domain separation.
     *
     * @param signUpRequest Registration request containing username, password, and contact info
     * @return The created User entity
     */
    @Transactional
    public User registerUser(SignUpRequest signUpRequest) {
        // Check if username already exists
        if (userAuthenticationRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateUserException("Username is already taken: " + signUpRequest.getUsername());
        }

        // Check if user with email already exists
        String email = signUpRequest.getContactRequestDto().getEmail();
        Optional<User> existingUser = userService.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update existing user to registered with username
            user.setUsername(signUpRequest.getUsername());
            user.setRegistered(true);
            user = userService.update(user);
            log.info("Updated existing user [{}] to registered status and username [{}]", user.getId(), signUpRequest.getUsername());
        } else {
            // Create new user using UserService with proper Contact information
            CreateUserRequest builderRequest = CreateUserRequest.builder()
                    .registered(true)
                    .contactRequestDto(signUpRequest.getContactRequestDto())
                    .username(signUpRequest.getUsername())
                    .build();

            CreateUserResponse response = userService.createUser(builderRequest);
            user = userService.findById(response.getUserDto().getId())
                    .orElseThrow(() -> new RuntimeException("Failed to create user"));

            log.info("Created new user: {}", user.getId());
        }

        // Create authentication entry
        UserAuthentication userAuth = UserAuthentication.builder()
                .username(signUpRequest.getUsername())
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .enabled(true)
                .build();

        userAuthenticationRepository.save(userAuth);

        log.info("User registration successful for username: {}", signUpRequest.getUsername());
        return user;
    }

    public Optional<User> findUserByUsername(String username) {
        return userService.findByUsername(username);
    }
}
