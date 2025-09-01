package dev.hr.rezaei.buildflow.project.auth;

import dev.hr.rezaei.buildflow.base.UserNotAuthorizedException;
import dev.hr.rezaei.buildflow.config.mvc.AuthorizationAspect;
import dev.hr.rezaei.buildflow.config.security.UserPrincipal;
import dev.hr.rezaei.buildflow.project.ProjectService;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class ProjectAuthorizationAspect implements AuthorizationAspect {

    private final UserService userService;
    private final ProjectService projectService;

    @Value("${spring.security.enabled:true}")
    private boolean securityEnabled;

    @Before("@annotation(RequireProjectCreationAccess)")
    public void checkProjectCreationAccess(JoinPoint joinPoint) {
        log.debug("Checking project creation authorization ...");
        if (securityEnabled) {
            authenticate(joinPoint);
            authorize(joinPoint);
        }
        validate(joinPoint);
        log.debug("Project creation authorization passed.");
    }

    private CreateProjectRequest getCreateProjectRequest(JoinPoint joinPoint) {
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof CreateProjectRequest) {
                return (CreateProjectRequest) arg;
            }
        }
        throw new IllegalArgumentException("CreateProjectRequest required!");
    }

    @Override
    public void authorize(JoinPoint joinPoint) {
        UserPrincipal userPrincipal = authenticate(joinPoint);
        if (userPrincipal.isAdmin()) return;

        String username = userPrincipal.getUsername();
        Optional<User> optionalUser = userService.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Authenticated user not found");
        }
        User user = optionalUser.get();
        UUID userId = user.getId();

        CreateProjectRequest request = getCreateProjectRequest(joinPoint);
        UUID builderId = request.getBuilderId();
        UUID ownerId = request.getOwnerId();
        if (!userId.equals(builderId) && !userId.equals(ownerId)) {
            throw new UserNotAuthorizedException("User not authorized to create project for other users");
        }
    }

    @Override
    public void validate(JoinPoint joinPoint) {
        CreateProjectRequest request = getCreateProjectRequest(joinPoint);
        projectService.validate(request);
    }
}
