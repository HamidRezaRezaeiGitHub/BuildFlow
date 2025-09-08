package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.config.security.UserPrincipal;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public abstract class AbstractAuthorizationHandler {

    private final UserService userService;

    public UserPrincipal getUserPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new AuthenticationCredentialsNotFoundException("Authentication required!");
        }
        return (UserPrincipal) authentication.getPrincipal();
    }

    public User getAuthenticatedUser(UserPrincipal userPrincipal) {
        Optional<User> optionalUser = userService.findByUsername(userPrincipal.getUsername());
        if (optionalUser.isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Authenticated user not found in the system!");
        }
        return optionalUser.get();
    }

    public User getAuthenticatedUser(Authentication authentication) {
        UserPrincipal userPrincipal = getUserPrincipal(authentication);
        return getAuthenticatedUser(userPrincipal);
    }

    public User getAuthenticatedUser(UserPrincipal userPrincipal, String requestedAction) {
        User user = getAuthenticatedUser(userPrincipal);
        log.debug("User [{}] has requested to {}.", user.getUsername(), requestedAction);
        return user;
    }

    public User getAuthenticatedUser(Authentication authentication, String requestedAction) {
        UserPrincipal userPrincipal = getUserPrincipal(authentication);
        return getAuthenticatedUser(userPrincipal, requestedAction);
    }

    public boolean isAdmin(Authentication authentication) {
        UserPrincipal userPrincipal = getUserPrincipal(authentication);
        return userPrincipal.isAdmin();
    }
}
