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
        boolean isEmail = usernameOrEmail.contains("@") && usernameOrEmail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

        User user;
        UserAuthentication userAuth;

        if (isEmail) {
            user = userService.findByEmail(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrEmail));
        } else {
            user = userService.findByUsername(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + usernameOrEmail));
        }

        userAuth = userAuthenticationRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Authentication data not found for user: " + user.getUsername()));

        return UserPrincipal.create(user, userAuth, userAuth.getRole());
    }
}
