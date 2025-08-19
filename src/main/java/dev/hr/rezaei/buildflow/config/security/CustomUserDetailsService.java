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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Load authentication credentials
        UserAuthentication userAuth = userAuthenticationRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Load business user data using UserService
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User data not found for: " + username));

        return UserPrincipal.create(user, userAuth.getPasswordHash());
    }
}
