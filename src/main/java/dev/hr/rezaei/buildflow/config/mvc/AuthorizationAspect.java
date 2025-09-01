package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.base.UserNotAuthorizedException;
import dev.hr.rezaei.buildflow.config.security.UserPrincipal;
import org.aspectj.lang.JoinPoint;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public interface AuthorizationAspect {

    default UserPrincipal authenticate(JoinPoint joinPoint) {
        Authentication auth = null;
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof Authentication) {
                auth = (Authentication) arg;
                break;
            }
        }

        if (auth == null) {
            auth = SecurityContextHolder.getContext().getAuthentication();
        }

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new AuthenticationCredentialsNotFoundException("Authentication required!");
        }

        return (UserPrincipal) auth.getPrincipal();
    }

    void authorize(JoinPoint joinPoint) throws UserNotAuthorizedException;

    void validate(JoinPoint joinPoint) throws Exception;
}
