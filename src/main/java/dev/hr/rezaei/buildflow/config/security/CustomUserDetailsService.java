package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Custom UserDetailsService that loads user details from both
 * the business User entity and the authentication UserAuthentication entity.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;
    private final UserAuthenticationRepository userAuthenticationRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try to determine if input is email or username
        // Use a more robust email detection - check for @ and basic email pattern
        boolean isEmail = usernameOrEmail.contains("@") && usernameOrEmail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
        
        User user;
        UserAuthentication userAuth;
        
        if (isEmail) {
            // Load user by email first
            user = userService.findByEmail(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrEmail));
            
            // Load authentication credentials using the username from user
            userAuth = userAuthenticationRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("Authentication data not found for user: " + user.getUsername()));
        } else {
            // Load by username
            userAuth = userAuthenticationRepository.findByUsername(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));

            // Load business user data using UserService
            user = userService.findByUsername(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User data not found for: " + usernameOrEmail));
        }

        return UserPrincipal.create(user, userAuth, userAuth.getRole());
    }
}
